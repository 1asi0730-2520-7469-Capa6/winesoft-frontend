import Home from "./shared/presentation/views/home.vue";

const routes = [
    { path: '/home', name: 'home', component: Home, meta: { title: 'Home' } },
    { path: '/', redirect: '/home'}
];