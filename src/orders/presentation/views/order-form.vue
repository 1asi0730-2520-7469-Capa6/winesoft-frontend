<script setup>
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import useOrdersStore from "../../application/orders.store.js"; // RUTA ACTUALIZADA
import { computed, onMounted, ref } from "vue";
import { Order } from "../../domain/model/order.entity.js"; // RUTA ACTUALIZADA

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const store = useOrdersStore(); // STORE ACTUALIZADO
const { errors, addOrder, updateOrder } = store;

const form = ref({
  supplyId: null,
  quantity: 0,
  supplierId: null,
  status: "pending"
});
const isEdit = computed(() => !!route.params.id);

const statusOptions = ref([
  { label: t('orders.status-pending'), value: 'pending' },
  { label: t('orders.status-in-transit'), value: 'in-transit' },
  { label: t('orders.status-delivered'), value: 'delivered' }
]);

onMounted(() => {
  if (isEdit.value) {
    const order = store.getOrderById(route.params.id);
    if (order) {
      form.value.supplyId = order.supplyId;
      form.value.quantity = order.quantity;
      form.value.supplierId = order.supplierId;
      form.value.status = order.status;
    } else router.push({ name: "order-list" }); // RUTA ACTUALIZADA
  }
});

const saveOrder = () => {
  const order = new Order({
    id: isEdit.value ? parseInt(route.params.id) : null,
    supplyId: form.value.supplyId,
    quantity: form.value.quantity,
    supplierId: form.value.supplierId,
    status: form.value.status,
  });
  if (isEdit.value) updateOrder(order);
  else addOrder(order);
  navigateBack();
};

const navigateBack = () => {
  router.push({ name: "order-list" }); // RUTA ACTUALIZADA
};
</script>

<template>
  <div class="p-4">
    <h1>{{ isEdit ? t("orders.edit") : t("orders.new") }}</h1>
    <form @submit.prevent="saveOrder">
      <div class="field mb-3">
        <label for="supplyId">{{ t("orders.supplyId") }}</label>
        <pv-input-number id="supplyId" v-model="form.supplyId" required class="w-full" />
      </div>
      <div class="field mb-3">
        <label for="supplierId">{{ t("orders.supplierId") }}</label>
        <pv-input-number id="supplierId" v-model="form.supplierId" required class="w-full" />
      </div>
      <div class="field mb-3">
        <label for="quantity">{{ t("orders.quantity") }}</label>
        <pv-input-number id="quantity" v-model="form.quantity" required class="w-full" />
      </div>
      <div class="field mb-3">
        <label for="status">{{ t("orders.status") }}</label>
        <pv-select
            id="status"
            v-model="form.status"
            :options="statusOptions"
            option-label="label"
            option-value="value"
            class="w-full"
        />
      </div>
      <pv-button type="submit" :label="t('orders.save')" icon="pi pi-save" />
      <pv-button :label="t('orders.cancel')" severity="secondary" class="ml-2" @click="navigateBack" />
    </form>
    <div v-if="errors.length" class="text-red-500 mt-3">
      {{ t("errors.occurred") }}: {{ errors.map((e) => e.message).join(", ") }}
    </div>
  </div>
</template>