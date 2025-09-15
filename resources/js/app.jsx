import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { Toaster } from 'react-hot-toast';

// Import Ziggy for routing
import { Ziggy } from './ziggy';

// BULLETPROOF route helper that NEVER returns null and ALWAYS returns an object with method
function route(name, params = {}, absolute = false) {
    // NEVER return null - always return a valid object with method property
    if (!name || typeof name !== 'string') {
        console.warn('Invalid route name provided:', name);
        return createRouteObject('/dashboard', ['GET', 'HEAD']);
    }

    let url = '';

    try {
        // Check for route data in both window.Ziggy and imported Ziggy
        const routeData = (window.Ziggy && window.Ziggy.routes && window.Ziggy.routes[name]) ||
                         (Ziggy && Ziggy.routes && Ziggy.routes[name]);

        if (routeData && routeData.uri) {
            url = routeData.uri;

            // Replace parameters in the URL
            if (params && typeof params === 'object') {
                Object.keys(params).forEach(key => {
                    const value = params[key];
                    if (value !== undefined && value !== null) {
                        url = url.replace(`{${key}}`, value);
                        url = url.replace(`{${key}?}`, value); // optional parameters
                    }
                });
            }

            // Clean up any remaining optional parameters
            url = url.replace(/\{[^}]+\?\}/g, '');

            // Add leading slash if missing
            if (!url.startsWith('/')) {
                url = '/' + url;
            }

            // Add base URL if absolute
            if (absolute) {
                const baseUrl = (window.Ziggy && window.Ziggy.url) || (Ziggy && Ziggy.url) || '';
                if (baseUrl) {
                    url = baseUrl.replace(/\/$/, '') + url;
                }
            }

            // Return route object with methods from routeData
            const methods = routeData.methods || ['GET', 'HEAD'];
            return createRouteObject(url, methods);
        } else {
            // Fallback: convert route name to URL path
            console.warn('Route not found in Ziggy, using fallback for:', name);
            if (name.includes('.')) {
                const parts = name.split('.');
                if (parts[parts.length - 1] === 'index') {
                    parts.pop(); // remove 'index'
                }
                url = '/' + parts.join('/');
            } else {
                url = `/${name}`;
            }
        }
    } catch (error) {
        console.error('Route generation error:', error, 'for route:', name);
        // Emergency fallback - never return null
        url = '/' + String(name).replace(/\./g, '/');
    }

    // GUARANTEE: always return a valid route object
    if (!url || typeof url !== 'string') {
        console.error('Route function would return invalid value:', url, 'for:', name);
        return createRouteObject('/dashboard', ['GET', 'HEAD']);
    }

    return createRouteObject(url, ['GET', 'HEAD']);
}

// Helper function to create consistent route objects
function createRouteObject(url, methods = ['GET', 'HEAD']) {
    const routeObj = {
        url: url,
        method: methods[0] || 'GET', // Always have a method
        methods: methods || ['GET', 'HEAD'],
        toString: function() { return url; },
        valueOf: function() { return url; }
    };

    // Add Symbol.toPrimitive for better string coercion
    routeObj[Symbol.toPrimitive] = function(hint) {
        return url;
    };

    return routeObj;
}

// Make route function available globally immediately
window.route = route;

// Also ensure it's available in global scope for modules
globalThis.route = route;

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        // Set up Ziggy for routes
        if (props.initialPage && props.initialPage.props.ziggy) {
            window.Ziggy = props.initialPage.props.ziggy;
        } else if (Ziggy) {
            window.Ziggy = Ziggy;
        }

        // Debug: log available routes in development
        if (process.env.NODE_ENV === 'development' && window.Ziggy) {
            console.log('Ziggy routes loaded:', Object.keys(window.Ziggy.routes || {}));
        }

        root.render(
            <>
                <App {...props} />
                <Toaster
                    position="top-right"
                    toastOptions={{
                        duration: 4000,
                        style: {
                            background: '#fff',
                            color: '#374151',
                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                        },
                        success: {
                            iconTheme: {
                                primary: '#10b981',
                                secondary: '#fff',
                            },
                        },
                        error: {
                            iconTheme: {
                                primary: '#ef4444',
                                secondary: '#fff',
                            },
                        },
                    }}
                />
            </>
        );
    },
    progress: {
        color: '#ec4899',
    },
});
