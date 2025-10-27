<template>
  <div class="user-type-page">
    <h1 class="title">{{ t('register.userTypeTitle') }}</h1>

    <div class="options">
      <button class="card" aria-label="Dueño" @click.prevent>
        <div class="img-wrap">
          <!-- usar la imagen pública dueno.jpeg -->
          <img src="/dueno.jpeg" alt="Dueño" />
        </div>
        <div class="label">{{ t('register.owner') }}</div>
      </button>

      <button class="card" aria-label="Proveedor" @click.prevent>
        <div class="img-wrap">
          <!-- usar la jpg pública existente (proovedor.jpeg) -->
          <img src="/proovedor.jpeg" alt="Proveedor" />
        </div>
        <div class="label">{{ t('register.provider') }}</div>
      </button>
    </div>

  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
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

.title {
  color: #fff;
  font-size: 48px;
  margin-bottom: 24px;
  text-align: center;
}

.options {
  width: 100%;
  max-width: 1100px;
  display: flex;
  justify-content: center; /* centered instead of space-between to keep cards together on large screens */
  gap: 40px;
  flex-wrap: wrap; /* allow wrapping on smaller widths */
  box-sizing: border-box;
  padding: 0 12px;
}

.card {
  flex: 1 1 420px; /* grow, shrink, base width */
  max-width: 480px; /* prevents cards from growing too large on very wide screens */
  min-width: 260px; /* ensures a minimum tappable area */
  background: #f3f0e9;
  border: 4px solid #000;
  padding: 18px;
  display: flex;
  flex-direction: column;
  align-items: stretch; /* make label full width */
  gap: 12px;
  cursor: pointer;
  transition: transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease;
  text-decoration: none;
  color: #000;
  outline: none;
  box-sizing: border-box;
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
  width: 100%;
  max-width: 360px; /* cap image container to keep balance */
  margin: 0 auto; /* center inside the card */
  aspect-ratio: 3 / 4; /* keep consistent portrait ratio */
  background: #fff;
  border: 2px solid #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.img-wrap img {
  width: 100%;
  height: 100%;
  object-fit: cover; /* crop to fill container while preserving aspect */
  display: block;
}

.label {
  background: #e6e6e6;
  padding: 12px 24px;
  font-size: 32px;
  border: 3px solid #000;
  width: 100%;
  text-align: center;
  box-sizing: border-box;
}

/* Larger screens: slightly smaller card width so two fit comfortably */
@media (min-width: 1200px) {
  .options { gap: 48px; }
  .card { flex-basis: 420px; max-width: 440px; }
  .img-wrap { max-width: 320px; }
}

/* Medium screens */
@media (max-width: 900px) {
  .options { flex-direction: column; align-items: center; gap: 24px; }
  .img-wrap { max-width: 280px; aspect-ratio: 3 / 4; }
  .title { font-size: 36px; }
  .label { font-size: 24px; }
}

/* Small phones */
@media (max-width: 480px) {
  .user-type-page { padding: 18px; }
  .title { font-size: 28px; }
  .card { padding: 12px; }
  .img-wrap { max-width: 220px; aspect-ratio: 3 / 4; }
  .label { font-size: 20px; padding: 10px 14px; }
}
</style>
