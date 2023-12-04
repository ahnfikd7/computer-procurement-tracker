import { createApp } from 'vue'
import App from './App.vue'
import { createRouter, createWebHistory } from 'vue-router';
import IncidentTracker from './components/IncidentTracker.vue';

const router = createRouter({
    history: createWebHistory(),
    routes: [
      { path: '/', component: IncidentTracker },
      // ... other routes
    ],
  });

  const app = createApp(App);
  app.use(router);
  app.mount('#app');
