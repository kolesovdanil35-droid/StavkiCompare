<template>
  <div class="custom-select" @click="toggle">
    <div class="select-header" :class="{focus:isOpen}">
      {{ selectedOption?.label || 'Выберите' }}
        <span class="arrow" :class="{ open: isOpen }">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                <polyline points="3 8 8 13 13 8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </span>
    </div>
    
    <transition name="dropdown">
      <div v-if="isOpen" class="select-dropdown">
        <div
          v-for="option in options"
          :key="option.value"
          class="select-option"
          @click="selectOption(option)"
        >
          {{ option.label }}
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  options: Array,
  modelValue: [String, Number]
})

const emit = defineEmits(['update:modelValue'])

const isOpen = ref(false)

const selectedOption = computed(() => 
  props.options.find(opt => opt.value === props.modelValue)
)

const toggle = () => {
  isOpen.value = !isOpen.value
}

const selectOption = (option) => {
  emit('update:modelValue', option.value)
  isOpen.value = false
}
</script>

<style scoped>
.custom-select {
  position: relative;
  width: 200px;
  user-select: none;
  letter-spacing: 0.5px;
}

.select-header {
  border: var(--main-border);
  border-radius: 8px;
  background: inherit;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 12px;
}
.select-header.focus{
    border-color: #00ff2440;
}
.arrow {
  transition: transform 0.3s;
}

.arrow.open {
  transform: rotate(90deg);
}

.select-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 5px;
  border-radius: 8px;
  border: var(--main-border);
  background: #141414;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  z-index: 100;
  
}

.select-option {
  padding: 10px;
  cursor: pointer;
  border-radius: 8px;
  transition: background 0.2s;
}

.select-option:hover {
    background: #252525;
    border: 1px solid #00ff2440;
    
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>