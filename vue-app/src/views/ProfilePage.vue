<template>
  <div class="profile-page">
    <div class="profile-header">
      <div class="avatar-section">
        <div class="avatar">АИ</div>
        <div class="user-info">
          <h1 class="user-name">Алексей Иванов</h1>
          <span class="user-email">alexey@example.com</span>
        </div>
      </div>
      <div class="plan-badge" :class="currentPlan.toLowerCase()">
        {{ planNames[currentPlan] }}
      </div>
    </div>

    <div class="settings-grid">
      <div class="settings-card">
        <h2 class="card-title">Тарифный план</h2>
        <div class="plan-info">
          <div class="plan-details">
            <div class="plan-current">
              <span class="plan-label">Текущий план:</span>
              <span class="plan-value">{{ planNames[currentPlan] }}</span>
            </div>
            <ul class="plan-features">
              <li v-if="currentPlan === 'Basic'">Доступ к 5 матчам в день</li>
              <li v-if="currentPlan === 'Basic'">Базовая аналитика</li>
              <li v-if="currentPlan === 'NoAds' || currentPlan === 'Unlimited'">Без рекламы</li>
              <li v-if="currentPlan === 'Unlimited'">Безлимитный доступ к анализу</li>
              <li v-if="currentPlan === 'Unlimited'">Уведомления об изменениях коэффициентов</li>
              <li v-if="currentPlan === 'Unlimited'">Экспорт данных в PDF</li>
              <li v-if="currentPlan === 'Unlimited'">Приоритетная поддержка</li>
            </ul>
          </div>
          <button class="upgrade-btn" @click="showPlanModal = true" v-if="currentPlan === 'Basic'">
            Улучшить план
          </button>
          <div class="plan-actions" v-else>
            <button class="secondary-btn" @click="showPlanModal = true">Сменить план</button>
            <span class="renew-date">До 15.06.2026</span>
          </div>
        </div>
      </div>

      <div class="settings-card">
        <h2 class="card-title">Уведомления</h2>
        <div class="settings-list">
          <div class="setting-item">
            <div class="setting-info">
              <span class="setting-name">Email-уведомления</span>
              <span class="setting-desc">Получать важные обновления на почту</span>
            </div>
            <label class="toggle">
              <input type="checkbox" v-model="settings.emailNotifications">
              <span class="toggle-slider"></span>
            </label>
          </div>
          <div class="setting-item">
            <div class="setting-info">
              <span class="setting-name">Push-уведомления</span>
              <span class="setting-desc">Мгновенные оповещения в браузере</span>
            </div>
            <label class="toggle">
              <input type="checkbox" v-model="settings.pushNotifications">
              <span class="toggle-slider"></span>
            </label>
          </div>
          <div class="setting-item">
            <div class="setting-info">
              <span class="setting-name">Уведомления Telegram</span>
              <span class="setting-desc">Получать прогнозы в Telegram</span>
            </div>
            <label class="toggle">
              <input type="checkbox" v-model="settings.telegramNotifications">
              <span class="toggle-slider"></span>
            </label>
          </div>
          <div class="setting-item">
            <div class="setting-info">
              <span class="setting-name">Изменения коэффициентов</span>
              <span class="setting-desc">Alert при значительном изменении</span>
            </div>
            <label class="toggle">
              <input type="checkbox" v-model="settings.oddsChangeAlert">
              <span class="toggle-slider"></span>
            </label>
          </div>
        </div>
      </div>

      <div class="settings-card">
        <h2 class="card-title">Безопасность</h2>
        <div class="settings-list">
          <div class="setting-item">
            <div class="setting-info">
              <span class="setting-name">Двухфакторная авторизация</span>
              <span class="setting-desc">Дополнительная защита аккаунта</span>
            </div>
            <label class="toggle">
              <input type="checkbox" v-model="settings.twoFactorAuth">
              <span class="toggle-slider"></span>
            </label>
          </div>
          <div class="setting-item">
            <div class="setting-info">
              <span class="setting-name">Сессии</span>
              <span class="setting-desc">2 активных устройства</span>
            </div>
            <button class="text-btn" @click="showSessionsModal = true">Управление</button>
          </div>
          <div class="setting-item">
            <div class="setting-info">
              <span class="setting-name">Сменить пароль</span>
              <span class="setting-desc">Последнее изменение: 3 месяца назад</span>
            </div>
            <button class="text-btn">Изменить</button>
          </div>
        </div>
      </div>

      <div class="settings-card">
        <h2 class="card-title">Внешний вид</h2>
        <div class="settings-list">
          <div class="setting-item">
            <div class="setting-info">
              <span class="setting-name">Тема интерфейса</span>
              <span class="setting-desc">Выберите цветовую схему</span>
            </div>
            <select v-model="settings.theme" class="theme-select">
              <option value="dark">Тёмная</option>
              <option value="light">Светлая</option>
              <option value="system">Системная</option>
            </select>
          </div>
          <div class="setting-item">
            <div class="setting-info">
              <span class="setting-name">Размер шрифта</span>
              <span class="setting-desc">Настройте комфортный размер</span>
            </div>
            <select v-model="settings.fontSize" class="theme-select">
              <option value="small">Мелкий</option>
              <option value="medium">Средний</option>
              <option value="large">Крупный</option>
            </select>
          </div>
          <div class="setting-item">
            <div class="setting-info">
              <span class="setting-name">Зелёный акцент</span>
              <span class="setting-desc">Акцентный цвет для выделений</span>
            </div>
            <label class="toggle">
              <input type="checkbox" v-model="settings.greenAccent">
              <span class="toggle-slider"></span>
            </label>
          </div>
        </div>
      </div>

      <div class="settings-card">
        <h2 class="card-title">Избранное</h2>
        <div class="settings-list">
          <div class="setting-item">
            <div class="setting-info">
              <span class="setting-name">Любимые команды</span>
              <span class="setting-desc">Следить за избранными командами</span>
            </div>
            <button class="text-btn" @click="openFavoritesModal('teams')">
              Настроить ({{ selectedTeams.length }})
            </button>
          </div>
          <div class="setting-item">
            <div class="setting-info">
              <span class="setting-name">Избранные виды спорта</span>
              <span class="setting-desc">Приоритет в ленте</span>
            </div>
            <button class="text-btn" @click="openFavoritesModal('sports')">
              Настроить ({{ selectedSports.length }})
            </button>
          </div>
          <div class="setting-item">
            <div class="setting-info">
              <span class="setting-name">Букмекеры</span>
              <span class="setting-desc">Отслеживаемые букмекеры</span>
            </div>
            <button class="text-btn" @click="openFavoritesModal('bookmakers')">
              Настроить ({{ selectedBookmakers.length }})
            </button>
          </div>
        </div>
      </div>

      <div class="settings-card">
        <h2 class="card-title">Конфиденциальность</h2>
        <div class="settings-list">
          <div class="setting-item">
            <div class="setting-info">
              <span class="setting-name">Публичный профиль</span>
              <span class="setting-desc">Другие видят вашу активность</span>
            </div>
            <label class="toggle">
              <input type="checkbox" v-model="settings.publicProfile">
              <span class="toggle-slider"></span>
            </label>
          </div>
          <div class="setting-item">
            <div class="setting-info">
              <span class="setting-name">Аналитика использования</span>
              <span class="setting-desc">Помогите улучшить сервис</span>
            </div>
            <label class="toggle">
              <input type="checkbox" v-model="settings.analytics">
              <span class="toggle-slider"></span>
            </label>
          </div>
        </div>
      </div>

      <div class="settings-card">
        <h2 class="card-title">Язык и регион</h2>
        <div class="settings-list">
          <div class="setting-item">
            <div class="setting-info">
              <span class="setting-name">Язык интерфейса</span>
              <span class="setting-desc">Русский</span>
            </div>
            <select v-model="settings.language" class="theme-select">
              <option value="ru">Русский</option>
              <option value="en">English</option>
              <option value="de">Deutsch</option>
            </select>
          </div>
          <div class="setting-item">
            <div class="setting-info">
              <span class="setting-name">Часовой пояс</span>
              <span class="setting-desc">Москва (UTC+3)</span>
            </div>
            <select v-model="settings.timezone" class="theme-select">
              <option value="+3">Москва (UTC+3)</option>
              <option value="+0">Лондон (UTC+0)</option>
              <option value="-5">Нью-Йорк (UTC-5)</option>
            </select>
          </div>
          <div class="setting-item">
            <div class="setting-info">
              <span class="setting-name">Формат коэффициентов</span>
              <span class="setting-desc">Как отображать кэфы</span>
            </div>
            <select v-model="settings.oddsFormat" class="theme-select">
              <option value="decimal">Десятичный (2.15)</option>
              <option value="fractional">Дробный (23/20)</option>
              <option value="american">Американский (+115)</option>
            </select>
          </div>
        </div>
      </div>

      <div class="settings-card danger-zone">
        <h2 class="card-title">Опасная зона</h2>
        <div class="settings-list">
          <div class="setting-item">
            <div class="setting-info">
              <span class="setting-name">Экспорт данных</span>
              <span class="setting-desc">Скачать все ваши данные</span>
            </div>
            <button class="text-btn">Экспортировать</button>
          </div>
          <div class="setting-item">
            <div class="setting-info">
              <span class="setting-name danger-text">Удалить аккаунт</span>
              <span class="setting-desc">Это действие необратимо</span>
            </div>
            <button class="danger-btn">Удалить</button>
          </div>
        </div>
      </div>
    </div>

    <FavoritesModal 
      v-if="showFavoritesModal"
      :type="favoritesModalType"
      v-model="favoritesModalValue"
      @close="showFavoritesModal = false"
    />

    <SessionsModal 
      v-if="showSessionsModal"
      @close="showSessionsModal = false"
    />

    <PlanModal 
      v-if="showPlanModal"
      v-model="currentPlan"
      @close="showPlanModal = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import FavoritesModal from '../components/Modal/FavoritesModal.vue'
