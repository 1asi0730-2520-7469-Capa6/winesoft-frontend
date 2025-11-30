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


const goToOrders = () => {
  router.push("/purchase/orders");
};

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
            <pv-button
                :label="`🛒 ${t('option.orders')}`"
                icon="pi pi-shopping-cart"
                severity="help"
                @click="goToOrders"
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
  align-items: flex-start;
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
  padding: 2.5rem 2.5rem 2rem 2.5rem;
  width: 100%;
  max-width: 900px;
  margin: 0;
}
.home-card-large {
  min-height: 420px;
}
.home-options-center {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>