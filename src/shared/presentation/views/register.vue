<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

const router = useRouter();
const { t } = useI18n();

const firstName = ref('');
const lastName = ref('');
const email = ref('');
const password = ref('');
const passwordConfirm = ref('');

function onSiguiente() {
  // intentionally no action yet
}
</script>

<template>
  <div class="register-page">
    <div class="register-title">{{ t('register.title') }}</div>

    <div class="register-card">
      <div class="register-columns">
        <div class="col left">
          <label class="field-label">{{ t('register.firstName') }}</label>
          <input class="field-input" v-model="firstName" :placeholder="t('register.firstNamePlaceholder')" />

          <label class="field-label">{{ t('register.lastName') }}</label>
          <input class="field-input" v-model="lastName" :placeholder="t('register.lastNamePlaceholder')" />

          <label class="field-label">{{ t('register.email') }}</label>
          <input class="field-input" v-model="email" :placeholder="t('register.emailPlaceholder')" />
        </div>

        <div class="col right">
          <label class="field-label">{{ t('register.createPassword') }}</label>
          <input class="field-input" type="password" v-model="password" :placeholder="t('register.passwordPlaceholder')" />

          <label class="field-label">{{ t('register.confirmPassword') }}</label>
          <input class="field-input" type="password" v-model="passwordConfirm" :placeholder="t('register.passwordPlaceholder')" />

          <div class="actions">
            <button class="next-btn" @click="onSiguiente">{{ t('register.next') }}</button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
.register-page {
  min-height: calc(100vh - 60px);
  background: #b0356d;
  padding: 24px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.register-title {
  font-size: 48px;
  color: #fff;
  margin: 12px 0 20px 0;
}

.register-card {
  width: 100%;
  max-width: 1100px;
  background: #3a3737;
  border: 4px solid #000;
  padding: 28px;
  box-sizing: border-box;
}

.register-columns {
  display: flex;
  gap: 40px;
}

.col {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.field-label {
  font-size: 32px;
  color: #fff;
  margin-bottom: 10px;
}

.field-input {
  height: 52px;
  font-size: 20px;
  padding: 8px 12px;
  border: none;
  background: #e6e6e6;
  color: #333;
  margin-bottom: 24px;
}

.actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex: 1;
}

.next-btn {
  background: #b0356d;
  color: #fff;
  border: 2px solid #000;
  padding: 14px 48px;
  font-size: 28px;
  cursor: pointer;
}

/* Responsive: stack columns on small screens */
@media (max-width: 900px) {
  .register-columns { flex-direction: column; }
  .actions { justify-content: center; margin-top: 12px; }
  .field-label { font-size: 22px; }
  .field-input { height: 44px; }
  .register-title { font-size: 36px; }
}
</style>
