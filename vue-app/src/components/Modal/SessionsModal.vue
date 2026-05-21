<template>
  <div class="modal-backdrop" @click.self="$emit('close')">
    <div class="modal-dialog">
      <div class="modal-header">
        <h2 class="modal-title">Управление сессиями</h2>
        <button class="modal-close" @click="$emit('close')">✕</button>
      </div>
      
      <div class="modal-content">
        <p class="sessions-info">Активные сессии на вашем аккаунте. Удалите ненужные.</p>
        
        <div class="sessions-list">
          <div 
            v-for="session in sessions" 
            :key="session.id"
            :class="['session-item', { current: session.isCurrent }]"
          >
            
            <div class="session-info">
              <div class="session-device">{{ session.deviceName }}</div>
              <div class="session-details">
                <span class="session-location">{{ session.location }}</span>
                <span class="session-separator">•</span>
                <span class="session-time">{{ session.lastActive }}</span>
              </div>
            </div>
            <div class="session-status">
              <span v-if="session.isCurrent" class="current-badge">Текущая</span>
              <button 
                v-else 
                class="delete-btn"
                @click="deleteSession(session.id)"
              >
                Удалить
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button class="close-btn" @click="$emit('close')">Закрыть</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Session {
  id: string
  device: 'desktop' | 'mobile' | 'tablet' | 'other'
  deviceName: string
  location: string
  lastActive: string
  isCurrent: boolean
}

const emit = defineEmits<{
  (e: 'close'): void
}>()

const sessions = ref<Session[]>([
  {
    id: '1',
    device: 'desktop',
    deviceName: 'Chrome на Windows',
    location: 'Москва, Россия',
    lastActive: 'Сейчас',
    isCurrent: true
  },
  {
    id: '2',
    device: 'mobile',
    deviceName: 'Safari на iPhone',
    location: 'Москва, Россия',
    lastActive: '2 часа назад',
    isCurrent: false
  },
  {
    id: '3',
    device: 'desktop',
    deviceName: 'Firefox на macOS',
    location: 'Санкт-Петербург, Россия',
    lastActive: '3 дня назад',
    isCurrent: false
  }
])

const deleteSession = (id: string) => {
  sessions.value = sessions.value.filter(s => s.id !== id)
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-dialog {
  background: var(--card-back-color);
  border: var(--main-border);
  border-radius: 12px;
  width: 100%;
  max-width: 500px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  animation: modalSlideIn 0.2s ease-out;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  border-bottom: var(--main-border);
}

.modal-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--main-font-color);
}

.modal-close {
  background: var(--elem-back-color);
  border: var(--main-border);
  color: var(--secondary-font-color);
  width: 32px;
  height: 32px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  transition: all 0.2s;
}

.modal-close:hover {
  background: var(--elem-back-hover-color);
  color: var(--main-font-color);
}

.modal-content {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
}

.sessions-info {
  font-size: 0.85rem;
  color: var(--secondary-font-color);
  margin-bottom: 1rem;
}

.sessions-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.session-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: var(--elem-back-color);
  border: var(--main-border);
  border-radius: 10px;
  transition: all 0.2s ease;
}

.session-item:hover {
  border-color: #00ff2430;
}

.session-item.current {
  border-color: var(--accent-font-color);
  background: rgba(0, 255, 36, 0.05);
}

.session-icon {
  font-size: 1.5rem;
  width: 40px;
  display: flex;
  justify-content: center;
}

.session-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.session-device {
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--main-font-color);
}

.session-details {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8rem;
  color: var(--secondary-font-color);
}

.session-separator {
  color: var(--elem-back-hover-color);
}

.session-status {
  display: flex;
  align-items: center;
}

.current-badge {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--accent-font-color);
  background: rgba(0, 255, 36, 0.1);
  padding: 6px 12px;
  border-radius: 6px;
}

.delete-btn {
  background: rgba(255, 59, 48, 0.1);
  border: 1px solid rgba(255, 59, 48, 0.3);
  color: #ff3b30;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.delete-btn:hover {
  background: #ff3b30;
  color: #fff;
}

.modal-footer {
  padding: 1rem 1.5rem;
  border-top: var(--main-border);
  display: flex;
  justify-content: flex-end;
}

.close-btn {
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  background: var(--elem-back-color);
  border: var(--main-border);
  color: var(--secondary-font-color);
}

.close-btn:hover {
  background: var(--elem-back-hover-color);
  color: var(--main-font-color);
}

@media (max-width: 768px) {
  .modal-dialog {
    max-height: 90vh;
  }

  .session-item {
    flex-wrap: wrap;
  }

  .session-info {
    flex: 1 1 calc(100% - 60px);
  }

  .session-status {
    flex: 1 1 100%;
    margin-top: 0.5rem;
    justify-content: flex-end;
  }
}
</style>
