<template>
  <div class="modal-backdrop" @click.self="$emit('close')">
    <div class="modal-dialog">
      <div class="modal-header">
        <h2 class="modal-title">{{ titles[type] }}</h2>
        <button class="modal-close" @click="$emit('close')">✕</button>
      </div>
      
      <div class="modal-search" v-if="type !== 'sports'">
        <input 
          v-model="searchQuery" 
          type="text" 
          :placeholder="type === 'teams' ? 'Поиск команды...' : 'Поиск букмекера...'"
          class="search-input"
        >
      </div>

      <div class="modal-content">
        <div class="select-all" v-if="type !== 'sports'">
          <label class="checkbox-item">
            <input type="checkbox" :checked="isAllSelected" @change="toggleSelectAll">
            <span class="checkbox-custom"></span>
            <span class="checkbox-label">Выбрать все</span>
          </label>
        </div>

        <div class="items-list">
          <label 
            v-for="item in filteredItems" 
            :key="item.id"
            class="checkbox-item"
          >
            <input 
              type="checkbox" 
              :value="item.id" 
              v-model="tempSelected"
            >
            <span class="checkbox-custom"></span>
            <div class="item-info">
              <span class="item-name">{{ item.name }}</span>
              <span class="item-sub" v-if="'country' in item && item.country">{{ item.country }}</span>
            </div>
          </label>
        </div>
      </div>

      <div class="modal-footer">
        <button class="cancel-btn" @click="$emit('close')">Отмена</button>
        <button class="save-btn" @click="saveSelection">Сохранить ({{ tempSelected.length }})</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

interface TeamItem { id: number; name: string; country: string }
interface SportItem { id: number; name: string }
interface BookmakerItem { id: number; name: string; country: string }

const props = defineProps<{
  type: 'teams' | 'sports' | 'bookmakers'
  modelValue: number[]
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: number[]): void
  (e: 'close'): void
}>()

const titles: Record<string, string> = {
  teams: 'Любимые команды',
  sports: 'Виды спорта',
  bookmakers: 'Букмекеры'
}

const teams: TeamItem[] = [
  { id: 1, name: 'Ливерпуль', country: 'Англия' },
  { id: 2, name: 'Манчестер Сити', country: 'Англия' },
  { id: 3, name: 'Барселона', country: 'Испания' },
  { id: 4, name: 'Реал Мадрид', country: 'Испания' },
  { id: 5, name: 'Бавария', country: 'Германия' },
  { id: 6, name: 'Боруссия Дортмунд', country: 'Германия' },
  { id: 7, name: 'ПСЖ', country: 'Франция' },
  { id: 8, name: 'Ювентус', country: 'Италия' },
  { id: 9, name: 'Милан', country: 'Италия' },
  { id: 10, name: 'Интер', country: 'Италия' },
  { id: 11, name: 'Атлетико Мадрид', country: 'Испания' },
  { id: 12, name: 'Челси', country: 'Англия' },
  { id: 13, name: 'Арсенал', country: 'Англия' },
  { id: 14, name: 'Манчестер Юнайтед', country: 'Англия' },
  { id: 15, name: 'Зенит', country: 'Россия' },
  { id: 16, name: 'Спартак', country: 'Россия' },
  { id: 17, name: 'Динамо', country: 'Россия' },
  { id: 18, name: 'ЦСКА', country: 'Россия' },
]

const sports: SportItem[] = [
  { id: 1, name: '⚽ Футбол' },
  { id: 2, name: '🏀 Баскетбол' },
  { id: 3, name: '🎾 Теннис' },
  { id: 4, name: '🏒 Хоккей' },
  { id: 5, name: '⚾ Бейсбол' },
  { id: 6, name: '🎮 Киберспорт' },
  { id: 7, name: '🏎️ Формула 1' },
  { id: 8, name: '🥊 Единоборства' },
]

