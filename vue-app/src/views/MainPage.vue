<script setup lang="ts">
import { ref, onMounted } from 'vue'
import EventPlace from '../components/EventPlace/EventPlace.vue'
import SkeletonCard from '../components/UI/SkeletonCard.vue'
import axios from 'axios'
import { savedMatchesStore } from '../stores/savedMatches'

const liveMatches = ref([])
const upcomingMatches = ref([])
const isLoading = ref(true)

const API_BASE = import.meta.env.VITE_API_BASE || ''

onMounted(async () => {
  try {
    const [liveRes, upcomingRes] = await Promise.all([
      axios.get(`${API_BASE}/api/matches?status=live`),
      axios.get(`${API_BASE}/api/matches?status=upcoming`)
    ])
    
    liveMatches.value = liveRes.data
    upcomingMatches.value = upcomingRes.data

    savedMatchesStore.fetch()
  } catch (error) {
    console.error('Error fetching matches:', error)
    liveMatches.value = []
    upcomingMatches.value = []
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div class="main-page">
    <div class="skeleton-section" v-if="isLoading">
      <div class="skeleton-header"></div>
      <div class="skeleton-grid">
        <SkeletonCard v-for="i in 4" :key="i" />
      </div>
      <div class="skeleton-header" style="margin-top: 24px;"></div>
      <div class="skeleton-grid">
        <SkeletonCard v-for="i in 3" :key="'u'+i" />
      </div>
    </div>
    <template v-else>
      <EventPlace innerMathes="Live" :dataSourse="liveMatches"/>
      <EventPlace innerMathes="Incoming" :dataSourse="upcomingMatches"/>
      <div v-if="savedMatchesStore.state.matches.length" class="saved-matches-section">
        <h2 class="section-title">Мои сохраненные матчи</h2>
        <EventPlace innerMathes="Сохраненные" :dataSourse="savedMatchesStore.state.matches"/>
      </div>
    </template>
  </div>
</template>

<style scoped>
.main-page {
  padding: 20px;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--accent-font-color);
  margin: 2rem 0 1rem 0;
  text-align: center;
}

.saved-matches-section {
  background: var(--card-back-color);
  border: var(--main-border);
  border-radius: 12px;
  padding: 1.5rem;
  margin-top: 2rem;
}

/* Skeleton styles */
.skeleton-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.skeleton-header {
  width: 200px;
  height: 32px;
  background: linear-gradient(90deg, var(--elem-back-color) 25%, var(--elem-back-hover-color) 50%, var(--elem-back-color) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
  border-radius: 8px;
  margin-bottom: 8px;
}

.skeleton-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 12px;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
</style>
