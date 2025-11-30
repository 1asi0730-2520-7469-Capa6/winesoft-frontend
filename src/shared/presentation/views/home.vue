<script setup>
import {useI18n} from "vue-i18n";

const {t} = useI18n();
</script>

<template>
  <div class="home-container">
    <transition name="fade">
      <pv-card v-if="show" class="home-card shadow-4 home-card-large">
        <template #title>
          <h1 class="text-5xl font-bold text-primary text-center mb-2">
            {{ t('home.title') }}
          </h1>
        </template>
        <template #content>
          <p class="text-xl text-gray-300 text-center mt-2 leading-relaxed max-w-3xl mx-auto">
            {{ t('home.content') }}
          </p>
          <div class="mt-8 flex justify-center gap-5 home-options-center">
            <pv-button
                :label="`📦 ${t('home.manage-supplies')}`"
                icon="pi pi-box"
                severity="primary"
                @click="goToSupplies"
            />
            <pv-button
                :label="`📊 ${t('home.views-stock')}`"
                icon="pi pi-chart-line"
                severity="secondary"
                @click="goToStock"
            />
          </div>
        </template>
      </pv-card>
    </transition>
  </div>
</template>

<style scoped>

.home-container {
  display: flex;
  justify-content: center;
  min-height: 100vh;
  padding-top: 60px;
  padding-bottom: 80px;
  background: linear-gradient(180deg, var(--ws-bg-dark) 0%, var(--ws-bg-dark-end) 100%);
  color: var(--ws-white);
}
.home-card {
  background: rgba(11, 29, 57, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.05);
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
