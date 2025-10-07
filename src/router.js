import Home from "./shared/presentation/views/home.vue";
import {createRouter, createWebHistory} from "vue-router";
import inventoryRoutes from "./inventory/presentation/inventory.routes.js";

const pageNotFound = () => import('./shared/presentation/views/page-not-found.vue');

const routes = [
    { path: '/home',            name: 'home',       component: Home,            meta: { title: 'Home' } },
    { path: '/inventory',      name: 'inventory', children: inventoryRoutes },
    { path: '/',                redirect: '/home'},
    { path: '/:pathMatch(.*)*', name: 'not-found',  component: pageNotFound,    meta: { title: 'Page Not Found' } },
];

const router = createRouter({
    history:    createWebHistory(import.meta.env.BASE_URL),
    routes:     routes,
});

router.beforeEach((to, from, next) => {
    console.log(`Navigating from ${from.name} to ${to.name}`);
    let baseTitle = 'WineSoft';
    document.title = to.meta['title'] ? `${to.meta['title']} - ${baseTitle}` : baseTitle;
    next();
});

export default router;
