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
const items = [
  {label: 'option.home', to: '/home'},
  {label: 'option.supplies', to: '/inventory/supplies'},
  {label: 'option.stockMovements', to: '/inventory/stock-movements'},
  {label: 'option.orders', to: '/orders'},
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
  console.log('[i18n debug] headerSignUp ->', headerSignUp.value);
  console.log('[i18n debug] headerSignIn ->', headerSignIn.value);
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
          <div v-if="!isAuthView" class="flex-column mr-3">
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
  </div>
  <footer-content class="footer-fixed"/>
</template>

<style scoped>
.layout-flex {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
}


.bg-primary {

  background: #1a2341;
  color: var(--ws-white);
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 18px;
}

.logo {
  height: 40px;
  width: auto;
}

.main-content {
  margin-top: 60px;
  padding-bottom: 60px;
  flex: 1 0 auto;
}

.footer-fixed {
  width: 100vw;
  margin-left: calc(-50vw + 50%);
}

.auth-actions > * {
  margin-left: 12px;
}
</style>