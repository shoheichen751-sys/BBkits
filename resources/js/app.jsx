import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { Toaster } from 'react-hot-toast';

// Import Ziggy for routing
import { Ziggy } from './ziggy';

// Enhanced route helper function that returns route object with method
function route(name, params = {}, absolute = false) {
    let url = '';
    let methods = ['GET', 'HEAD']; // default methods

    // Check for route data in both window.Ziggy and imported Ziggy
    const routeData = (window.Ziggy && window.Ziggy.routes && window.Ziggy.routes[name]) ||
                     (Ziggy && Ziggy.routes && Ziggy.routes[name]);

    if (routeData) {
        url = routeData.uri;
        methods = routeData.methods || ['GET', 'HEAD'];

        // Replace parameters in the URL
        if (params && typeof params === 'object') {
            Object.keys(params).forEach(key => {
                const value = params[key];
                url = url.replace(`{${key}}`, value);
                url = url.replace(`{${key}?}`, value); // optional parameters
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
        // Better fallback: try to convert route name to URL path
        console.warn(`Route '${name}' not found in Ziggy routes`);

        // Convert route names like 'admin.suppliers.index' to '/admin/suppliers'
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

    // Create route object that works as both string and object
    const routeObj = {
        url: url,
        method: methods[0], // primary method
        methods: methods,
        toString: () => url, // Allow route() to be used as string
        valueOf: () => url
    };

    // Make the object itself act like a string when used in contexts that expect strings
    return new Proxy(routeObj, {
        get(target, prop) {
            if (prop === Symbol.toPrimitive) {
                return () => url;
            }
            if (prop === 'href' || prop === 'pathname') {
                return url;
            }
            return target[prop];
        }
    });
}

// Make route function available globally
window.route = route;

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