import PlanModal from '../components/Modal/PlanModal.vue'
import SessionsModal from '../components/Modal/SessionsModal.vue'

const currentPlan = ref('Unlimited')

const planNames: Record<string, string> = {
  Basic: 'Базовый',
  NoAds: 'Без рекламы',
  Unlimited: 'Безлимитный'
}

const settings = reactive({
  emailNotifications: true,
  pushNotifications: true,
  telegramNotifications: false,
  oddsChangeAlert: true,
  twoFactorAuth: false,
  theme: 'dark',
  fontSize: 'medium',
  greenAccent: true,
  publicProfile: false,
  analytics: true,
  language: 'ru',
  timezone: '+3',
  oddsFormat: 'decimal'
})

const selectedTeams = ref<number[]>([1, 3, 5])
const selectedSports = ref<number[]>([1, 2, 3])
const selectedBookmakers = ref<number[]>([1, 2, 3, 4, 5, 6, 7, 8])

const showPlanModal = ref(false)
const showSessionsModal = ref(false)

const showFavoritesModal = ref(false)
const favoritesModalType = ref<'teams' | 'sports' | 'bookmakers'>('teams')
const favoritesModalValue = computed({
  get: () => {
    if (favoritesModalType.value === 'teams') return selectedTeams.value
    if (favoritesModalType.value === 'sports') return selectedSports.value
    return selectedBookmakers.value
  },
  set: (val: number[]) => {
    if (favoritesModalType.value === 'teams') selectedTeams.value = val
    else if (favoritesModalType.value === 'sports') selectedSports.value = val
    else selectedBookmakers.value = val
  }
})

