<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

const router = useRouter();
const { t } = useI18n();
const email = ref('');
const password = ref('');

const INFO_URL = 'https://1asi0730-2520-7469-capa6.github.io/WineSoft-LandingPage/';

function openMoreInfo() {
  window.open(INFO_URL, '_blank', 'noopener,noreferrer');
}

function onIngresar() {
  router.push({ path: '/home' });
}

function onCrearCuenta() {
  router.push({ path: '/sign-in' });
}

function onRecuperar() {
  router.push({ path: '/recovery-password' });
}
</script>

<template>
  <div class="login-page">
    <div class="login-left">
      <img src="/winesoft-logo.png" alt="WineSoft" class="logo" />
      <h1 class="discover">{{ t('signIn.discoverLine1') }}<br/>{{ t('signIn.discoverLine2') }}</h1>

      <button class="info-btn" @click="openMoreInfo">{{ t('signIn.moreInfo') }}</button>
    </div>

    <div class="login-right">
      <div class="login-card">
        <h2>{{ t('signIn.welcome') }}</h2>
        <p class="sub">{{ t('signIn.sub') }}</p>

        <label class="input-label">{{ t('signIn.email') }}</label>
        <input v-model="email" class="text-input" :placeholder="t('signIn.emailPlaceholder')" />

        <label class="input-label">{{ t('signIn.password') }}</label>
        <input v-model="password" type="password" class="text-input" :placeholder="t('signIn.passwordPlaceholder')" />

        <button class="ingresar-btn" @click="onIngresar">{{ t('signIn.signIn') }}</button>

        <button class="forgot-btn" @click="onRecuperar">{{ t('signIn.forgotPassword') }}</button>

        <button class="link-btn" @click="onCrearCuenta">{{ t('signIn.createAccount') }}</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ...existing styles copied from login.vue... */
.login-page { display: flex; min-height: 100vh; background: var(--ws-bg-dark); color: var(--ws-white); align-items: center; justify-content: center; gap: 40px; padding: 40px; box-sizing: border-box; }
.login-left { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px; text-align: center; }
.logo { width: 140px; max-width: 30%; margin-bottom: 24px; }
.discover { font-size: 40px; font-weight: 300; line-height: 1.2; margin: 0 0 28px 0; color: var(--ws-white); max-width: 90%; }
.info-btn { background: var(--ws-brand-purple); color: var(--ws-white); border: 4px solid #000; padding: 14px 36px; font-size: 24px; width: 420px; max-width: 85%; border-radius: 10px; cursor: pointer; }
.login-right { width: 480px; display: flex; align-items: center; justify-content: center; }
.login-card { background: rgba(255,255,255,0.04); color: var(--ws-white); padding: 32px; width: 100%; border: 4px solid #000; box-sizing: border-box; }
.login-card h2 { font-size: 36px; margin: 0 0 16px 0; }
.login-card .sub { font-size: 20px; margin-bottom: 18px; }
.input-label { display: block; margin-top: 12px; color: rgba(255,255,255,0.8); font-size: 18px; }
.text-input { width: 100%; padding: 14px; margin-top: 6px; font-size: 20px; box-sizing: border-box; border: none; background: var(--ws-gray-100); color: var(--ws-text-dark); }
.ingresar-btn { margin-top: 20px; width: 100%; background: var(--ws-blue); color: var(--ws-white); padding: 14px; font-size: 28px; border: 2px solid #000; cursor: pointer; }
.forgot-btn { margin-top: 8px; width: 100%; background: transparent; color: var(--ws-white); border: none; font-size: 16px; cursor: pointer; text-decoration: underline; }
.link-btn { margin-top: 12px; background: transparent; color: var(--ws-white); border: none; font-size: 18px; cursor: pointer; }
@media (max-width: 900px) { .login-page { flex-direction: column; padding: 24px; } .login-left { align-items: center; text-align: center; } .login-right { width: 100%; margin-top: 20px; } .logo { width: 90px; margin-bottom: 18px; } .discover { font-size: 28px; margin-bottom: 18px; } .info-btn { font-size: 20px; width: 80%; padding: 12px 20px; } }
</style>
