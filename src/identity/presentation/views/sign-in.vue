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
const isFormValid = computed(() => isPasswordValid.value && passwordsMatch.value && emailValid.value && firstName.value.trim().length > 0 && lastName.value.trim().length > 0);

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
  if (!isFormValid.value) return;
  // keep existing navigation / behavior; placeholder
  router.push({ path: '/home' });
}

async function positionPopover() {
  await nextTick();
  flipLeft.value = false;
  const pop = popoverRef.value;
  if (!pop) return;
  const rect = pop.getBoundingClientRect();
  const margin = 12;
  flipLeft.value = rect.right + margin > window.innerWidth;
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
  <div class="register-page-modern">
    <div class="register-wrap">
      <div class="hero">
        <img src="/winesoft-logo.png" alt="logo" class="hero-logo" />
        <h2 class="hero-title">{{ t('signUp.title') }}</h2>
        <p class="hero-sub">Create your WineSoft account — manage supplies and inventory with ease.</p>
      </div>

      <div class="card">
        <div class="card-grid">
          <div class="form-area">
            <div class="row two-cols">
              <div class="field">
                <label>First name</label>
                <input class="input" v-model="firstName" placeholder="First name" />
              </div>
              <div class="field">
                <label>Create password</label>
                <input ref="passwordInputRef" class="input" type="password" v-model="password" placeholder="Password" @focus="onPasswordFocus" @blur="onPasswordBlur" />
              </div>
            </div>

            <div class="row two-cols">
              <div class="field">
                <label>Last name</label>
                <input class="input" v-model="lastName" placeholder="Last name" />
              </div>
              <div class="field">
                <label>Confirm password</label>
                <input class="input" type="password" v-model="passwordConfirm" placeholder="Confirm password" />
              </div>
            </div>

            <div class="row">
              <div class="field">
                <label>Email</label>
                <input class="input" v-model="email" placeholder="Email address" />
                <div v-if="email && !emailValid" class="hint error">Invalid email</div>
              </div>
            </div>

            <div class="row actions">
              <button class="btn primary" :disabled="!isFormValid" :class="{ animate: animateButton }" @click="onSiguiente">Next</button>
            </div>
          </div>

          <aside class="info-area">
            <div
              ref="popoverRef"
              class="tooltip"
              :class="[{show: showTooltip}, { 'flip-left': flipLeft }]"
              role="status"
              v-show="showTooltip"
              @mouseenter="onTooltipEnter"
              @mouseleave="onTooltipLeave"
            >
              <div class="tooltip-title">{{ t('signUp.passwordRequirementsTitle') }}</div>
              <ul class="requirements">
                <li :class="{ok: hasLength}">● {{ t('signUp.passwordReqLength') }}</li>
                <li :class="{ok: hasUpper}">● {{ t('signUp.passwordReqUpper') }}</li>
                <li :class="{ok: hasLower}">● {{ t('signUp.passwordReqLower') }}</li>
                <li :class="{ok: hasSpecial}">● {{ t('signUp.passwordReqSpecial') }}</li>
              </ul>
            </div>

            <div class="info-box">
              <h3>Why create an account?</h3>
              <p>Securely manage your supplies, track stock movements and generate purchase orders.</p>
              <ul>
                <li>Real-time inventory</li>
                <li>Order tracking</li>
                <li>PDF reports</li>
              </ul>
            </div>

          </aside>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.register-page-modern { min-height: calc(100vh - 64px); display: flex; align-items: center; justify-content: center; background: linear-gradient(180deg, #071025 0%, #071427 100%); padding: 48px 24px; }
.register-wrap { width: 100%; max-width: 1120px; }
.hero { text-align: center; margin-bottom: 22px; color: var(--ws-white); }
.hero-logo { height: 46px; margin-bottom: 10px; filter: drop-shadow(0 8px 22px rgba(123,91,242,0.18)); }
.hero-title { font-size: 40px; margin: 0; font-weight: 700; letter-spacing: 0.2px; }
.hero-sub { color: rgba(255,255,255,0.72); margin-top: 8px; max-width: 760px; margin-left: auto; margin-right: auto; }

.card { background: linear-gradient(180deg, rgba(8,20,36,0.94), rgba(11,25,44,0.96)); border-radius: 16px; padding: 30px; box-shadow: 0 28px 80px rgba(8,12,30,0.7); border: 1px solid rgba(255,255,255,0.025); }
.card-grid { display: grid; grid-template-columns: 1fr 360px; gap: 24px; align-items: start; }

.form-area { padding: 6px 4px; }
.row { display: flex; gap: 18px; margin-bottom: 16px; }
.two-cols .field { flex: 1; }
.field label { display: block; font-size: 13px; color: rgba(255,255,255,0.9); margin-bottom: 8px; font-weight: 600; }
.input { width: 100%; padding: 14px 16px; border-radius: 12px; border: none; background: rgba(255,255,255,0.04); color: var(--ws-white); font-size: 15px; box-shadow: inset 0 1px 0 rgba(255,255,255,0.02); transition: box-shadow 160ms ease, transform 120ms ease, background 120ms ease; }
.input::placeholder { color: rgba(255,255,255,0.38); }
.input:focus { outline: none; box-shadow: 0 8px 30px rgba(75,42,208,0.14); transform: translateY(-1px); background: rgba(255,255,255,0.03); }
.hint { font-size: 13px; margin-top: 8px; }
.hint.error { color: #ff6b6b; }

.actions { justify-content: flex-end; }
.btn { padding: 12px 24px; border-radius: 12px; border: none; font-weight: 800; cursor: pointer; letter-spacing: 0.25px; }
.btn.primary { background: linear-gradient(90deg,#7b5bf2,#b94cbc); color: #fff; box-shadow: 0 14px 36px rgba(123,91,242,0.16); transition: transform 140ms cubic-bezier(.2,.9,.3,1), box-shadow 120ms ease; }
.btn.primary:hover:not([disabled]) { transform: translateY(-3px); box-shadow: 0 20px 46px rgba(123,91,242,0.22); }
.btn.primary:active:not([disabled]) { transform: translateY(-1px); }
.btn[disabled] { background: rgba(255,255,255,0.06); color: rgba(255,255,255,0.62); cursor: not-allowed; box-shadow: none; }
.btn.animate { animation: highlight 600ms ease; }
@keyframes highlight { 0% { transform: scale(0.98); filter: brightness(0.85); } 60% { transform: scale(1.03); filter: brightness(1.05); } 100% { transform: scale(1); filter: none; } }

.info-area { padding: 12px; display: flex; flex-direction: column; gap: 16px; }
.tooltip { position: relative; display: none; }
.tooltip-title { font-weight: 700; margin-bottom: 8px; }
.requirements { padding-left: 12px; margin: 0 0 12px 0; }
.requirements li { margin-bottom: 6px; opacity: 0.7; font-size: 14px; }
.requirements li.ok { color: #7bf36b; opacity: 1; }
.info-box { margin-top: 6px; padding: 14px; border-radius: 12px; background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01)); color: rgba(255,255,255,0.92); box-shadow: inset 0 1px 0 rgba(255,255,255,0.01); }
.info-box h3 { margin: 0 0 8px 0; font-size: 16px; }
.info-box p { margin: 0 0 8px 0; color: rgba(255,255,255,0.82); font-size: 14px; }
.info-box ul { margin: 0; padding-left: 18px; font-size: 14px; }

/* responsive adjustments */
@media (max-width: 980px) {
  .card-grid { grid-template-columns: 1fr; }
  .info-area { order: -1; }
  .actions { justify-content: center; }
}

/* small screens: make inputs full width and increase spacing */
@media (max-width: 420px) {
  .input { padding: 12px; }
  .hero-title { font-size: 28px; }
}
</style>
