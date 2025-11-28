<script setup>
import {useI18n} from "vue-i18n";
import { computed } from 'vue';

const { t, locale, availableLocales } = useI18n();
const current = computed(() => (locale && locale.value ? String(locale.value).split('-')[0] : String(locale || 'en')));
function setLocale(l) { locale.value = l; }
</script>

<template>
  <div class="language-switcher" role="tablist" aria-label="Language switcher">
    <button
      v-for="(loc, i) in availableLocales"
      :key="loc"
      :class="['lang-btn', { active: current === loc, 'first': i === 0, 'last': i === availableLocales.length - 1 } ]"
      @click="setLocale(loc)"
      :aria-pressed="current === loc"
      role="tab"
    >
      {{ String(loc).toUpperCase() }}
    </button>
  </div>
</template>

<style scoped>
.language-switcher {
  display: inline-flex;
  gap: 0;
  align-items: center;
  background: rgba(255,255,255,0.04);
  border-radius: 10px;
  overflow: hidden;
  padding: 4px;
  box-sizing: border-box;
}
.lang-btn {
  background: transparent;
  color: var(--ws-white);
  border: none;
  padding: 8px 12px;
  cursor: pointer;
  font-weight: 700;
  text-transform: uppercase;
  font-size: 0.9rem;
  transition: background-color 120ms ease, color 120ms ease, box-shadow 120ms ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.lang-btn:not(.active):hover {
  background: rgba(255,255,255,0.02);
}
.lang-btn.active {
  background: var(--ws-white);
  color: var(--ws-brand-purple-dark);
  box-shadow: 0 6px 18px rgba(75,42,208,0.12);
}
.lang-btn.first {
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
}
.lang-btn.last {
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
}
</style>