import Home from "./shared/presentation/views/home.vue";
import SignUp from "./identity/presentation/views/sign-in.vue";
import SignIn from "./identity/presentation/views/sign-up.vue";
import {createRouter, createWebHistory} from "vue-router";
import inventoryRoutes from "./inventory/presentation/inventory.routes.js";
import ordersRoutes from "./orders/presentation/orders.routes.js";
import dashboardRoutes from "./dashboard/presentation/dashboard.routes.js";

const pageNotFound = () => import('./shared/presentation/views/page-not-found.vue');

const routes = [
    { path: '/home',            name: 'home',       component: Home,            meta: { title: 'Home' } },
    { path: '/sign-up',         name: 'sign-up',    component: SignUp,          meta: { title: 'Sign Up' } },
    { path: '/sign-in',         name: 'sign-in',    component: SignIn,          meta: { title: 'Sign In' } },
    { path: '/sign-in/user-type', name: 'sign-in-user-type', component: () => import('./identity/presentation/views/sign-in/user-type.vue'), meta: { title: 'Tipo de Usuario' } },
    { path: '/recovery-password', name: 'recovery-password', component: () => import('./identity/presentation/views/recovery-password.vue'), meta: { title: 'Recuperar Contraseña' } },
    { path: '/inventory',      name: 'inventory', children: inventoryRoutes },
    { path: '/orders',         name: 'orders',    children: ordersRoutes },
    { path: '/',                redirect: '/sign-in'},
    { path: '/:pathMatch(.*)*', name: 'not-found',  component: pageNotFound,    meta: { title: 'Page Not Found' } },
    { path: '/dashboard', name: 'dashboard-main', children: dashboardRoutes },
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