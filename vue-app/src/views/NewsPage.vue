
<template>
  <div class="news-page">
    <div class="header">
      <h1>Аналитика и Новости</h1>
      <p>Экспертные обзоры, прогнозы и аналитика спортивных событий</p>
    </div>

    <div class="content-grid">
      <!-- Основные статьи -->
      <div class="articles-section">
        <h2 class="section-title">📊 Последние аналитические статьи</h2>
        
        <div class="articles-list">
          <article class="article-card" v-for="article in articles" :key="article.id">
            <div class="article-header">
              <span class="article-category" :style="{ backgroundColor: getCategoryColor(article.category) }">
                {{ article.category }}
              </span>
              <span class="article-date">{{ formatDate(article.date) }}</span>
            </div>
            <h3 class="article-title">{{ article.title }}</h3>
            <p class="article-excerpt">{{ article.excerpt }}</p>
            <div class="article-footer">
              <div class="author">
                <img :src="article.author.avatar" class="author-avatar" />
                <span class="author-name">{{ article.author.name }}</span>
                <span class="author-role">{{ article.author.role }}</span>
              </div>
              <button class="read-more-btn" @click="openArticle(article.id)">
                Читать далее
                <span class="arrow">→</span>
              </button>
            </div>
          </article>
        </div>

        <!-- Вступление -->
        <div class="intro-section">
          <h3>Добро пожаловать в наш аналитический раздел!</h3>
          <p>
            Здесь вы найдете эксклюзивные материалы от наших экспертов, глубокий анализ команд и игроков, 
            статистические выкладки и прогнозы на предстоящие события. Мы помогаем принимать взвешенные 
            решения на основе данных, а не интуиции.
          </p>
          <p>
            Наши аналитики ежедневно отслеживают десятки спортивных лиг и турниров, чтобы предоставить 
            вам самую актуальную информацию. От футбола до киберспорта — мы охватываем все популярные 
            дисциплины.
          </p>
          <button class="cta-btn" @click="showMoreArticles">
            Показать больше статей
            <span class="loader" v-if="loading">...</span>
          </button>
        </div>
      </div>

      <!-- Боковая панель с подкастом -->
      <aside class="sidebar">
        <div class="podcast-card">
          <div class="podcast-header">
            <h3>🎙️ Подкаст "Ставки на Спорт"</h3>
            <span class="podcast-badge">НОВЫЙ</span>
          </div>
          
          <div class="podcast-info">
            <div class="podcast-cover">
              <div class="play-icon">▶</div>
            </div>
            <div class="podcast-details">
              <h4>Эпизод #24: Анализ Чемпионата Европы по футболу</h4>
              <p class="podcast-description">
                Глубокий разбор тактики ведущих сборных, анализ формы игроков и прогнозы на матчи группового этапа.
              </p>
              <div class="podcast-meta">
                <span class="duration">⏱️ 48 мин</span>
                <span class="date">📅 15 янв 2024</span>
              </div>
            </div>
          </div>

          <div class="podcast-episodes">
            <h5>Последние эпизоды:</h5>
            <div class="episode" v-for="episode in episodes" :key="episode.id">
              <div class="episode-info">
                <span class="episode-title">{{ episode.title }}</span>
                <span class="episode-date">{{ episode.date }}</span>
              </div>
              <button class="play-btn">▶</button>
            </div>
          </div>

          <div class="subscribe-section">
            <p>Подпишитесь на подкаст:</p>
            <div class="subscribe-buttons">
              <button class="platform-btn spotify">Spotify</button>
              <button class="platform-btn apple">Apple Podcasts</button>
              <button class="platform-btn youtube">YouTube</button>
            </div>
          </div>
        </div>

        <!-- Эксперты недели -->
        <div class="experts-card">
          <h3>👑 Эксперты недели</h3>
          <div class="experts-list">
            <div class="expert" v-for="expert in topExperts" :key="expert.id">
              <img :src="expert.avatar" class="expert-avatar" />
              <div class="expert-info">
                <span class="expert-name">{{ expert.name }}</span>
                <span class="expert-stats">Точность: {{ expert.accuracy }}%</span>
              </div>
              <div class="expert-profit" :class="{ positive: expert.profit > 0 }">
                {{ expert.profit > 0 ? '+' : '' }}{{ expert.profit }}%
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Article {
  id: number
  title: string
  excerpt: string
  category: string
  date: string
  author: {
    name: string
    role: string
    avatar: string
  }
}

