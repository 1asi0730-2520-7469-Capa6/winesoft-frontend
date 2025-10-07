<script setup>
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import useInventoryStore from "../../application/inventory.store.js";
import { computed, onMounted, ref } from "vue";
import { Supply } from "../../domain/model/supply.entity.js";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const store = useInventoryStore();
const { errors, addSupply, updateSupply } = store;

const form = ref({ productId: null, quantity: 0, supplier: "", date: "" });
const isEdit = computed(() => !!route.params.id);

onMounted(() => {
  if (isEdit.value) {
    const supply = store.getSupplyById(route.params.id);
    if (supply) {
      form.value.productId = supply.productId;
      form.value.quantity = supply.quantity;
      form.value.supplier = supply.supplier;
      form.value.date = supply.date;
    } else router.push({ name: "inventory-supplies" });
  }
});

const saveSupply = () => {
  const supply = new Supply({
    id: isEdit.value ? parseInt(route.params.id) : null,
    productId: form.value.productId,
    quantity: form.value.quantity,
    supplier: form.value.supplier,
    date: form.value.date,
  });
  if (isEdit.value) updateSupply(supply);
  else addSupply(supply);
  navigateBack();
};

const navigateBack = () => {
  router.push({ name: "inventory-supplies" });
};
</script>

<template>
  <div class="p-4">
    <h1>{{ isEdit ? t("supplies.edit") : t("supplies.new") }}</h1>
    <form @submit.prevent="saveSupply">
      <div class="field mb-3">
        <label for="productId">{{ t("supplies.productId") }}</label>
        <pv-input-number id="productId" v-model="form.productId" required class="w-full" />
      </div>
      <div class="field mb-3">
        <label for="quantity">{{ t("supplies.quantity") }}</label>
        <pv-input-number id="quantity" v-model="form.quantity" required class="w-full" />
      </div>
      <div class="field mb-3">
        <label for="supplier">{{ t("supplies.supplier") }}</label>
        <pv-input-text id="supplier" v-model="form.supplier" required class="w-full" />
      </div>
      <div class="field mb-3">
        <label for="date">{{ t("supplies.date") }}</label>
        <pv-calendar id="date" v-model="form.date" date-format="yy-mm-dd" show-icon class="w-full" />
      </div>
      <pv-button type="submit" :label="t('supplies.save')" icon="pi pi-save" />
      <pv-button :label="t('supplies.cancel')" severity="secondary" class="ml-2" @click="navigateBack" />
    </form>
    <div v-if="errors.length" class="text-red-500 mt-3">
      {{ t("errors.occurred") }}: {{ errors.map((e) => e.message).join(", ") }}
    </div>
  </div>
</template>