const openFavoritesModal = (type: 'teams' | 'sports' | 'bookmakers') => {
  favoritesModalType.value = type
  showFavoritesModal.value = true
}
</script>

<style scoped>
.profile-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
}

.profile-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--card-back-color);
  border: var(--main-border);
  border-radius: 12px;
  padding: 1.5rem 2rem;
  margin-bottom: 2rem;
}

.avatar-section {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--accent-font-color), var(--elem-hover-font-color));
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--card-back-color);
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.user-name {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--main-font-color);
}

.user-email {
  font-size: 0.85rem;
  color: var(--secondary-font-color);
}

.plan-badge {
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
}

.plan-badge.basic {
  background: var(--elem-back-color);
  color: var(--secondary-font-color);
  border: var(--main-border);
}

.plan-badge.noads {
  background: rgba(100, 181, 246, 0.15);
  color: #64b5f6;
  border: 1px solid rgba(100, 181, 246, 0.3);
}

.plan-badge.unlimited {
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.15), rgba(255, 193, 7, 0.15));
  color: #ffd700;
  border: 1px solid rgba(255, 215, 0, 0.3);
}

.settings-grid {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.settings-card {
  background: var(--card-back-color);
  border: var(--main-border);
  border-radius: 12px;
  padding: 1.5rem;
}

.settings-card.danger-zone {
  border-color: rgba(255, 59, 48, 0.3);
}

.card-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--main-font-color);
  margin-bottom: 1.25rem;
  padding-bottom: 0.75rem;
  border-bottom: var(--main-border);
}

