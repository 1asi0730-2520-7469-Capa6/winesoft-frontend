<script setup>
import {useI18n} from "vue-i18n";

const {locale, availableLocales} = useI18n();
</script>

<template>
  <div class="language-switcher">
    <pv-select-button
        v-model="locale"
        :options="availableLocales"
        class="lang-select"
    />
  </div>
</template>

<style scoped>

</style>