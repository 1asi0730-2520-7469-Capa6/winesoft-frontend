<template>
  <div class="user-type-page">
    <div class="lang-switch">
      <pv-select-button v-model="locale" :options="availableLocales" />
    </div>

    <h1 class="title">{{ t('register.userTypeTitle') }}</h1>

    <div class="options">
      <button class="card" aria-label="Dueño" @click.prevent>
        <div class="img-wrap">
          <img src="/dueño.jpeg" alt="Dueño" />
        </div>
        <div class="label">{{ t('register.owner') }}</div>
      </button>

      <button class="card" aria-label="Proveedor" @click.prevent>
        <div class="img-wrap">
          <img src="/proovedor.jpeg" alt="Proveedor" />
        </div>
        <div class="label">{{ t('register.provider') }}</div>
      </button>
    </div>

  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
const { t, locale, availableLocales } = useI18n();
</script>

<style scoped>
.user-type-page {
  min-height: calc(100vh - 60px);
  background: #b0356d;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 32px;
  box-sizing: border-box;
  position: relative;
}

.lang-switch {
  position: absolute;
  top: 16px;
  right: 16px;
}

.title {
  color: #fff;
  font-size: 48px;
  margin-bottom: 24px;
}

.options {
  width: 100%;
  max-width: 1100px;
  display: flex;
  justify-content: space-between;
  gap: 40px;
}

.card {
  flex: 1;
  background: #f3f0e9;
  border: 4px solid #000;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease;
  text-decoration: none;
  color: #000;
  outline: none;
}

.card:focus {
  box-shadow: 0 8px 24px rgba(0,0,0,0.35);
  transform: translateY(-6px) scale(1.01);
  border-color: #ffd54f;
}

.card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 14px 40px rgba(0,0,0,0.45);
  border-color: #ffd54f;
}

.img-wrap {
  width: 260px;
  height: 360px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  border: 2px solid #e0e0e0;
}

.img-wrap img {
  max-width: 100%;
  max-height: 100%;
}

.label {
  background: #e6e6e6;
  padding: 12px 24px;
  font-size: 32px;
  border: 3px solid #000;
  width: 100%;
  text-align: center;
}

@media (max-width: 900px) {
  .options { flex-direction: column; }
  .img-wrap { width: 200px; height: 280px; }
  .title { font-size: 36px; }
  .label { font-size: 24px; }
}
</style>
