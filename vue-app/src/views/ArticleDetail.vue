<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const router = useRouter()
const API_BASE = import.meta.env.VITE_API_BASE || ''

const article = ref<any>(null)
const isLoading = ref(true)

onMounted(async () => {
  try {
    const res = await axios.get(`${API_BASE}/api/articles/${route.params.id}`)
    article.value = res.data
  } catch (err) {
    console.error('Error fetching article:', err)
  } finally {
    isLoading.value = false
  }
})

const formatDate = (dateString: string): string => {
  const d = new Date(dateString)
  return d.toLocaleDateString('ru-RU', {
    day: 'numeric', month: 'long', year: 'numeric'
  })
}

const renderContent = (text: string): string => {
  return text
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean)
    .map(line => {
      if (line.startsWith('## ')) return `<h2>${line.slice(3)}</h2>`
      if (line.startsWith('- ')) return `<li>${line.slice(2)}</li>`
      return `<p>${line}</p>`
    })
    .join('')
}
</script>

<template>
  <div class="article-detail">
    <button class="back-btn" @click="router.push('/news')">← Назад к статьям</button>

    <div v-if="isLoading" class="loading-state">Загрузка статьи...</div>

    <template v-else-if="article">
      <div class="article-header">
        <span class="article-category">{{ article.category }}</span>
        <h1 class="article-title">{{ article.title }}</h1>
        <div class="article-meta">
          <span class="author">{{ article.author_avatar }} {{ article.author_name }}</span>
          <span class="separator">|</span>
          <span class="role">{{ article.author_role }}</span>
          <span class="separator">|</span>
          <span class="date">{{ formatDate(article.published_at) }}</span>
        </div>
      </div>

      <div class="article-content" v-html="renderContent(article.content)"></div>
    </template>

    <div v-else class="loading-state">Статья не найдена</div>
  </div>
</template>

<style scoped>
.article-detail {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.back-btn {
  margin-bottom: 2rem;
  background: transparent;
  border: none;
  color: var(--accent-font-color);
  font-size: 1rem;
  cursor: pointer;
  padding: 0;
}

.back-btn:hover {
  text-decoration: underline;
}

.loading-state {
  text-align: center;
  padding: 4rem;
  color: var(--secondary-font-color);
}

.article-header {
  margin-bottom: 2.5rem;
}

.article-category {
  display: inline-block;
  background: var(--elem-back-color);
  color: var(--accent-font-color);
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.article-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--main-font-color);
  line-height: 1.3;
  margin-bottom: 1rem;
}

.article-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--secondary-font-color);
  font-size: 0.9rem;
  flex-wrap: wrap;
}

.separator {
  color: var(--accent-font-color);
}

.article-content {
  line-height: 1.8;
  color: var(--main-font-color);
}

.article-content :deep(h2) {
  font-size: 1.4rem;
  font-weight: 600;
  color: var(--accent-font-color);
  margin: 2rem 0 1rem;
}

.article-content :deep(p) {
  margin-bottom: 1rem;
  color: var(--secondary-font-color);
}

.article-content :deep(li) {
  margin-bottom: 0.5rem;
  color: var(--secondary-font-color);
  margin-left: 1.5rem;
}

@media (max-width: 768px) {
  .article-title {
    font-size: 1.5rem;
  }
}
</style>
