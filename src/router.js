import Home from "./shared/presentation/views/home.vue";
import Login from "./shared/presentation/views/login.vue";
import Register from "./shared/presentation/views/register.vue";
import {createRouter, createWebHistory} from "vue-router";
import inventoryRoutes from "./inventory/presentation/inventory.routes.js";

const pageNotFound = () => import('./shared/presentation/views/page-not-found.vue');

const routes = [
    { path: '/home',            name: 'home',       component: Home,            meta: { title: 'Home' } },
    { path: '/login',           name: 'login',      component: Login,           meta: { title: 'Login' } },
    { path: '/register',        name: 'register',   component: Register,        meta: { title: 'Register' } },
    { path: '/register/user-type', name: 'register-user-type', component: () => import('./shared/presentation/views/register/user-type.vue'), meta: { title: 'Tipo de Usuario' } },
    { path: '/inventory',      name: 'inventory', children: inventoryRoutes },
    { path: '/',                redirect: '/login'},
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
