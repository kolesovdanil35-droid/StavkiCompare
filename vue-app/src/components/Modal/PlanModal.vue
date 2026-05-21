<template>
  <div class="modal-backdrop" @click.self="$emit('close')">
    <div class="modal-dialog">
      <div class="modal-header">
        <h2 class="modal-title">Выберите тарифный план</h2>
        <button class="modal-close" @click="$emit('close')">✕</button>
      </div>
      
      <div class="modal-content">
        <div class="plans-grid">
          <div 
            v-for="plan in plans" 
            :key="plan.id"
            :class="['plan-card', { current: modelValue === plan.id, recommended: plan.recommended }]"
            @click="selectPlan(plan.id)"
          >
            <div v-if="plan.recommended" class="plan-badge-top">Популярный</div>
            <div class="plan-name">{{ plan.name }}</div>
            <div class="plan-price">
              <span class="price-value">{{ plan.price }}</span>
              <span class="price-period">/мес</span>
            </div>
            <ul class="plan-features-list">
              <li v-for="(feature, i) in plan.features" :key="i">
                <span class="feature-icon">✓</span>
                {{ feature }}
              </li>
            </ul>
            <div class="plan-select-btn">
              <span v-if="modelValue === plan.id">Текущий план</span>
              <span v-else>Выбрать</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Plan {
  id: string
  name: string
  price: string
  features: string[]
  recommended: boolean
}

defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'close'): void
}>()

const plans: Plan[] = [
  {
    id: 'Basic',
    name: 'Базовый',
    price: 'Бесплатно',
    features: [
      'Доступ к 5 матчам в день',
      'Базовая аналитика'
    ],
    recommended: false
  },
  {
    id: 'NoAds',
    name: 'Без рекламы',
    price: '299₽',
    features: [
      'Без рекламы',
      'Доступ к 20 матчам в день',
      'Расширенная аналитика'
    ],
    recommended: false
  },
  {
    id: 'Unlimited',
    name: 'Безлимитный',
    price: '599₽',
    features: [
      'Безлимитный доступ к анализу',
      'Без рекламы',
      'Уведомления об изменениях коэффициентов',
      'Экспорт данных в PDF',
      'Приоритетная поддержка'
    ],
    recommended: true
  }
]

const selectPlan = (planId: string) => {
  emit('update:modelValue', planId)
  emit('close')
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
  max-width: 800px;
  max-height: 90vh;
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

.plans-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.plan-card {
  background: var(--elem-back-color);
  border: var(--main-border);
  border-radius: 12px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  display: flex;
  flex-direction: column;
}

.plan-card:hover {
  border-color: #00ff2440;
  transform: translateY(-2px);
}

.plan-card.current {
  border-color: var(--accent-font-color);
  background: rgba(0, 255, 36, 0.05);
}

.plan-card.recommended {
  border-color: var(--accent-font-color);
  background: linear-gradient(135deg, rgba(0, 255, 36, 0.08), rgba(0, 255, 36, 0.02));
}

.plan-badge-top {
  position: absolute;
  top: -10px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--accent-font-color);
  color: var(--card-back-color);
  font-size: 0.7rem;
  font-weight: 700;
  padding: 4px 12px;
  border-radius: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.plan-name {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--main-font-color);
  margin-bottom: 0.75rem;
  text-align: center;
}

.plan-price {
  text-align: center;
  margin-bottom: 1rem;
}

.price-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--accent-font-color);
}

.price-period {
  font-size: 0.85rem;
  color: var(--secondary-font-color);
}

.plan-features-list {
  list-style: none;
  padding: 0;
  margin: 0 0 1rem 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.plan-features-list li {
  font-size: 0.8rem;
  color: var(--secondary-font-color);
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.feature-icon {
  color: var(--accent-font-color);
  font-weight: 700;
}

.plan-select-btn {
  text-align: center;
  padding: 10px;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  background: var(--elem-back-hover-color);
  color: var(--main-font-color);
  transition: all 0.2s ease;
}

.plan-card.current .plan-select-btn {
  background: var(--accent-font-color);
  color: var(--card-back-color);
}

.plan-card:not(.current):hover .plan-select-btn {
  background: var(--accent-font-color);
  color: var(--card-back-color);
}

@media (max-width: 768px) {
  .modal-dialog {
    max-width: 100%;
  }

  .plans-grid {
    grid-template-columns: 1fr;
  }
}
</style>
