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

    const routeData = (window.Ziggy && window.Ziggy.routes[name]) || (Ziggy && Ziggy.routes[name]);

    if (routeData) {
        url = routeData.uri;
        methods = routeData.methods || ['GET', 'HEAD'];

        // Replace parameters in the URL
        if (params && typeof params === 'object') {
            Object.keys(params).forEach(key => {
                url = url.replace(`{${key}}`, params[key]);
                url = url.replace(`{${key}?}`, params[key]); // optional parameters
            });
        }

        // Add base URL if absolute
        const baseUrl = (window.Ziggy && window.Ziggy.url) || (Ziggy && Ziggy.url) || '';
        if (absolute && baseUrl) {
            url = baseUrl.replace(/\/$/, '') + '/' + url.replace(/^\//, '');
        } else if (!url.startsWith('/')) {
            url = '/' + url;
        }
    } else {
        // Fallback for unknown routes
        url = `/${name}`;
    }

    // Return route object with methods and url for compatibility
    return {
        url: url,
        method: methods[0], // primary method
        methods: methods,
        toString: () => url, // Allow route() to be used as string
        valueOf: () => url
    };
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
