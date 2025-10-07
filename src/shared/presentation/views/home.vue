<script setup>
import { useI18n } from "vue-i18n";
import { ref, onMounted } from "vue";
import router from "../../../router.js";

const { t } = useI18n();
const show = ref(false);

onMounted(() => {
  setTimeout(() => (show.value = true), 150);
});

const goToSupplies = () => {
  router.push("/inventory/supplies");
};

const goToStock = () => {
  router.push("/inventory/stock-movements");
};

</script>

<template>
  <div class="home-container">
    <transition name="fade">
      <pv-card v-if="show" class="home-card shadow-4">
        <template #title>
          <h1 class="text-4xl font-bold text-primary text-center">
            {{ t('home.title') }}
          </h1>
        </template>
        <template #content>
          <p class="text-lg text-gray-300 text-center mt-3 leading-relaxed max-w-2xl mx-auto">
            {{ t('home.content') }}
          </p>

          <div class="mt-6 flex justify-center gap-3">
            <pv-button
                :label="`📦 ${t('home.manage-supplies')}`"
                icon="pi pi-box"
                severity="primary"
                @click="goToSupplies"
            />
            <pv-button
                :label="`📊 ${t('home.view-stock')}`"
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
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 140px);
  background: linear-gradient(180deg, #1a1a1a 0%, #121212 100%);
  color: #ededed;
}

.home-card {
  background: rgba(28, 28, 28, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 1rem;
  padding: 2rem;
  width: 90%;
  max-width: 700px;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
