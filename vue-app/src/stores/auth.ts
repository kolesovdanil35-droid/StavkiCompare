import { reactive, computed } from 'vue'
import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE || ''

interface User {
  id: number
  email: string
  name: string
  avatar: string
}

interface AuthState {
  user: User | null
  token: string | null
}

const state = reactive<AuthState>({
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  token: localStorage.getItem('token'),
})

export function useAuth() {
  const isAuthenticated = computed(() => !!state.token && !!state.user)

  const saveSession = (user: User, token: string) => {
    state.user = user
    state.token = token
    localStorage.setItem('user', JSON.stringify(user))
    localStorage.setItem('token', token)
  }

  const clearSession = () => {
    state.user = null
    state.token = null
    localStorage.removeItem('user')
    localStorage.removeItem('token')
  }

  const register = async (name: string, email: string, password: string) => {
    const res = await axios.post(`${API_BASE}/api/auth/register`, { name, email, password })
    saveSession(res.data.user, res.data.token)
    return res.data
  }

  const login = async (email: string, password: string) => {
    const res = await axios.post(`${API_BASE}/api/auth/login`, { email, password })
    saveSession(res.data.user, res.data.token)
    return res.data
  }

  const logout = () => {
    clearSession()
  }

  const fetchMe = async () => {
    if (!state.token) return null
    try {
      const res = await axios.get(`${API_BASE}/api/auth/me`, {
        headers: { Authorization: `Bearer ${state.token}` },
      })
      state.user = res.data
      localStorage.setItem('user', JSON.stringify(res.data))
      return res.data
    } catch {
      clearSession()
      return null
    }
  }

  return { state, isAuthenticated, register, login, logout, fetchMe }
}
