// filepath: src/identity/presentation/views/sign-in.vue
<script setup>
import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

const router = useRouter();
const { t } = useI18n();

const firstName = ref('');
const lastName = ref('');
const email = ref('');
const password = ref('');
const passwordConfirm = ref('');

const showTooltip = ref(false);
const tooltipHover = ref(false);
const passwordFocused = ref(false);
const flipLeft = ref(false);

const popoverRef = ref(null);
const passwordInputRef = ref(null);

const hasLength = computed(() => password.value.length >= 8 && password.value.length <= 20);
const hasUpper = computed(() => /[A-Z]/.test(password.value));
const hasLower = computed(() => /[a-z]/.test(password.value));
const hasSpecial = computed(() => /[^A-Za-z0-9]/.test(password.value));

const emailValid = computed(() => /@/.test(email.value));
const passwordsMatch = computed(() => password.value === passwordConfirm.value && password.value.length > 0);
const isPasswordValid = computed(() => hasLength.value && hasUpper.value && hasLower.value && hasSpecial.value);
const isFormValid = computed(() => isPasswordValid.value && passwordsMatch.value && emailValid.value);

const animateButton = ref(false);
let prevValid = false;
watch(isFormValid, (newVal) => {
  if (newVal && !prevValid) {
    animateButton.value = true;
    setTimeout(() => (animateButton.value = false), 600);
  }
  prevValid = newVal;
});

function onSiguiente() {
}

async function positionPopover() {
  await nextTick();
  flipLeft.value = false;
  const pop = popoverRef.value;
  if (!pop) return;
  const rect = pop.getBoundingClientRect();
  const margin = 12;
  if (rect.right + margin > window.innerWidth) {
    flipLeft.value = true;
  } else {
    flipLeft.value = false;
  }
}

function onPasswordFocus() {
  passwordFocused.value = true;
  showTooltip.value = true;
  positionPopover();
}
function onPasswordBlur() {
  passwordFocused.value = false;
  setTimeout(() => {
    if (!tooltipHover.value) showTooltip.value = false;
  }, 150);
}
function onTooltipEnter() {
  tooltipHover.value = true;
}
function onTooltipLeave() {
  tooltipHover.value = false;
  if (!passwordFocused.value) showTooltip.value = false;
}

function onDocumentClick(e) {
  const pop = popoverRef.value;
  const pwd = passwordInputRef.value;
  if (!showTooltip.value) return;
  if (pop && pop.contains(e.target)) return;
  if (pwd && pwd.contains(e.target)) return;
  showTooltip.value = false;
}

onMounted(() => {
  document.addEventListener('click', onDocumentClick);
  window.addEventListener('resize', positionPopover);
});
onBeforeUnmount(() => {
  document.removeEventListener('click', onDocumentClick);
  window.removeEventListener('resize', positionPopover);
});
</script>

<template>
  <div class="register-page">
    <div class="register-title">{{ t('signIn.title') }}</div>

    <div class="register-card">
      <div class="register-columns">
        <div class="col left">
          <label class="field-label">{{ t('signIn.firstName') }}</label>
          <input class="field-input" v-model="firstName" :placeholder="t('signIn.firstNamePlaceholder')" />

          <label class="field-label">{{ t('signIn.lastName') }}</label>
          <input class="field-input" v-model="lastName" :placeholder="t('signIn.lastNamePlaceholder')" />

          <label class="field-label">{{ t('signIn.email') }}</label>
          <input class="field-input" v-model="email" :placeholder="t('signIn.emailPlaceholder')" />
          <div v-if="email && !emailValid" class="mismatch">{{ t('signIn.emailInvalid') }}</div>
        </div>

        <div class="col right" style="position: relative;">
          <div
            ref="popoverRef"
            class="tooltip"
            :class="[{show: showTooltip}, { 'flip-left': flipLeft }]"
            role="status"
            v-show="showTooltip"
            @mouseenter="onTooltipEnter"
            @mouseleave="onTooltipLeave"
          >
            <div class="tooltip-title">{{ t('signIn.passwordRequirementsTitle') }}</div>
            <ul class="requirements">
              <li :class="{ok: hasLength}">● {{ t('signIn.passwordReqLength') }}</li>
              <li :class="{ok: hasUpper}">● {{ t('signIn.passwordReqUpper') }}</li>
              <li :class="{ok: hasLower}">● {{ t('signIn.passwordReqLower') }}</li>
              <li :class="{ok: hasSpecial}">● {{ t('signIn.passwordReqSpecial') }}</li>
            </ul>
          </div>

          <label class="field-label">{{ t('signIn.createPassword') }}</label>
          <input
            ref="passwordInputRef"
            class="field-input"
            type="password"
            v-model="password"
            :placeholder="t('signIn.passwordPlaceholder')"
            @focus="onPasswordFocus"
            @blur="onPasswordBlur"
            @click="onPasswordFocus"
          />

          <label class="field-label">{{ t('signIn.confirmPassword') }}</label>
          <input class="field-input" type="password" v-model="passwordConfirm" :placeholder="t('signIn.passwordPlaceholder')" />

          <div v-if="passwordConfirm && !passwordsMatch" class="mismatch">{{ t('signIn.passwordMismatch') }}</div>

          <div class="actions">
            <button
              :disabled="!isFormValid"
              :class="[{disabled: !isFormValid}, {animate: animateButton} ]"
              @click="onSiguiente"
            >
              {{ t('signIn.next') }}
            </button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
