<script setup lang="ts">
import { toastStore } from '../../stores/toast'
</script>

<template>
  <Teleport to="body">
    <div class="toast-container">
      <TransitionGroup name="toast">
        <div v-for="t in toastStore.state.toasts" :key="t.id" :class="['toast', t.type]">
          {{ t.message }}
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped>
.toast-container {
  position: fixed;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 8px;
  pointer-events: none;
}

.toast {
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #fff;
  white-space: nowrap;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
  pointer-events: auto;
}

.toast.success {
  background: #00c853;
}

.toast.error {
  background: #ff3b30;
}

.toast.info {
  background: #2196f3;
}

.toast-enter-active {
  transition: all 0.25s ease;
}

.toast-leave-active {
  transition: all 0.2s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateY(16px);
}

.toast-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
