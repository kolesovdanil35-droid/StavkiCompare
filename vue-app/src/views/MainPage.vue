<script setup lang="ts">
import { ref, onMounted } from 'vue'
import EventPlace from '../components/EventPlace/EventPlace.vue'
import axios from 'axios'

const liveMatches = ref([])
const upcomingMatches = ref([])
const savedMatches = ref([])

const API_BASE = import.meta.env.VITE_API_BASE || ''

onMounted(async () => {
  try {
    const [liveRes, upcomingRes] = await Promise.all([
      axios.get(`${API_BASE}/api/matches?status=live`),
      axios.get(`${API_BASE}/api/matches?status=upcoming`)
    ])
    
    liveMatches.value = liveRes.data
    upcomingMatches.value = upcomingRes.data
    
    // Create saved matches: first from live, first from upcoming
    if (liveMatches.value.length > 0) {
      savedMatches.value.push(liveMatches.value[0])
    }
    if (upcomingMatches.value.length > 0) {
      savedMatches.value.push(upcomingMatches.value[0])
    }
    // Add one more from either if available
    if (liveMatches.value.length > 1) {
      savedMatches.value.push(liveMatches.value[1])
    } else if (upcomingMatches.value.length > 1) {
      savedMatches.value.push(upcomingMatches.value[1])
    }
  } catch (error) {
    console.error('Error fetching matches:', error)
    // Fallback to empty arrays
    liveMatches.value = []
    upcomingMatches.value = []
    savedMatches.value = []
  }
})
</script>

<template>
  <div class="main-page">
    <EventPlace innerMathes="Live" :dataSourse="liveMatches"/>
    <EventPlace innerMathes="Incoming" :dataSourse="upcomingMatches"/>
    <div class="saved-matches-section">
      <h2 class="section-title">Мои сохраненные матчи</h2>
      <EventPlace innerMathes="Сохраненные" :dataSourse="savedMatches"/>
    </div>
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
</style>
