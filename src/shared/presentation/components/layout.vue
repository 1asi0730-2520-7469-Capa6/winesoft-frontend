<script setup>
import {useI18n} from "vue-i18n";
import {ref, computed} from "vue";
import { useRoute, useRouter } from 'vue-router';
import LanguageSwitcher from "./language-switcher.vue";
import FooterContent from "./footer-content.vue";
import NotificationCenter from "./notification-center.vue";

const {t} = useI18n();
const drawer = ref(false);
const router = useRouter();
const route = useRoute();

const items = [{label: "option.home", to: "/home", icon: "pi pi-home"},
               {label: "option.analytics", to: "/analytics"},
               {label: "option.supplies", to: "/inventory/supplies", icon: "pi pi-box"},
               {label: "option.stockMovements", to: "/inventory/stock-movements", icon: "pi pi-chart-line"},
              ];

const isAuthView = computed(() => {
  const p = route.path.toLowerCase();
  return p === '/login' || p === '/register';
});

function goToLogin() {
  router.push({ path: '/login' });
}
function goToRegister() {
  router.push({ path: '/register' });
}
</script>
<template>
  <div class="layout-container">
    <aside class="sidebar">
      <div class="sidebar-header"><img src="/winesoft-logo.png" alt="WineSoft Logo" class="logo"/>
        <h2 class="app-title">WineSoft</h2></div>
      <nav class="nav-menu">
        <router-link v-for="item in items" :key="item.label" :to="item.to" class="nav-link" active-class="active"><i
            :class="item.icon"></i> <span>{{ t(item.label) }}</span></router-link>
      </nav>
      <div class="sidebar-footer">
        <language-switcher/>
      </div>
    </aside>
    <div class="main-section">
      <main class="content-area">
        <router-view/>
      </main>
      <footer>
        <footer-content/>
      </footer>
    </div>
  </div>
</template>

<style scoped>
.layout-container {
  display: flex;
  height: 100vh;
  background-color: #0d0d0d;
  font-family: "Poppins", sans-serif;
  color: #f2f2f2;
  overflow: hidden;
}

.sidebar {
  width: 250px;
  background: linear-gradient(180deg, #111633 0%, #1e1b4b 60%, #312e81 100%);
  color: #e0e7ff;
  display: flex;
  flex-direction: column;
  padding: 1rem 0;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.6);
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  border-right: 1px solid rgba(147, 197, 253, 0.15);
  z-index: 10;
}

.sidebar-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
  text-align: center;
}

.logo {
  height: 65px;
  width: auto;
  margin-bottom: 0.5rem;
  filter: drop-shadow(0 0 4px rgba(255, 255, 255, 0.2));
}

.app-title {
  font-weight: 600;
  font-size: 1.4rem;
  background: linear-gradient(90deg, #60a5fa, #a78bfa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.nav-menu {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  padding: 0 1rem;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.75rem 1rem;
  border-radius: 0.6rem;
  color: #c7d2fe;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.3s ease;
}

.nav-link:hover {
  background: rgba(139, 92, 246, 0.15);
  color: #a78bfa;
  transform: translateX(4px);
}

.sidebar-footer {
  margin-top: auto;
  padding: 1rem;
  text-align: center;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}

.main-section {
  flex: 1;
  margin-left: 250px;
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

.content-area {
  flex: 1;
  overflow-y: auto;
  padding: 2rem;
  background: radial-gradient(circle at top left, #120f24 0%, #0b0918 100%);
  color: #eaeaea;
}
</style>