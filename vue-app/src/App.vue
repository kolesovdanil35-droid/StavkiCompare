<template>
  <div class="app">
    <herosection></herosection>
    <Header></Header>
    
    <main class="main">
      <router-view v-slot="{ Component }">
        <transition name="page" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <footer class="footer">
      <div class="footer-content">
        <div class="footer-section">
          <h3 class="footer-title">СтавкиCompare</h3>
          <p class="footer-text">Сравнение коэффициентов букмекерских контор в режиме реального времени</p>
        </div>
        <div class="footer-section">
          <h4 class="footer-heading">Навигация</h4>
          <nav class="footer-nav">
            <router-link to="/">Главная</router-link>
            <router-link to="/news">Новости</router-link>
            <router-link to="/analis">Анализатор</router-link>
          </nav>
        </div>
        <div class="footer-section">
          <h4 class="footer-heading">Информация</h4>
          <nav class="footer-nav">
            <a href="#">О проекте</a>
            <a href="#">Контакты</a>
            <a href="#">Политика конфиденциальности</a>
          </nav>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; 2026 СтавкиCompare. Все права защищены.</p>
      </div>
    </footer>

    <PodcastPlayer />
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import Header from './components/Header/header.vue'
import Herosection from './components/Header/Herosection.vue';
import PodcastPlayer from './components/Player/PodcastPlayer.vue';
import { useHead } from '@vueuse/head';

useHead({
  title: 'BetAggregator: Лучшие коэффициенты на спорт в режиме онлайн',
  meta: [
    { name: 'description', content: 'Сравнение коэффициентов букмекерских контор в реальном времени. Лучшие ставки на спорт, аналитика и прогнозы.' },
    { name: 'keywords', content: 'ставки на спорт, коэффициенты, букмекеры, сравнение коэффициентов, прогнозы, аналитика' },
  ],
})
</script>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main {
  flex: 1;
  padding-bottom: 60px;
}
.header{
  position: sticky;
  top:0;
  z-index: 1000;
}

.footer {
  background: var(--card-back-color);
  border-top: var(--main-border);
  margin-top: 4rem;
  padding: 3rem 2rem 1.5rem;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 2rem;
}

.footer-title {
  color: var(--accent-font-color);
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
}

.footer-text {
  color: var(--secondary-font-color);
  font-size: 0.9rem;
  line-height: 1.5;
  max-width: 300px;
}

.footer-heading {
  color: var(--main-font-color);
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.footer-nav {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.footer-nav a {
  color: var(--secondary-font-color);
  font-size: 0.9rem;
  transition: color 0.2s ease;
}

.footer-nav a:hover,
.footer-nav a.router-link-active {
  color: var(--accent-font-color);
}

.footer-bottom {
  max-width: 1200px;
  margin: 2rem auto 0;
  padding-top: 1.5rem;
  border-top: var(--main-border);
  text-align: center;
}

.footer-bottom p {
  color: var(--secondary-font-color);
  font-size: 0.85rem;
}

/* Page transitions */
.page-enter-active,
.page-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.page-enter-from {
  opacity: 0;
  transform: translateY(12px);
}
.page-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}

@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .footer {
    padding: 2rem 1rem 1rem;
  }
}
</style>
