<script setup>
import {useI18n} from "vue-i18n";
import {ref} from "vue";
import LanguageSwitcher from "./language-switcher.vue";
import FooterContent from "./footer-content.vue";

const {t} = useI18n();
const drawer = ref(false);
const items = [
  {label: 'option.home', to: '/home'},
  {label: 'option.supplies', to: '/inventory/supplies'},
  {label: 'option.stockMovements', to: '/inventory/stock-movements'},
];
</script>

<template>
  <pv-toast/>
  <pv-confirm-dialog/>
  <div class="header">
    <pv-toolbar class="bg-primary">
      <template #start>
        <img class="logo" src="/winesoft-logo.png" alt="WineSoft Logo"/>
        <h3>WineSoft</h3>
      </template>
      <template #end>
        <div class="flex-column mr-3">
          <pv-button
              v-for="item in items"
              :key="item.label"
              as-child
              v-slot="slotProps"
          >
            <router-link :to="item.to" :class="slotProps['class']">
              {{ t(item.label) }}
            </router-link>
          </pv-button>
        </div>
        <language-switcher/>
      </template>
    </pv-toolbar>
    <pv-drawer v-model="drawer"/>
  </div>
  <div class="main-content">
    <router-view/>
  </div>
  <div class="footer">
    <footer-content/>
  </div>
</template>

<style scoped>
.header {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
}

.logo {
  height: 40px;
  width: auto;
}

.main-content {
  margin-top: 60px;
  padding-bottom: 60px;
}

.footer {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 10px;
}
</style>
