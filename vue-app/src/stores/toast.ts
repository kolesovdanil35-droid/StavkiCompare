import { reactive } from 'vue'

export interface Toast {
  id: number
  message: string
  type: 'success' | 'error' | 'info'
}

const state = reactive({
  toasts: [] as Toast[],
})

let nextId = 0

function add(message: string, type: Toast['type'] = 'success', duration = 2500) {
  const id = nextId++
  state.toasts.push({ id, message, type })
  setTimeout(() => {
    const idx = state.toasts.findIndex(t => t.id === id)
    if (idx !== -1) state.toasts.splice(idx, 1)
  }, duration)
}

export const toastStore = { state, add }
