const dashboardView = () => import('./views/dashboard-view.vue');

const dashboardRoutes = [
    {
        path: '',
        name: 'dashboard',
        component: dashboardView,
        meta: { title: 'Dashboard' }
    },
];

export default dashboardRoutes;