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

/* Nuevo: contenedor principal que usa la plantilla */
.layout-flex {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
}

/* Header fijo, ahora pegado al borde superior sin espacios */
.header {
  position: fixed;
  top: 0;       /* pegado arriba */
  left: 0;      /* pegado a la izquierda */
  right: 0;     /* pegado a la derecha */
  z-index: 1200;
  pointer-events: auto;
}

/* Estilo del toolbar: sin border-radius para ocupar todo el ancho */
.bg-primary {
  background: linear-gradient(90deg, var(--ws-bg-dark, #0B1D39), var(--ws-brand-purple-dark, #4B2AD0));
  color: var(--ws-white, #FFFFFF);
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 28px;
  border-radius: 0; /* quitar radio */
  box-shadow: 0 6px 24px rgba(11,17,40,0.25);
  border-bottom: 1px solid rgba(255,255,255,0.04);
}

.nav-items {
  display: flex;
  gap: 12px;
  align-items: center;
}

.logo {
  height: 48px;
  width: auto;
  margin-bottom: 0.25rem;
  filter: drop-shadow(0 0 6px rgba(0,0,0,0.35));
}

/* Asegurar que el contenido principal no quede oculto por el header fijo
   y centrar el contenido dentro del área principal */
.main-content {
  margin-top: 64px; /* igual a la altura del header */
  padding: 2rem;
  flex: 1 0 auto;
  display: flex;
  justify-content: center; /* centrar horizontal */
  align-items: center;     /* centrar vertical */
  min-height: calc(100vh - 64px);
}


.content-area {
  flex: 1;
  overflow-y: auto;
  padding: 2rem;
  background: radial-gradient(circle at top left, #120f24 0%, #0b0918 100%);
  color: #eaeaea;
}
</style>