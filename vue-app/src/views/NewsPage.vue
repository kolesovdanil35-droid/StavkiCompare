<template>
  <div class="news-page">

    <div class="content-grid">
      <div class="articles-section">
        <h2 class="section-title">Последние аналитические статьи</h2>
        <div v-if="isLoading" class="skeleton-list">
          <div class="skeleton-article" v-for="i in 3" :key="i">
            <div class="skeleton-block" style="width:80px;height:20px"></div>
            <div class="skeleton-block" style="width:100%;height:24px;margin-top:12px"></div>
            <div class="skeleton-block" style="width:80%;height:16px;margin-top:8px"></div>
            <div class="skeleton-block" style="width:60%;height:16px;margin-top:6px"></div>
          </div>
        </div>
        <div v-else class="articles-list">
          <article class="article-card" v-for="article in articles" :key="article.id">
            <div class="article-header">
              <span class="article-category" :style="{ backgroundColor: getCategoryColor(article.category) }">
                {{ article.category }}
              </span>
              <span class="article-date">{{ formatDate(article.published_at) }}</span>
            </div>
            <h3 class="article-title">{{ article.title }}</h3>
            <p class="article-excerpt">{{ article.excerpt }}</p>
            <div class="article-footer">
              <div class="author">
                <span class="author-name">{{ article.author_name }}</span>
                <span class="author-role">{{ article.author_role }}</span>
              </div>
              <button class="read-more-btn" @click="openArticle(article.id)">
                Читать далее
                <span class="arrow">→</span>
              </button>
            </div>
          </article>
        </div>
      </div>

      <!-- Боковая панель с подкастом -->
      <aside class="sidebar">
        <h2 class="section-title">Подкасты</h2>
        <div class="article-card">

          <div class="podcast-episodes">
            
            <div class="episode" v-for="episode in episodes" :key="episode.id">
              <div class="episode-info">
                <span class="episode-title">{{ episode.title }}</span>
                <span class="episode-date">{{ formatPodcastDate(episode.published_at) }}</span>
              </div>
              <button class="play-btn" @click="playEpisode(episode, episodes)"><span>▶</span></button>
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
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { usePodcastPlayer } from '../stores/podcastPlayer'

const router = useRouter()
const { playEpisode } = usePodcastPlayer()
const API_BASE = import.meta.env.VITE_API_BASE || ''

interface Article {
  id: number
  title: string
  excerpt: string
  category: string
  published_at: string
  author_name: string
  author_role: string
  author_avatar: string
}

interface PodcastEpisode {
  id: number
  title: string
  description: string
  duration_seconds: number
  episode_number: number
  published_at: string
}

const articles = ref<Article[]>([])
const episodes = ref<PodcastEpisode[]>([])
const isLoading = ref(true)

onMounted(async () => {
  try {
    const [articlesRes, podcastsRes] = await Promise.all([
      axios.get(`${API_BASE}/api/articles`),
      axios.get(`${API_BASE}/api/podcasts`)
    ])
    articles.value = articlesRes.data
    episodes.value = podcastsRes.data
  } catch (err) {
    console.error('Error fetching data:', err)
  } finally {
    isLoading.value = false
  }
})

const formatDate = (dateString: string): string => {
  const d = new Date(dateString)
  return d.toLocaleDateString('ru-RU', {
    day: 'numeric', month: 'short', year: 'numeric'
  })
}

const formatPodcastDate = (dateString: string): string => {
  const d = new Date(dateString)
  return d.toLocaleDateString('ru-RU', {
    day: 'numeric', month: 'short'
  })
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
  router.push(`/news/${id}`)
}
</script>

<style scoped>
.news-page {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1rem;
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
  
  padding-left: 15px;
  border-radius: 12px;
  color: #BECBFF;
}

.articles-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.article-card {
  background: rgb(20, 20, 20);
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid #ffffff2b;
  transition: transform 0.2s, box-shadow 0.2s;
}

