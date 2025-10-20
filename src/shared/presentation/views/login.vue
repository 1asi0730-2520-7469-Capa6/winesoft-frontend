<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const email = ref('');
const password = ref('');

const GITHUB_INFO_URL = 'https://1asi0730-2520-7469-capa6.github.io/WineSoft-LandingPage/';

function openMoreInfo() {
  window.open(GITHUB_INFO_URL, '_blank');
}

function onIngresar() {

  router.push({ path: '/home' });
}

function onCrearCuenta() {

}
</script>

<template>
  <div class="login-page">
    <div class="login-left">
      <img src="/winesoft-logo.png" alt="WineSoft" class="logo" />
      <h1 class="discover">Deseas conocer más<br/>visite nuestra LandingPage</h1>

      <button class="info-btn" @click="openMoreInfo">Más información</button>
    </div>

    <div class="login-right">
      <div class="login-card">
        <h2>Bienvenido a WineSoft!!!</h2>
        <p class="sub">Inicie sesion para poder acceder a la plataforma</p>

        <label class="input-label">Correo Electronico</label>
        <input v-model="email" class="text-input" placeholder="Correo Electronico" />

        <label class="input-label">Contraseña</label>
        <input v-model="password" type="password" class="text-input" placeholder="Contraseña" />

        <button class="ingresar-btn" @click="onIngresar">Ingresar</button>

        <button class="link-btn" @click="onCrearCuenta">Crear una cuenta</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  display: flex;
  min-height: 100vh;
  background: #b0356d; /* vino */
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
  align-items: flex-start;
  justify-content: center;
  padding: 40px;
}

.logo {
  width: 120px;
  margin-bottom: 30px;
}

.discover {
  font-size: 36px;
  font-weight: 300;
  line-height: 1.2;
  margin: 0 0 40px 0;
  color: #fff;
}

.info-btn {
  background: #2e2e2e;
  color: #fff;
  border: 4px solid #000;
  padding: 18px 36px;
  font-size: 28px;
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

/* responsive */
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
}
</style>
