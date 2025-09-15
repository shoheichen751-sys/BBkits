import axios from 'axios';
window.axios = axios;

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

// Route function will be defined in app.jsx
console.log('Bootstrap: route function will be defined in app.jsx');