.article-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 255, 36, 0.1);
}

.article-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.article-category {
  color: var(--main-font-color);
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
}

.article-date {
  color: #9CA3AF;
  font-size: 0.9rem;
}

.article-title {
  font-size: 1.2rem;
  margin-bottom: 0.75rem;
  color: #BECBFF;
  line-height: 1.4;
}

.article-excerpt {
  color: #D1D5DB;
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
  color: #BECBFF;
}

.author-role {
  font-size: 0.8rem;
  color: #9CA3AF;
  background: #202325;
  padding: 0.2rem 0.5rem;
  border-radius: 6px;
}

.read-more-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: transparent;
  border: 2px solid #00ff24;
  color: #00ff24;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.read-more-btn:hover {
  background: #00ff24;
  color: #1a1a1a;
}

.arrow {
  font-size: 1.2rem;
}

.intro-section {
  background: #202325;
  border-radius: 16px;
  padding: 2rem;
  margin-top: 2rem;
  border: 1px solid #ffffff2b;
}

.intro-section h3 {
  color: #BECBFF;
  margin-bottom: 1rem;
}

.intro-section p {
  color: #D1D5DB;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.cta-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1.5rem;
  background: #00ff24;
  color: #1a1a1a;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: transform 0.2s;
}

.cta-btn:hover {
  transform: scale(1.05);
  background: #00cc1d;
}

.loader {
  animation: blink 1.5s infinite;
}

.sidebar {
  display: flex;
  flex-direction: column;
}

.podcast-card, .experts-card {
  background: rgb(20, 20, 20);
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid #ffffff2b;
}

.podcast-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.podcast-header h3 {
  color: #BECBFF;
}

.podcast-badge {
  background: #00ff24;
  color: #1a1a1a;
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
  background: linear-gradient(135deg, #00ff24, #00cc1d);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1a1a1a;
  font-size: 2rem;
}

.play-icon {
  cursor: pointer;
}

.podcast-details {
  flex: 1;
}

.podcast-details h4 {
  color: #BECBFF;
  margin-bottom: 0.5rem;
  font-size: 1rem;
}

.podcast-description {
  color: #D1D5DB;
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
  color: #BECBFF;
  margin-bottom: 1rem;
}

.episode {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid #ffffff2b;
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
  color: #D1D5DB;
}

.episode-date {
  font-size: 0.8rem;
  color: #9CA3AF;
}

.play-btn {
  background: #202325;
  border: 1px solid #ffffff2b;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #00ff24;
  font-size: 0.8rem;
}

.play-btn:hover {
  background: #00ff24;
  color: #1a1a1a;
}

.subscribe-section p {
  color: #BECBFF;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.subscribe-buttons {
  display: flex;
  gap: 12px;
  flex-direction: row;
  flex-wrap: wrap;
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
  color: var(--main-font-color);
}

.platform-btn.apple {
  background: #000;
  color: var(--main-font-color);
}

.platform-btn.youtube {
  background: #FF0000;
  color: var(--main-font-color);
}

.experts-card h3 {
  color: #BECBFF;
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
  background: #202325;
  border-radius: 12px;
  border: 1px solid #ffffff2b;
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
  color: #BECBFF;
}

.expert-stats {
  font-size: 0.8rem;
  color: #9CA3AF;
}

.expert-profit {
  font-weight: 600;
  padding: 0.3rem 0.6rem;
  border-radius: 6px;
  background: #00ff24;
  color: #1a1a1a;
}

.expert-profit.positive {
  background: #00ff24;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

.skeleton-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.skeleton-article {
  background: var(--card-back-color);
  border-radius: 16px;
  padding: 1.5rem;
  border: var(--main-border);
}

.skeleton-block {
  background: linear-gradient(90deg, var(--elem-back-color) 25%, var(--elem-back-hover-color) 50%, var(--elem-back-color) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
  border-radius: 6px;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
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