const bookmakers: BookmakerItem[] = [
  { id: 1, name: '1xСтавка', country: 'Россия' },
  { id: 2, name: 'Лига Ставок', country: 'Россия' },
  { id: 3, name: 'BetBoom', country: 'Россия' },
  { id: 4, name: 'Winline', country: 'Россия' },
  { id: 5, name: 'Фонбет', country: 'Россия' },
  { id: 6, name: 'Мелбет', country: 'Россия' },
  { id: 7, name: 'Париматч', country: 'Россия' },
  { id: 8, name: 'Олимп', country: 'Россия' },
  { id: 9, name: 'Bet365', country: 'Международный' },
  { id: 10, name: 'William Hill', country: 'Международный' },
  { id: 11, name: 'Unibet', country: 'Международный' },
  { id: 12, name: 'Pinnacle', country: 'Международный' },
  { id: 13, name: 'Marathonbet', country: 'Международный' },
  { id: 14, name: 'Bwin', country: 'Международный' },
]

const searchQuery = ref('')
const tempSelected = ref<number[]>([...props.modelValue])

watch(() => props.modelValue, (val) => {
  tempSelected.value = [...val]
})

watch(() => props.type, () => {
  searchQuery.value = ''
})

const allItems = computed(() => {
  if (props.type === 'teams') return teams
  if (props.type === 'sports') return sports
  return bookmakers
})

const filteredItems = computed(() => {
  if (!searchQuery.value) return allItems.value
  
  const query = searchQuery.value.toLowerCase()
  return allItems.value.filter(item => {
    const nameMatch = item.name.toLowerCase().includes(query)
    const countryMatch = 'country' in item && item.country && item.country.toLowerCase().includes(query)
    return nameMatch || countryMatch
  })
})

const isAllSelected = computed(() => 
  tempSelected.value.length === filteredItems.value.length && filteredItems.value.length > 0
)

const toggleSelectAll = () => {
  if (isAllSelected.value) {
    tempSelected.value = []
  } else {
    tempSelected.value = filteredItems.value.map(item => item.id)
  }
}

const saveSelection = () => {
  emit('update:modelValue', [...tempSelected.value])
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

.modal-search {
  padding: 1rem 1.5rem;
  border-bottom: var(--main-border);
}

.search-input {
  width: 100%;
  background: var(--elem-back-color);
  border: var(--main-border);
  border-radius: 8px;
  padding: 10px 14px;
  font-size: 0.9rem;
  color: var(--main-font-color);
}

.search-input:focus {
  outline: none;
  border-color: var(--accent-font-color);
}

.search-input::placeholder {
  color: var(--secondary-font-color);
}

.modal-content {
  flex: 1;
  overflow-y: auto;
  padding: 1rem 1.5rem;
}

.select-all {
  padding-bottom: 0.75rem;
  margin-bottom: 0.75rem;
  border-bottom: var(--main-border);
}

.items-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.checkbox-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.15s ease;
}

.checkbox-item:hover {
  background: var(--elem-back-color);
}

.checkbox-item input {
  display: none;
}

.checkbox-custom {
  width: 20px;
  height: 20px;
  border: 2px solid var(--secondary-font-color);
  border-radius: 4px;
  flex-shrink: 0;
  position: relative;
  transition: all 0.15s ease;
}

.checkbox-item input:checked + .checkbox-custom {
  background: var(--accent-font-color);
  border-color: var(--accent-font-color);
}

.checkbox-item input:checked + .checkbox-custom::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: var(--card-back-color);
  font-size: 12px;
  font-weight: 700;
}

.checkbox-label {
  font-size: 0.9rem;
  color: var(--main-font-color);
  font-weight: 500;
}

.item-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.item-name {
  font-size: 0.9rem;
  color: var(--main-font-color);
}

.item-sub {
  font-size: 0.75rem;
  color: var(--secondary-font-color);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 1rem 1.5rem;
  border-top: var(--main-border);
}

.cancel-btn,
.save-btn {
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.cancel-btn {
  background: var(--elem-back-color);
  border: var(--main-border);
  color: var(--secondary-font-color);
}

.cancel-btn:hover {
  background: var(--elem-back-hover-color);
  color: var(--main-font-color);
}

.save-btn {
  background: var(--accent-font-color);
  border: none;
  color: var(--card-back-color);
  font-weight: 600;
}

.save-btn:hover {
  background: #33ff5c;
  box-shadow: 0 4px 12px rgba(0, 255, 36, 0.3);
}

@media (max-width: 768px) {
  .modal-dialog {
    max-height: 90vh;
  }

  .modal-footer {
    flex-direction: column;
  }

  .cancel-btn,
  .save-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>
