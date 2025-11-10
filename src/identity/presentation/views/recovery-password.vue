<template>
  <div class="recovery-page">
    <div class="card">
      <h1>{{ t('recovery.title') }}</h1>
      <p class="subtitle">{{ t('recovery.subtitle') }}</p>

      <label class="field-label">{{ t('recovery.email') }}</label>
      <input v-model="email" class="field-input" :placeholder="t('recovery.emailPlaceholder')" />

      <div class="actions">
        <button :disabled="!validEmail" @click="onEnviar">{{ t('recovery.send') }}</button>
        <button class="back" @click="onBack">{{ t('recovery.back') }}</button>
      </div>

      <div v-if="sent" class="sent-msg">{{ t('recovery.sentMessage') }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

const { t } = useI18n();
const router = useRouter();
const email = ref('');
const sent = ref(false);

const validEmail = computed(() => /@/.test(email.value) && email.value.length > 3);

function onEnviar() {
  if (!validEmail.value) return;
  sent.value = true;
}

function onBack() {
  router.push({ path: '/sign-up' });
}
</script>

<style scoped>
.recovery-page {
  min-height: calc(100vh - 60px);
  display: flex;
  align-items: center;
  justify-content: center;
  background: #b0356d;
  padding: 24px;
  box-sizing: border-box;
  color: #fff;
}

.card {
  background: #3a3737;
  padding: 28px;
  border: 4px solid #000;
  max-width: 520px;
  width: 100%;
  box-sizing: border-box;
}

.field-label { font-size: 18px; margin-top: 12px; display:block; }
.field-input { width: 100%; padding: 12px; margin-top: 6px; font-size: 16px; box-sizing: border-box; }

.actions { display:flex; gap:12px; margin-top:16px; }
.actions button { padding: 10px 18px; font-size:16px; cursor:pointer; }
.actions button:disabled { opacity:0.6; cursor:not-allowed; }
.back { background:transparent; color:#fff; border:none; }

.sent-msg { margin-top:12px; color:#aaf; }
</style>
