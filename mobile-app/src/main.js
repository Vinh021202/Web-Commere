import { createApp } from './App.js';

const root = document.querySelector('#app');
const app = createApp(root);

app.init();

if ('serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
  navigator.serviceWorker.register('./service-worker.js').catch(() => {});
}
