<script setup>
import {useI18n} from "vue-i18n";

const { t } = useI18n();

</script>

<template>
  <footer class="footer-content">
    <div class="footer-section">
      <p>Copyright &copy; 2025. Capa 6 Development Team.</p>
    </div>
    <div class="footer-section">
      <p>
        {{ t('authoring-phrase.intro') }} <i class="pi pi-heart"/>
        {{ t('authoring-phrase.use') }} <a href="https://primevue.org/" target="_blank">PrimeVue</a>
        {{ t('authoring-phrase.author', { brand: 'Capa6' }) }}
      </p>
    </div>
  </footer>
</template>

<style scoped>
.footer-content {
  width: 100%;
  position: static;
  left: unset;
  right: unset;
  transform: none;
  background: #b23a6b; /* Color rosado personalizado */
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem 2rem 1rem;
  box-sizing: border-box;
}
.footer-section {
  text-align: center;
  margin-bottom: 0.5rem;
}
.footer-section:last-child {
  margin-bottom: 0;
}
</style>