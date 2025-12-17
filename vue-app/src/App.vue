
<script setup lang="ts">
import { RouterLink, RouterView, useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
  <div class="app">
    <header class="header">
      <div class="container">
        <div class="header-content">
          <div class="logo">
            <router-link to="/" class="logo-link">
              <span class="logo-icon">⚡</span>
              <span class="logo-text">СтавкиCompare</span>
              <span class="beta-badge">BETA</span>
            </router-link>
          </div>
          
          <nav class="main-nav">
            <router-link to="/" class="nav-link" :class="{ active: route.path === '/' }">
              <span class="nav-icon">🏠</span>
              Главная
              <span v-if="route.path === '/'" class="nav-indicator"></span>
            </router-link>
            <router-link to="/news" class="nav-link" :class="{ active: route.path === '/news' }">
              <span class="nav-icon">📰</span>
              Аналитика
              <span v-if="route.path === '/news'" class="nav-indicator"></span>
            </router-link>
          </nav>
          
         
        </div>
      </div>
    </header>

    <main class="main">
      <RouterView />
    </main>

    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-section">
            <div class="footer-logo">
              <span class="logo-icon">⚡</span>
              <span class="logo-text">BetAggregator</span>
            </div>
            <p class="footer-description">
              Агрегатор ставок с лучшими коэффициентами на спортивные события.
              Ставь с умом, выигрывай с нами!
            </p>
            <div class="social-links">
              <a href="#" class="social-link" title="Telegram">
                <span class="social-icon">📱</span>
              </a>
              <a href="#" class="social-link" title="Twitter">
                <span class="social-icon">🐦</span>
              </a>
              <a href="#" class="social-link" title="YouTube">
                <span class="social-icon">📺</span>
              </a>
              <a href="#" class="social-link" title="VK">
                <span class="social-icon">📘</span>
              </a>
            </div>
          </div>
          
          <div class="footer-section">
            <h4 class="footer-title">Навигация</h4>
            <router-link to="/" class="footer-link">
              <span class="link-icon">🏠</span>
              Главная
            </router-link>
            <router-link to="/news" class="footer-link">
              <span class="link-icon">📰</span>
              Аналитика
            </router-link>
            <a href="#" class="footer-link">
              <span class="link-icon">🎯</span>
              Прогнозы
            </a>
            <a href="#" class="footer-link">
              <span class="link-icon">📊</span>
              Статистика
            </a>
          </div>
          
          <div class="footer-section">
            <h4 class="footer-title">Спорты</h4>
            <a href="#" class="footer-link">
              <span class="link-icon">⚽</span>
              Футбол
            </a>
            <a href="#" class="footer-link">
              <span class="link-icon">🏀</span>
              Баскетбол
            </a>
            <a href="#" class="footer-link">
              <span class="link-icon">🎾</span>
              Теннис
            </a>
            <a href="#" class="footer-link">
              <span class="link-icon">🎮</span>
              Киберспорт
            </a>
          </div>
          
          <div class="footer-section">
            <h4 class="footer-title">Поддержка</h4>
            <a href="#" class="footer-link">
              <span class="link-icon">❓</span>
              Помощь
            </a>
            <a href="#" class="footer-link">
              <span class="link-icon">📖</span>
              FAQ
            </a>
            <a href="#" class="footer-link">
              <span class="link-icon">📞</span>
              Контакты
            </a>
            <a href="#" class="footer-link">
              <span class="link-icon">⚖️</span>
              Правила
            </a>
          </div>
        </div>
        
        <div class="footer-bottom">
          <div class="payment-methods">
            <span class="payment-icon">💳</span>
            <span class="payment-icon">📱</span>
            <span class="payment-icon">💰</span>
            <span class="payment-icon">🏦</span>
          </div>
          <div class="copyright">
            <p>© 2024 BetAggregator. Все права защищены.</p>
            <p class="warning">Ставки на спорт могут вызывать зависимость. Играйте ответственно. 18+</p>
          </div>
          <div class="footer-badges">
            <span class="badge">🔒 SSL</span>
            <span class="badge">📊 RNG</span>
            <span class="badge">✅ Лицензия</span>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Header styles */
.header {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  gap: 2rem;
}

.logo-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  font-weight: 700;
  font-size: 1.5rem;
  color: #1a1a1a;
}

