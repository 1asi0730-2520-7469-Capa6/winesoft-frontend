<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

const router = useRouter();
const { t } = useI18n();
const email = ref('');
const password = ref('');
const loading = ref(false);
const errorMsg = ref('');

const GITHUB_INFO_URL = 'https://github.com/1asi0730-2520-7469-Capa6/WineSoft-LandingPage';

function openMoreInfo() {
  window.open(GITHUB_INFO_URL, '_blank');
}

async function onIngresar() {
  errorMsg.value = '';
  // simple form validation
  if (!email.value || !password.value) {
    errorMsg.value = t('login.email') + ' & ' + t('login.password') + ' are required';
    return;
  }

  loading.value = true;

  // Read API base from env (make sure .env.production points to base URL)
  const base = import.meta.env.VITE_WINESOFT_PLATFORM_API_URL || '';
  // If user typed an email, backend expects username key based on swagger screenshot
  const payload = { username: email.value, password: password.value };

  // Local fallback credentials
  const LOCAL_USER = { username: 'admin', password: 'admin123' };

  try {
    // Try backend call only if base looks like a URL (starts with http)
    if (base && base.startsWith('http')) {
      // Ensure we don't send to the Swagger UI page by trimming any path like /swagger/index.html
      const apiBase = base.replace(/\/swagger.*$/i, '').replace(/\/$/, '');
      const signinUrl = `${apiBase}/api/iam/authentication/signin`;

      const resp = await fetch(signinUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (resp.ok) {
        // Optionally save token if backend returns one
        try {
          const data = await resp.json();
          if (data && data.token) {
            localStorage.setItem('ws_token', data.token);
          }
        } catch (e) {
          // ignore parse errors
        }
        router.push({ path: '/home' });
        return;
      }
    }

    // If backend failed or base not configured, allow local admin credentials
    if (email.value === LOCAL_USER.username && password.value === LOCAL_USER.password) {
      localStorage.setItem('ws_token', 'local-admin-token');
      router.push({ path: '/home' });
      return;
    }

    // If we get here, auth failed
    errorMsg.value = 'Credenciales inválidas o servicio no disponible.';
  } catch (err) {
    // network or unexpected error: allow local admin as fallback
    if (email.value === LOCAL_USER.username && password.value === LOCAL_USER.password) {
      localStorage.setItem('ws_token', 'local-admin-token');
      router.push({ path: '/home' });
      return;
    }
    errorMsg.value = 'Error de conexión al servidor';
  } finally {
    loading.value = false;
  }
}

function onCrearCuenta() {
  router.push({ path: '/register' });
}
</script>

<template>
  <div class="login-page">
    <div class="login-left">
      <img src="/winesoft-logo.png" alt="WineSoft" class="logo" />
      <h1 class="discover">{{ t('login.discoverLine1') }}<br/>{{ t('login.discoverLine2') }}</h1>

      <button class="info-btn" @click="openMoreInfo">{{ t('login.moreInfo') }}</button>
    </div>

    <div class="login-right">
      <div class="login-card">
        <h2>{{ t('login.welcome') }}</h2>
        <p class="sub">{{ t('login.sub') }}</p>

        <label class="input-label">{{ t('login.email') }}</label>
        <input v-model="email" class="text-input" :placeholder="t('login.emailPlaceholder')" />

        <label class="input-label">{{ t('login.password') }}</label>
        <input v-model="password" type="password" class="text-input" :placeholder="t('login.passwordPlaceholder')" />

        <div v-if="errorMsg" style="color:#ff4d4f;margin-top:8px">{{ errorMsg }}</div>

        <button class="ingresar-btn" :disabled="loading || !email || !password" @click="onIngresar">
          <span v-if="!loading">{{ t('login.signIn') }}</span>
          <span v-else>...</span>
        </button>

        <button class="link-btn" @click="onCrearCuenta">{{ t('login.createAccount') }}</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  display: flex;
  min-height: 100vh;
  background: #b0356d;
  color: #fff;
  align-items: center;
  justify-content: center;
  gap: 40px;
  padding: 40px;
  box-sizing: border-box;
}

.login-left {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  text-align: center;
}

.logo {
  width: 140px;
  max-width: 30%;
  margin-bottom: 24px;
}

.discover {
  font-size: 40px;
  font-weight: 300;
  line-height: 1.2;
  margin: 0 0 28px 0;
  color: #fff;
  max-width: 90%;
}

.info-btn {
  background: #2e2e2e;
  color: #fff;
  border: 4px solid #000;
  padding: 14px 36px;
  font-size: 24px;
  width: 420px;
  max-width: 85%;
  border-radius: 10px;
  cursor: pointer;
}

.login-right {
  width: 480px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-card {
  background: #3a3737;
  color: #fff;
  padding: 32px;
  width: 100%;
  border: 4px solid #000;
  box-sizing: border-box;
}

.login-card h2 {
  font-size: 36px;
  margin: 0 0 16px 0;
}

.login-card .sub {
  font-size: 20px;
  margin-bottom: 18px;
}

.input-label {
  display: block;
  margin-top: 12px;
  color: #ddd;
  font-size: 18px;
}

.text-input {
  width: 100%;
  padding: 14px;
  margin-top: 6px;
  font-size: 20px;
  box-sizing: border-box;
  border: none;
  background: #e6e6e6;
  color: #333;
}

.ingresar-btn {
  margin-top: 20px;
  width: 100%;
  background: #b0356d;
  color: #000;
  padding: 14px;
  font-size: 28px;
  border: 2px solid #000;
  cursor: pointer;
}

.link-btn {
  margin-top: 12px;
  background: transparent;
  color: #fff;
  border: none;
  font-size: 18px;
  cursor: pointer;
}

@media (max-width: 900px) {
  .login-page {
    flex-direction: column;
    padding: 24px;
  }
  .login-left {
    align-items: center;
    text-align: center;
  }
  .login-right {
    width: 100%;
    margin-top: 20px;
  }
  .logo { width: 90px; margin-bottom: 18px; }
  .discover { font-size: 28px; margin-bottom: 18px; }
  .info-btn { font-size: 20px; width: 80%; padding: 12px 20px; }
}
</style>
