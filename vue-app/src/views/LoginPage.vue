<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../stores/auth'

const router = useRouter()
const { login } = useAuth()

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

const submit = async () => {
  error.value = ''
  loading.value = true
  try {
    await login(email.value, password.value)
    router.push('/')
  } catch (err: any) {
    error.value = err.response?.data?.error || 'Ошибка входа'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="auth-page">
    <div class="auth-card">
      <h1 class="auth-title">Вход</h1>
      <form @submit.prevent="submit" class="auth-form">
        <div class="field">
          <label>Email</label>
          <input v-model="email" type="email" placeholder="your@email.com" required />
        </div>
        <div class="field">
          <label>Пароль</label>
          <input v-model="password" type="password" placeholder="••••••" required />
        </div>
        <p v-if="error" class="auth-error">{{ error }}</p>
        <button type="submit" class="auth-btn" :disabled="loading">
          {{ loading ? 'Загрузка...' : 'Войти' }}
        </button>
      </form>
      <p class="auth-link">
        Нет аккаунта? <router-link to="/register">Зарегистрироваться</router-link>
      </p>
    </div>
  </div>
</template>

<style scoped>
.auth-page {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4rem 1rem;
}

.auth-card {
  width: 100%;
  max-width: 400px;
  background: var(--card-back-color);
  border: var(--main-border);
  border-radius: 16px;
  padding: 2.5rem;
}

.auth-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--main-font-color);
  margin-bottom: 1.5rem;
  text-align: center;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field label {
  font-size: 0.85rem;
  color: var(--secondary-font-color);
}

.field input {
  background: var(--elem-back-color);
  border: var(--main-border);
  border-radius: 8px;
  padding: 10px 14px;
  font-size: 1rem;
  color: var(--main-font-color);
  outline: none;
  transition: border-color 0.2s;
}

.field input:focus {
  border-color: var(--accent-font-color);
}

.auth-error {
  color: #ff3b30;
  font-size: 0.85rem;
  text-align: center;
}

.auth-btn {
  margin-top: 0.5rem;
  padding: 12px;
  background: var(--accent-font-color);
  color: #09090b;
  font-size: 1rem;
  font-weight: 700;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: opacity 0.2s;
}

.auth-btn:hover {
  opacity: 0.9;
}

.auth-btn:disabled {
  opacity: 0.5;
  cursor: default;
}

.auth-link {
  margin-top: 1.5rem;
  text-align: center;
  font-size: 0.85rem;
  color: var(--secondary-font-color);
}

.auth-link a {
  color: var(--accent-font-color);
  text-decoration: none;
}

.auth-link a:hover {
  text-decoration: underline;
}
</style>
