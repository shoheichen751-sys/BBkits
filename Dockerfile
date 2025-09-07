# ------------------------------
# 1. Build Frontend (Vite)
# ------------------------------
FROM node:18 AS frontend

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy frontend source
COPY resources resources
COPY vite.config.js ./
COPY tailwind.config.js ./
COPY public public

# Build frontend with environment variable
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}
RUN npm run build

# ------------------------------
# 2. Build Laravel Backend
# ------------------------------
FROM php:8.2-fpm AS backend

# Install system dependencies and PHP extensions
RUN apt-get update && apt-get install -y \
    libpng-dev libonig-dev libxml2-dev libsqlite3-dev sqlite3 pkg-config zip unzip curl git \
 && docker-php-ext-configure pdo_sqlite \
 && docker-php-ext-install pdo pdo_mysql pdo_sqlite mbstring exif pcntl bcmath gd \
 && apt-get clean && rm -rf /var/lib/apt/lists/* \
 && php -r "if (!extension_loaded('pdo_sqlite')) { exit(1); }" \
 && echo "PDO SQLite extension successfully installed"

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

# Copy backend files
COPY . .

# Verify composer files exist
RUN ls -la composer.json composer.lock || echo "WARNING: Composer files missing"

# Copy built frontend assets only (not entire public directory)
COPY --from=frontend /app/public/build ./public/build

# Make sure server.php is executable
RUN chmod +x server.php

# Create SQLite database (if used) and setup .env
RUN mkdir -p database && touch database/database.sqlite && chown -R www-data:www-data database

# Setup .env file
RUN if [ -f .env.example ] && [ ! -f .env ]; then cp .env.example .env; fi && \
    if [ -f .env ]; then \
        sed -i 's|APP_URL=.*|APP_URL=https://bbkits.onrender.com|g' .env && \
        sed -i 's|APP_ENV=.*|APP_ENV=production|g' .env && \
        sed -i 's|APP_DEBUG=.*|APP_DEBUG=false|g' .env && \
        sed -i 's|LOG_LEVEL=.*|LOG_LEVEL=error|g' .env && \
        sed -i 's|DB_DATABASE=.*|DB_DATABASE=/var/www/database/database.sqlite|g' .env; \
    else \
        echo "APP_NAME=BBKits" > .env && \
        echo "APP_ENV=production" >> .env && \
        echo "APP_KEY=" >> .env && \
        echo "APP_DEBUG=false" >> .env && \
        echo "APP_URL=https://bbkits.onrender.com" >> .env && \
        echo "DB_CONNECTION=sqlite" >> .env && \
        echo "DB_DATABASE=/var/www/database/database.sqlite" >> .env && \
        echo "SESSION_DRIVER=database" >> .env && \
        echo "CACHE_STORE=database" >> .env && \
        echo "QUEUE_CONNECTION=database" >> .env && \
        echo "LOG_LEVEL=error" >> .env; \
    fi && \
    php artisan key:generate --force || true

# Clear composer cache and install PHP dependencies
RUN composer clear-cache && \
    composer install --no-dev --no-interaction --prefer-dist --optimize-autoloader --verbose

# Ensure Laravel cache/storage folders exist
RUN mkdir -p bootstrap/cache storage/framework/{views,cache,sessions} storage/logs \
 && chmod -R 775 storage bootstrap/cache database \
 && chown -R www-data:www-data storage bootstrap/cache database

EXPOSE 10000

# ------------------------------
# 3. Runtime Commands
# ------------------------------
CMD set -e && \
    echo "=== Starting BBKits Application ===" && \
    mkdir -p bootstrap/cache storage/framework/{views,cache,sessions} storage/logs && \
    chmod -R 775 storage bootstrap/cache database && \
    chown -R www-data:www-data storage bootstrap/cache database && \
    echo "=== Checking PHP Extensions ===" && \
    php -r "if (!extension_loaded('pdo_sqlite')) { echo 'ERROR: PDO SQLite not loaded'; exit(1); }" && \
    echo "PDO SQLite is loaded ✓" && \
    echo "=== Ensuring Composer Dependencies ===" && \
    if [ ! -d "vendor" ] || [ ! -f "vendor/autoload.php" ]; then \
        echo "ERROR: Vendor directory missing! Installing composer dependencies..." && \
        composer install --no-dev --no-interaction --prefer-dist --optimize-autoloader --verbose && \
        echo "Composer install completed" || exit 1; \
    fi && \
    echo "Vendor directory verified ✓" && \
    ls -la vendor/ && \
    echo "Autoload file exists: $(ls -la vendor/autoload.php)" && \
    echo "=== Checking Database File ===" && \
    ls -la database/database.sqlite && \
    echo "=== Running Migrations ===" && \
    php artisan migrate:fresh --force && \
    echo "=== Seeding Database ===" && \
    (php artisan db:seed --force || echo "Database seeding failed, continuing...") && \
    echo "=== Clearing Caches ===" && \
    php artisan config:clear || true && \
    php artisan cache:clear || true && \
    php artisan view:clear || true && \
    echo "=== Optimizing Application ===" && \
    php artisan optimize && \
    echo "=== Running Custom Commands ===" && \
    php artisan receipts:migrate-to-base64 || true && \
    echo "=== Testing Application Health ===" && \
    php artisan --version && \
    php -r "echo 'PHP is working: ' . PHP_VERSION . PHP_EOL;" && \
    echo "=== Starting Web Server ===" && \
    echo "Application ready! Starting server on port 10000..." && \
    php -S 0.0.0.0:10000 server.php