.logo-icon {
  font-size: 2rem;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.beta-badge {
  background: linear-gradient(135deg, #f093fb, #f5576c);
  color: white;
  font-size: 0.6rem;
  padding: 0.2rem 0.5rem;
  border-radius: 12px;
  font-weight: 600;
  margin-left: 0.5rem;
}

.main-nav {
  display: flex;
  gap: 1rem;
  flex: 1;
  justify-content: center;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  text-decoration: none;
  color: #4a5568;
  font-weight: 500;
  border-radius: 10px;
  transition: all 0.3s;
  position: relative;
}

.nav-link:hover {
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
}

.nav-link.active {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.nav-indicator {
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 4px;
  height: 4px;
  background: white;
  border-radius: 50%;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.balance {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, #10b981, #059669);
  border-radius: 8px;
  color: white;
  font-weight: 600;
}

.balance-label {
  opacity: 0.9;
  font-size: 0.9rem;
}

.balance-amount {
  font-size: 1.1rem;
}

.user-actions {
  display: flex;
  gap: 0.75rem;
}

.btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 0.9rem;
}

.btn-outline {
  background: transparent;
  border: 2px solid #667eea;
  color: #667eea;
}

.btn-outline:hover {
  background: rgba(102, 126, 234, 0.1);
}

.btn-primary {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
}

.btn-icon {
  font-size: 1.1rem;
}

/* Main content */
.main {
  flex: 1;
  padding: 2rem 0;
}

/* Footer styles */
.footer {
  background: #1a202c;
  color: white;
  padding: 3rem 0 1.5rem;
  margin-top: auto;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 3rem;
  margin-bottom: 3rem;
}

.footer-section {
  display: flex;
  flex-direction: column;
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.footer-description {
  color: #a0aec0;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.social-links {
  display: flex;
  gap: 0.75rem;
}

.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  color: white;
  text-decoration: none;
  transition: all 0.3s;
}

.social-link:hover {
  background: #667eea;
  transform: translateY(-3px);
}

.footer-title {
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
  color: white;
  font-weight: 600;
}

.footer-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #a0aec0;
  text-decoration: none;
  padding: 0.5rem 0;
  transition: color 0.3s;
}

.footer-link:hover {
  color: #667eea;
}

.link-icon {
  opacity: 0.7;
}

.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  flex-wrap: wrap;
  gap: 1.5rem;
}

.payment-methods {
  display: flex;
  gap: 0.5rem;
}

.payment-icon {
  background: rgba(255, 255, 255, 0.1);
  padding: 0.5rem;
  border-radius: 6px;
  font-size: 1.2rem;
}

.copyright {
  text-align: center;
  color: #a0aec0;
  font-size: 0.9rem;
}

.warning {
  font-size: 0.8rem;
  color: #e53e3e;
  margin-top: 0.5rem;
}

.footer-badges {
  display: flex;
  gap: 0.5rem;
}

.badge {
  background: rgba(102, 126, 234, 0.2);
  color: #667eea;
  padding: 0.3rem 0.8rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
}

/* Responsive */
@media (max-width: 1024px) {
  .header-content {
    flex-direction: column;
    gap: 1rem;
  }
  
  .main-nav {
    order: 3;
    width: 100%;
    justify-content: center;
  }
  
  .header-right {
    order: 2;
  }
}

@media (max-width: 768px) {
  .main-nav {
    flex-direction: column;
    align-items: center;
  }
  
  .nav-link {
    width: 100%;
    justify-content: center;
  }
  
  .header-right {
    flex-direction: column;
    width: 100%;
  }
  
  .balance {
    width: 100%;
    justify-content: center;
  }
  
  .user-actions {
    width: 100%;
    justify-content: center;
  }
  
  .footer-bottom {
    flex-direction: column;
    text-align: center;
  }
}
</style>
