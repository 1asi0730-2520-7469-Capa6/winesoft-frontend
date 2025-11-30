<script setup>
import {useI18n}from "vue-i18n";
import {ref, computed, watch} from "vue";
import { useRoute, useRouter } from 'vue-router';
import LanguageSwitcher from "./language-switcher.vue";
import FooterContent from "./footer-content.vue";
import NotificationCenter from "./notification-center.vue";

const {t, locale} = useI18n();
const drawer = ref(false);
const router = useRouter();
const route = useRoute();

const items = [{label: "option.home", to: "/home", icon: "pi pi-home"},
               {label: "option.analytics", to: "/analytics"},
               {label: "option.supplies", to: "/inventory/supplies", icon: "pi pi-box"},
               {label: "option.stockMovements", to: "/inventory/stock-movements", icon: "pi pi-chart-line"},
               {label: 'option.orders', to: '/purchase/orders', icon: 'pi pi-shopping-cart'},
              ];

const isAuthView = computed(() => {
  const p = route.path.toLowerCase();
  return p === '/sign-up' || p === '/sign-in';
});

function goToSignUp() {
  router.push({ path: '/sign-up' });
}
function goToSignIn() {
  router.push({ path: '/sign-in' });
}

function normalizeLocale(raw) {
  const s = raw && raw.value ? String(raw.value) : String(raw || 'en');
  return s.split('-')[0];
}

// Fallback local header labels
const headerLabels = {
  en: { signUp: 'Sign up', signIn: 'Sign in' },
  es: { signUp: 'Crear Cuenta', signIn: 'Iniciar sesión' }
};

const headerSignUp = computed(() => {
  const l = normalizeLocale(locale) || 'en';
  return (headerLabels[l] && headerLabels[l].signUp) || 'Sign up';
});
const headerSignIn = computed(() => {
  const l = normalizeLocale(locale) || 'en';
  return (headerLabels[l] && headerLabels[l].signIn) || 'Sign in';
});

// Debug: log values when locale changes to help verificar traducciones
watch(locale, (newLocale) => {
  console.log('[i18n debug] locale ->', newLocale);
});
</script>
<template>
  <pv-toast/>
  <pv-confirm-dialog/>
  <div class="layout-flex">
    <div class="header">
      <pv-toolbar class="bg-primary">
        <template #start>
          <img class="logo" src="/winesoft-logo.png" alt="WineSoft Logo"/>
          <h3>WineSoft</h3>
        </template>

        <template #end>
          <div v-if="!isAuthView" class="nav-items mr-3">
            <pv-button
                v-for="item in items"
                :key="item.label"
                as-child
                v-slot="slotProps"
            >
              <router-link :to="item.to" :class="slotProps['class']">
                {{ t(item.label) }}
              </router-link>
            </pv-button>
          </div>

          <div v-else class="auth-actions mr-3">
            <pv-button class="p-button-text p-button-plain" @click="goToSignUp">{{ headerSignUp }}</pv-button>
            <pv-button class="p-button-text p-button-plain" @click="goToSignIn">{{ headerSignIn }}</pv-button>
          </div>

          <notification-center v-if="!isAuthView" class="mr-3" />
          <language-switcher/>
        </template>
      </pv-toolbar>
      <pv-drawer v-model="drawer"/>
    </div>
    <div class="main-content">
      <router-view/>
    </div>
    <footer-content />
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

.bg-primary {
  background: linear-gradient(90deg, var(--ws-bg-dark), var(--ws-brand-purple-dark));
  color: var(--ws-white);
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 18px;
}

.nav-items {
  display: flex;
  gap: 12px;
  align-items: center;
}

.logo {
  height: 65px;
  width: auto;
  margin-bottom: 0.5rem;
  filter: drop-shadow(0 0 4px rgba(255, 255, 255, 0.2));
}

.main-content {
  margin-top: 60px;
  padding-bottom: 0;
  flex: 1 0 auto;
}


.content-area {
  flex: 1;
  overflow-y: auto;
  padding: 2rem;
  background: radial-gradient(circle at top left, #120f24 0%, #0b0918 100%);
  color: #eaeaea;
}
</style>