interface PodcastEpisode {
  id: number
  title: string
  date: string
}

interface Expert {
  id: number
  name: string
  accuracy: number
  profit: number
  avatar: string
}

const articles = ref<Article[]>([
  {
    id: 1,
    title: 'Тактический разбор: почему Барселона проигрывает в гостях',
    excerpt: 'Анализ последних матчей каталонского клуба, проблемы в обороне и статистика выездных игр в этом сезоне.',
    category: 'Футбол',
    date: '2024-01-15',
    author: {
      name: 'Алексей Петров',
      role: 'Главный аналитик',
      avatar: '👨‍💼'
    }
  },
  {
    id: 2,
    title: 'NBA: Статистические аномалии января 2024',
    excerpt: 'Неожиданные результаты, переоцененные фавориты и темные лошадки второй половины сезона.',
    category: 'Баскетбол',
    date: '2024-01-14',
    author: {
      name: 'Мария Иванова',
      role: 'Спортивный аналитик',
      avatar: '👩‍💼'
    }
  },
  {
    id: 3,
    title: 'Киберспорт: мета-анализ CS2 после последнего обновления',
    excerpt: 'Как изменилась статистика команд, новые тактики и влияние патча на профессиональную сцену.',
    category: 'Киберспорт',
    date: '2024-01-13',
    author: {
      name: 'Дмитрий Смирнов',
      role: 'Эксперт по киберспорту',
      avatar: '🎮'
    }
  }
])

const episodes = ref<PodcastEpisode[]>([
  { id: 1, title: 'Зимние трансферы в футболе', date: '12 янв' },
  { id: 2, title: 'Анализ Australian Open', date: '10 янв' },
  { id: 3, title: 'Новости NBA All-Star', date: '8 янв' }
])

const topExperts = ref<Expert[]>([
  { id: 1, name: 'Иван Ковалев', accuracy: 87, profit: 24.5, avatar: '👨‍🎓' },
  { id: 2, name: 'Елена Соколова', accuracy: 82, profit: 18.3, avatar: '👩‍🎓' },
  { id: 3, name: 'Сергей Новиков', accuracy: 79, profit: 15.7, avatar: '🧑‍💻' }
])

const loading = ref(false)

const formatDate = (dateString: string): string => {
  const options: Intl.DateTimeFormatOptions = { 
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }
  return new Date(dateString).toLocaleDateString('ru-RU', options)
}

const getCategoryColor = (category: string): string => {
  const colors: Record<string, string> = {
    'Футбол': '#3B82F6',
    'Баскетбол': '#10B981',
    'Киберспорт': '#8B5CF6',
    'Теннис': '#EF4444',
    'Хоккей': '#F59E0B'
  }
  return colors[category] || '#6B7280'
}

const openArticle = (id: number) => {
  console.log('Opening article:', id)
  alert(`Статья #${id} откроется в будущем`)
}

const showMoreArticles = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
    alert('Функционал загрузки большего количества статей будет реализован позже')
  }, 1000)
}
</script>

<style scoped>
.news-page {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1rem;
}

.header {
  text-align: center;
  padding: 3rem 1rem;
  margin-bottom: 2rem;
}

.header h1 {
  font-size: 2.5rem;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 0.5rem;
}

.header p {
  color: #6B7280;
  font-size: 1.1rem;
}

.content-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
}

@media (max-width: 1024px) {
  .content-grid {
    grid-template-columns: 1fr;
  }
}

.section-title {
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: #1F2937;
}

.articles-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.article-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s, box-shadow 0.2s;
  border: 1px solid #E5E7EB;
}

