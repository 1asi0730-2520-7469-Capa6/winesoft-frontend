<script setup>
import { useI18n } from "vue-i18n";

const { t } = useI18n();
</script>

<template>
  <footer class="footer-container">
    <p class="footer-text">
      © 2025 Capa 6 Development Team. {{ t("footer.rights") }}
    </p>
    <p class="footer-subtext">
      {{ t("authoring-phrase.intro") }}
      <i class="pi pi-heart heart"></i>
      {{ t("authoring-phrase.use") }}
      <a href="https://primevue.org/" target="_blank" class="footer-link">PrimeVue</a>
      {{ t("authoring-phrase.author", { brand: "Capa6" }) }}
    </p>
  </footer>
</template>

<style scoped>
.footer-container {
  width: 100%;
  background: linear-gradient(135deg, #0a0f1e 0%, #111633 40%, #1e1b4b 100%);
  color: #e0e7ff;
  text-align: center;
  padding: 1.5rem 1rem;
  font-family: "Poppins", sans-serif;
  position: relative;
  box-shadow: inset 0 0 15px rgba(147, 51, 234, 0.2);
  border-top: 1px solid rgba(147, 197, 253, 0.2);
  overflow: hidden;
}

.footer-container::before {
  content: "";
  position: absolute;
  top: 0;
  left: -50%;
  width: 200%;
  height: 2px;
  background: linear-gradient(90deg, rgba(147, 51, 234, 0.4), rgba(96, 165, 250, 0.4), rgba(147, 51, 234, 0.4));
  animation: glowLine 5s linear infinite;
}

@keyframes glowLine {
  0% { transform: translateX(-50%); }
  100% { transform: translateX(50%); }
}

.footer-text {
  font-size: 0.95rem;
  margin: 0;
  font-weight: 500;
  color: #c7d2fe;
  text-shadow: 0 0 5px rgba(147, 51, 234, 0.4);
}

.footer-subtext {
  margin-top: 0.4rem;
  font-size: 0.85rem;
  color: #a5b4fc;
}

.footer-link {
  color: #8b5cf6;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
}

.footer-link:hover {
  color: #a78bfa;
  text-shadow: 0 0 6px rgba(167, 139, 250, 0.8);
}

.heart {
  color: #8b5cf6;
  margin: 0 0.2rem;
  text-shadow: 0 0 8px rgba(139, 92, 246, 0.8);
}
</style>