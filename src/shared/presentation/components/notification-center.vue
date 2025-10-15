<template>
  <div>
    <button class="notification-btn" @click="togglePanel">
      <span class="pi pi-bell"></span>
      <span v-if="unreadCount > 0" class="notification-badge">{{ unreadCount }}</span>
    </button>
    <div v-if="showPanel" class="notification-panel">
      <div class="notification-header">
        <span>{{ $t('notifications.title') }}</span>
        <button class="close-btn" @click="togglePanel">&times;</button>
      </div>
      <div v-if="notifications.length === 0" class="notification-empty">
        {{ $t('notifications.empty') }}
      </div>
      <ul v-else class="notification-list">
        <li v-for="n in notifications" :key="n.id" :class="{ unread: !n.read }">
          <div class="notification-content">
            <span>{{ n.message }}</span>
            <small>{{ n.date }}</small>
          </div>
          <button v-if="!n.read" @click="markAsRead(n.id)">{{ $t('notifications.markAsRead') }}</button>
        </li>
      </ul>
      <div v-if="notifications.length > 0" class="notification-actions">
        <button @click="markAllAsRead">{{ $t('notifications.markAllAsRead') }}</button>
        <button @click="clearAll">{{ $t('notifications.clearAll') }}</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useNotificationStore } from '../../../inventory/application/notification.store';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const store = useNotificationStore();
const showPanel = ref(false);

const notifications = computed(() => store.notifications);
const unreadCount = computed(() => store.notifications.filter(n => !n.read).length);

function togglePanel() {
  showPanel.value = !showPanel.value;
}
function markAsRead(id) {
  store.markAsRead(id);
}
function markAllAsRead() {
  store.markAllAsRead();
}
function clearAll() {
  store.clearAll();
}
</script>

<style scoped>
.notification-btn {
  position: relative;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.5rem;
  color: #fff;
}
.notification-badge {
  position: absolute;
  top: 0;
  right: 0;
  background: #e91e63;
  color: #fff;
  border-radius: 50%;
  padding: 0 6px;
  font-size: 0.8rem;
}
.notification-panel {
  position: absolute;
  right: 0;
  top: 2.5rem;
  width: 320px;
  background: #222;
  color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  z-index: 1000;
  padding: 0.5rem 0;
}
.notification-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1rem;
  border-bottom: 1px solid #444;
  font-weight: bold;
}
.close-btn {
  background: none;
  border: none;
  color: #fff;
  font-size: 1.2rem;
  cursor: pointer;
}
.notification-empty {
  padding: 1rem;
  text-align: center;
  color: #aaa;
}
.notification-list {
  list-style: none;
  margin: 0;
  padding: 0;
  max-height: 250px;
  overflow-y: auto;
}
.notification-list li {
  padding: 0.7rem 1rem;
  border-bottom: 1px solid #333;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.notification-list li.unread {
  background: #3f1a2d;
}
.notification-content {
  display: flex;
  flex-direction: column;
}
.notification-actions {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 1rem;
}
.notification-actions button {
  background: #e91e63;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 0.3rem 0.7rem;
  cursor: pointer;
  font-size: 0.9rem;
}
</style>