.article-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.article-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.article-category {
  color: white;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
}

.article-date {
  color: #6B7280;
  font-size: 0.9rem;
}

.article-title {
  font-size: 1.2rem;
  margin-bottom: 0.75rem;
  color: #1F2937;
  line-height: 1.4;
}

.article-excerpt {
  color: #4B5563;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.article-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.author {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.author-avatar {
  font-size: 1.5rem;
}

.author-name {
  font-weight: 500;
  color: #374151;
}

.author-role {
  font-size: 0.8rem;
  color: #6B7280;
  background: #F3F4F6;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
}

.read-more-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: transparent;
  border: 2px solid #667eea;
  color: #667eea;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.read-more-btn:hover {
  background: #667eea;
  color: white;
}

.arrow {
  font-size: 1.2rem;
}

.intro-section {
  background: linear-gradient(135deg, #F3F4F6, #E5E7EB);
  border-radius: 12px;
  padding: 2rem;
  margin-top: 2rem;
}

.intro-section h3 {
  color: #1F2937;
  margin-bottom: 1rem;
}

.intro-section p {
  color: #4B5563;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.cta-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1.5rem;
  background: linear-gradient(135deg, #10B981, #059669);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: transform 0.2s;
}

.cta-btn:hover {
  transform: scale(1.05);
}

.loader {
  animation: blink 1.5s infinite;
}

.sidebar {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.podcast-card, .experts-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  border: 1px solid #E5E7EB;
}

.podcast-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.podcast-header h3 {
  color: #1F2937;
}

.podcast-badge {
  background: #EF4444;
  color: white;
  padding: 0.2rem 0.6rem;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 600;
}

.podcast-info {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.podcast-cover {
  flex-shrink: 0;
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 2rem;
}

.play-icon {
  cursor: pointer;
}

.podcast-details {
  flex: 1;
}

.podcast-details h4 {
  color: #1F2937;
  margin-bottom: 0.5rem;
  font-size: 1rem;
}

.podcast-description {
  color: #6B7280;
  font-size: 0.9rem;
  line-height: 1.4;
  margin-bottom: 0.75rem;
}

.podcast-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.8rem;
  color: #9CA3AF;
}

.podcast-episodes {
  margin-bottom: 1.5rem;
}

.podcast-episodes h5 {
  color: #4B5563;
  margin-bottom: 1rem;
}

.episode {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid #F3F4F6;
}

.episode:last-child {
  border-bottom: none;
}

.episode-info {
  display: flex;
  flex-direction: column;
}

.episode-title {
  font-size: 0.9rem;
  color: #374151;
}

.episode-date {
  font-size: 0.8rem;
  color: #9CA3AF;
}

.play-btn {
  background: #F3F4F6;
  border: none;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #667eea;
  font-size: 0.8rem;
}

.subscribe-section p {
  color: #4B5563;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.subscribe-buttons {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.platform-btn {
  padding: 0.5rem;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: opacity 0.2s;
}

.platform-btn:hover {
  opacity: 0.9;
}

.platform-btn.spotify {
  background: #1DB954;
  color: white;
}

.platform-btn.apple {
  background: #000;
  color: white;
}

.platform-btn.youtube {
  background: #FF0000;
  color: white;
}

.experts-card h3 {
  color: #1F2937;
  margin-bottom: 1.5rem;
}

.experts-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.expert {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  background: #F9FAFB;
  border-radius: 8px;
}

.expert-avatar {
  font-size: 1.5rem;
}

.expert-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.expert-name {
  font-weight: 500;
  color: #374151;
}

.expert-stats {
  font-size: 0.8rem;
  color: #6B7280;
}

.expert-profit {
  font-weight: 600;
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
  background: #10B981;
  color: white;
}

.expert-profit.positive {
  background: #10B981;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

@media (max-width: 768px) {
  .header h1 {
    font-size: 2rem;
  }
  
  .article-footer {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .author {
    flex-wrap: wrap;
  }
}
</style>
