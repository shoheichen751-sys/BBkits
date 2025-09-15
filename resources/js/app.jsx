import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { Toaster } from 'react-hot-toast';

// Import Ziggy for routing
import { Ziggy } from './ziggy';

// Simple, reliable route helper that always returns a valid object
function route(name, params = {}, absolute = false) {
    console.log('ROUTE FUNCTION CALLED:', name, params, absolute);

    // Always ensure we have a fallback
    if (!name) {
        console.log('No name provided, returning fallback');
        return createRouteObject('/', ['GET', 'HEAD']);
    }

    let url = '';
    let methods = ['GET', 'HEAD']; // default methods

    try {
        // Check for route data in both window.Ziggy and imported Ziggy
        const routeData = (window.Ziggy && window.Ziggy.routes && window.Ziggy.routes[name]) ||
                         (Ziggy && Ziggy.routes && Ziggy.routes[name]);

        console.log('Route data found:', !!routeData, 'for route:', name);
        if (routeData) {
            console.log('Route data:', routeData);
        }

        if (routeData) {
            url = routeData.uri;
            methods = routeData.methods || ['GET', 'HEAD'];

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
        } else {
            console.log('No route data found, using fallback for:', name);
            // Fallback: convert route name to URL path
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
        console.error('Route error:', error);
        // Emergency fallback
        url = '/' + name.replace(/\./g, '/');
    }

    // For Inertia Link components, just return the URL string
    console.log('ROUTE RESULT URL:', url, 'type:', typeof url);
    return url;
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
