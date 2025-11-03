<script setup>
import {useI18n} from "vue-i18n";

const {t} = useI18n();
</script>

<template>
  <div class="home-container">
    <section class="welcome-card">
      <img src="/winesoft-logo.png" alt="WineSoft Logo" class="logo"/>
      <h1 class="title">WineSoft</h1>
      <p class="subtitle">
        {{ t("home.title") }}
      </p>
      <p class="subtitle">
        {{ t("home.content") }}
      </p>

      <div class="actions">
        <router-link to="/inventory/supplies">
          <pv-button>
            {{ t("home.manage-supplies") }}
          </pv-button>
        </router-link>

        <router-link to="/inventory/stock-movements">
          <pv-button>
            {{ t("home.view-stock") }}
          </pv-button>
        </router-link>
      </div>
    </section>
  </div>
</template>

<style scoped>

.home-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  min-height: 100%;
  background: radial-gradient(circle at top left, #141029 0%, #0b0918 100%);
  color: #f5f3ff;
  padding: 2rem;
}

.welcome-card {
  text-align: center;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 1rem;
  padding: 3rem 2.5rem;
  max-width: 600px;
  width: 100%;
  box-shadow: 0 0 20px rgba(99, 102, 241, 0.25);
  border: 1px solid rgba(147, 197, 253, 0.15);
}

.logo {
  width: 100px;
  margin-bottom: 1.2rem;
  filter: drop-shadow(0 0 5px rgba(147, 197, 253, 0.3));
}

.title {
  font-size: 2.2rem;
  font-weight: 700;
  margin-bottom: 0.8rem;
  background: linear-gradient(90deg, #60a5fa, #a78bfa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.subtitle {
  color: #cbd5e1;
  font-size: 1.1rem;
  margin-bottom: 2rem;
}

.actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}
</style>