/* ...existing styles copied from register.vue... */
.register-page { min-height: calc(100vh - 60px); background: #b0356d; padding: 24px; box-sizing: border-box; display: flex; flex-direction: column; align-items: center; }
.register-title { font-size: 48px; color: #fff; margin: 12px 0 20px 0; }
.register-card { width: 100%; max-width: 1100px; background: #3a3737; border: 4px solid #000; padding: 28px; box-sizing: border-box; position: relative; }
.register-columns { display: flex; gap: 40px; }
.col { flex: 1; display: flex; flex-direction: column; }
.field-label { font-size: 32px; color: #fff; margin-bottom: 10px; }
.field-input { height: 52px; font-size: 20px; padding: 8px 12px; border: none; background: #e6e6e6; color: #333; margin-bottom: 24px; }
.tooltip { position: absolute; top: 28px; left: 100%; margin-left: 28px; width: 360px; background: rgba(0,0,0,0.65); border-radius: 10px; padding: 16px; color: #fff; margin-bottom: 8px; border: 1px solid rgba(0,0,0,0.7); transform-origin: top right; transform: scale(0.96); opacity: 0; transition: transform 150ms ease, opacity 150ms ease; z-index: 60; box-shadow: 0 8px 24px rgba(0,0,0,0.45); }
.tooltip.show { transform: scale(1); opacity: 1; }
.tooltip::before { content: ""; position: absolute; left: -12px; top: 20px; width: 0; height: 0; border-top: 10px solid transparent; border-bottom: 10px solid transparent; border-right: 12px solid rgba(0,0,0,0.65); }
.tooltip.flip-left { left: auto; right: 100%; margin-left: 0; margin-right: 28px; transform-origin: top left; }
.tooltip.flip-left::before { left: auto; right: -12px; border-right: none; border-left: 12px solid rgba(0,0,0,0.65); }
.mismatch { color: #ff2e2e; margin-top: 8px; font-size: 16px; }
.actions { display: flex; align-items: center; justify-content: flex-end; flex: 1; }
.actions button { background: #b0356d; color: #fff; border: 2px solid #000; padding: 14px 48px; font-size: 28px; cursor: pointer; transition: transform 0.2s ease, background-color 0.3s ease, opacity 0.2s ease; }
.actions button.disabled { background: #9e9e9e; color: #e9e9e9; cursor: not-allowed; opacity: 0.9; }
.actions button.animate { animation: highlight 600ms ease; }
@keyframes highlight { 0% { transform: scale(0.98); filter: brightness(0.7); } 60% { transform: scale(1.02); filter: brightness(1.05); } 100% { transform: scale(1); filter: none; } }
@media (max-width: 900px) { .register-columns { flex-direction: column; } .actions { justify-content: center; margin-top: 12px; } .field-label { font-size: 22px; } .field-input { height: 44px; } .register-title { font-size: 36px; } .tooltip { position: relative; width: 100%; top: auto; right: auto; left: auto; transform: none; opacity: 1; box-shadow: none; } .tooltip::before { display: none; } }
</style>