.plan-info {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.plan-details {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.plan-current {
  display: flex;
  gap: 8px;
  align-items: center;
}

.plan-label {
  font-size: 0.85rem;
  color: var(--secondary-font-color);
}

.plan-value {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--accent-font-color);
}

.plan-features {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.plan-features li {
  font-size: 0.85rem;
  color: var(--secondary-font-color);
  padding-left: 16px;
  position: relative;
}

.plan-features li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: var(--accent-font-color);
}

.plan-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.renew-date {
  font-size: 0.8rem;
  color: var(--secondary-font-color);
}

.upgrade-btn,
.secondary-btn {
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}

.upgrade-btn {
  background: linear-gradient(135deg, #ffd700, #ffb700);
  color: #000;
}

.upgrade-btn:hover {
  box-shadow: 0 4px 15px rgba(255, 215, 0, 0.3);
  transform: translateY(-1px);
}

.secondary-btn {
  background: var(--elem-back-color);
  color: var(--main-font-color);
  border: var(--main-border);
}

.secondary-btn:hover {
  background: var(--elem-back-hover-color);
}

.settings-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
}

.setting-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.setting-name {
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--main-font-color);
}

.setting-name.danger-text {
  color: #ff3b30;
}

.setting-desc {
  font-size: 0.8rem;
  color: var(--secondary-font-color);
}

.toggle {
  position: relative;
  width: 48px;
  height: 26px;
  cursor: pointer;
}

.toggle input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  inset: 0;
  background: var(--elem-back-color);
  border: var(--main-border);
  border-radius: 26px;
  transition: all 0.3s ease;
}

.toggle-slider::before {
  content: '';
  position: absolute;
  width: 20px;
  height: 20px;
  left: 3px;
  bottom: 2px;
  background: var(--secondary-font-color);
  border-radius: 50%;
  transition: all 0.3s ease;
}

.toggle input:checked + .toggle-slider {
  background: rgba(0, 255, 36, 0.2);
  border-color: var(--accent-font-color);
}

.toggle input:checked + .toggle-slider::before {
  transform: translateX(22px);
  background: var(--accent-font-color);
}

.text-btn {
  background: none;
  border: none;
  color: var(--accent-font-color);
  font-size: 0.85rem;
  cursor: pointer;
  padding: 6px 12px;
  border-radius: 6px;
  transition: background 0.2s ease;
}

.text-btn:hover {
  background: rgba(0, 255, 36, 0.1);
}

.theme-select {
  background: var(--elem-back-color);
  border: var(--main-border);
  border-radius: 6px;
  padding: 8px 12px;
  font-size: 0.85rem;
  color: var(--main-font-color);
  cursor: pointer;
  min-width: 150px;
}

.theme-select:focus {
  outline: none;
  border-color: var(--accent-font-color);
}

.danger-btn {
  background: rgba(255, 59, 48, 0.1);
  border: 1px solid rgba(255, 59, 48, 0.3);
  color: #ff3b30;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.danger-btn:hover {
  background: #ff3b30;
  color: #fff;
}

@media (max-width: 768px) {
  .profile-page {
    padding: 1rem;
  }

  .profile-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .avatar-section {
    flex-direction: column;
  }

  .setting-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .theme-select {
    width: 100%;
  }
}
</style>
