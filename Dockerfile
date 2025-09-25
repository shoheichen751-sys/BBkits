# ------------------------------
# 1. Build Frontend (Vite)
# ------------------------------
FROM node:18 AS frontend

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy frontend source and configuration
COPY resources resources
COPY vite.config.js ./
COPY tailwind.config.js ./
# Only copy the basic public directory structure needed for Vite (not Laravel files)
RUN mkdir -p public

# Force cache bust - change this comment to force rebuild: v1.1
RUN echo "Force rebuild timestamp: $(date)" && rm -rf public/build/*

# Build frontend with environment variable
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}
RUN npm run build

# Verify build was successful and show exact filenames
RUN ls -la public/build/assets/ && echo "Build assets created successfully at $(date)"

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

# Debug: Check what was actually copied
RUN echo "=== DEBUGGING: Checking copied files ===" && \
    ls -la . | head -10 && \
    echo "=== Checking if critical files exist ===" && \
    (ls -la public/index.php || echo "public/index.php NOT COPIED") && \
    (ls -la server.php || echo "server.php NOT COPIED") && \
    echo "=== Checking .dockerignore effects ===" && \
    ls -la public/ && echo "Public directory after copy"

# Verify composer files exist
RUN ls -la composer.json composer.lock || echo "WARNING: Composer files missing"

# Verify public directory structure before copying assets
RUN ls -la public/ && echo "Public directory contents before asset copy"

# Ensure public/build directory exists and clear any old assets
RUN mkdir -p public/build && rm -rf public/build/*

# Copy built frontend assets only (not entire public directory)
COPY --from=frontend /app/public/build ./public/build

# Verify assets were copied and check for critical files
RUN ls -la public/build/assets/ | head -5 && echo "Assets copied successfully" && \
    (ls -la public/index.php && echo "index.php exists" || echo "index.php MISSING - will be created") && \
    (ls -la server.php && echo "server.php exists" || echo "server.php MISSING - will be created")

# Final verification before proceeding
RUN echo "=== DEBUGGING: Checking all critical files ===" && \
    find public -name "*.php" -o -name "*.ico" -o -name "*.txt" -o -name ".htaccess" | sort && \
    echo "=== End of public directory files ===" && \
    ls -la public/index.php || echo "index.php MISSING!" && \
    ls -la server.php || echo "server.php MISSING!"

# Ensure critical Laravel files exist - create if missing
RUN if [ ! -f public/index.php ]; then \
        echo "WARNING: public/index.php missing, creating default..." && \
        echo '<?php' > public/index.php && \
        echo '' >> public/index.php && \
        echo 'use Illuminate\Foundation\Application;' >> public/index.php && \
        echo 'use Illuminate\Http\Request;' >> public/index.php && \
        echo '' >> public/index.php && \
        echo "define('LARAVEL_START', microtime(true));" >> public/index.php && \
        echo '' >> public/index.php && \
        echo '// Determine if the application is in maintenance mode...' >> public/index.php && \
        echo "if (file_exists(\$maintenance = __DIR__.'/../storage/framework/maintenance.php')) {" >> public/index.php && \
        echo '    require $maintenance;' >> public/index.php && \
        echo '}' >> public/index.php && \
        echo '' >> public/index.php && \
        echo '// Register the Composer autoloader...' >> public/index.php && \
        echo "require __DIR__.'/../vendor/autoload.php';" >> public/index.php && \
        echo '' >> public/index.php && \
        echo '// Bootstrap Laravel and handle the request...' >> public/index.php && \
        echo '/** @var Application $app */' >> public/index.php && \
        echo "\$app = require_once __DIR__.'/../bootstrap/app.php';" >> public/index.php && \
        echo '' >> public/index.php && \
        echo '$app->handleRequest(Request::capture());' >> public/index.php; \
    fi && \
    if [ ! -f server.php ]; then \
        echo "WARNING: server.php missing, creating default..." && \
        echo '<?php' > server.php && \
        echo '$uri = urldecode(parse_url($_SERVER["REQUEST_URI"], PHP_URL_PATH) ?? "");' >> server.php && \
        echo '$publicPath = __DIR__ . "/public";' >> server.php && \
        echo '$filePath = $publicPath . $uri;' >> server.php && \
        echo 'if ($uri !== "/" && file_exists($filePath) && is_file($filePath)) {' >> server.php && \
        echo '    $extension = strtolower(pathinfo($filePath, PATHINFO_EXTENSION));' >> server.php && \
        echo '    $mimeTypes = ["css" => "text/css", "js" => "application/javascript", "json" => "application/json"];' >> server.php && \
        echo '    if (isset($mimeTypes[$extension])) header("Content-Type: " . $mimeTypes[$extension]);' >> server.php && \
        echo '    if (strpos($uri, "/build/") !== false) header("Cache-Control: public, max-age=31536000");' >> server.php && \
        echo '    readfile($filePath); exit;' >> server.php && \
        echo '}' >> server.php && \
        echo 'require_once __DIR__ . "/public/index.php";' >> server.php; \
    fi

# Make sure server.php is executable
RUN chmod +x server.php

# Create SQLite database (if used) and setup .env
RUN mkdir -p database && touch database/database.sqlite && chown -R www-data:www-data database

# Remove broken storage symlink and prepare storage structure
RUN rm -f public/storage && \
    mkdir -p storage/app/public

# Setup .env file (without key:generate yet)
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
    fi

# Clear composer cache and install PHP dependencies
RUN composer clear-cache && \
    composer install --no-dev --no-interaction --prefer-dist --optimize-autoloader --verbose

# Generate application key AFTER composer install
RUN php artisan key:generate --force || true

# Create storage symlink
RUN php artisan storage:link || echo "Storage link will be created at runtime"

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
        if composer install --no-dev --no-interaction --prefer-dist --optimize-autoloader --verbose; then \
            echo "Composer install completed"; \
        else \
            echo "Composer install failed!" && exit 1; \
        fi; \
    fi && \
    echo "Vendor directory verified ✓" && \
    ls -la vendor/ && \
    echo "Autoload file exists: $(ls -la vendor/autoload.php)" && \
    echo "=== Verifying Critical Files ===" && \
    ls -la public/index.php || (echo "ERROR: public/index.php missing!" && exit 1) && \
    ls -la server.php || (echo "ERROR: server.php missing!" && exit 1) && \
    echo "=== Checking Database File ===" && \
    ls -la database/database.sqlite && \
    echo "=== Ensuring Storage Link ===" && \
    (php artisan storage:link || echo "Storage link creation failed, continuing...") && \
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
