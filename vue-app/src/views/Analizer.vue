<template>
  <div class="analyzer-page">
    <div class="analyzer-header">
      <h1 class="page-title">Анализ матчей</h1>
      <p class="page-subtitle">Выберите матч для получения подробного анализа и прогноза</p>
    </div>

    <div class="analyzer-layout">
      <div class="matches-sidebar">
        <h2 class="sidebar-title">Предстоящие матчи</h2>
        <div class="matches-list">
          <button
            v-for="match in matches"
            :key="match.id"
            :class="['match-item', { active: selectedMatch?.id === match.id }]"
            @click="selectMatch(match.id)"
          >
            <div class="match-top">
              <span class="match-league">{{ match.league }}</span>
              <span :class="['match-time-badge', { live: isLive(match.time) }]">
                {{ isLive(match.time) ? 'LIVE' : match.time }}
              </span>
            </div>
            <div class="match-teams">
              <span class="team-name">{{ match.team1 }}</span>
              <span class="vs">VS</span>
              <span class="team-name">{{ match.team2 }}</span>
            </div>
          </button>
        </div>
      </div>

      <div class="analysis-content">
        <div v-if="!selectedMatch" class="placeholder">
          <div class="placeholder-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
            </svg>
          </div>
          <h3 class="placeholder-title">Выберите матч</h3>
          <p class="placeholder-text">Нажмите на матч в списке слева, чтобы получить подробный анализ и прогноз</p>
        </div>

        <div v-else class="analysis-result">

          <div class="analysis-match-header">
            <div style="display: flex;
             justify-content: space-between;">
              <div class="analysis-tournament">{{ selectedMatch.league }}</div>
              <div class="analysis-time">{{ selectedMatch.time }}</div>
            </div>
            <div class="analysis-teams">
              <span class="analysis-team">{{ selectedMatch.team1 }}</span>
              <span class="analysis-vs">VS</span>
              <span class="analysis-team">{{ selectedMatch.team2 }}</span>
            </div>
            
          </div>

          <div class="prediction-card">
            <div class="prediction-badge">Прогноз</div>
            <div class="prediction-main">
              <div class="prediction-winner">
                <span class="winner-label">Победит:</span>
                <span class="winner-name">{{ getWinnerName() }}</span>
              </div>
              <div class="prediction-score">Счёт: {{ selectedMatch.prediction.predictedScore }}</div>
              <div class="prediction-confidence">
                <div class="confidence-label">Уверенность</div>
                <div class="confidence-bar">
                  <div class="confidence-fill" :style="{ width: selectedMatch.prediction.confidence + '%' }"></div>
                </div>
                <div class="confidence-value">{{ selectedMatch.prediction.confidence }}%</div>
              </div>
            </div>
          </div>

          <div class="analysis-grid">
            <div class="analysis-card form-card">
              <h3 class="card-title">Форма команд</h3>
              <div class="form-comparison">
                <div class="form-team-block">
                  <span class="form-team-label">{{ selectedMatch.team1 }}</span>
                  <div class="form-badges">
                    <span v-for="(r, i) in selectedMatch.team1Form" :key="i" :class="['form-badge', r.toLowerCase()]">{{ r }}</span>
                  </div>
                </div>
                <div class="form-team-block">
                  <span class="form-team-label">{{ selectedMatch.team2 }}</span>
                  <div class="form-badges">
                    <span v-for="(r, i) in selectedMatch.team2Form" :key="i" :class="['form-badge', r.toLowerCase()]">{{ r }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="analysis-card stats-card">
              <h3 class="card-title">Сравнение статистики</h3>
              <div class="stats-comparison">
                <div class="stat-row">
                  <span class="stat-value stat-left">{{ selectedMatch.team1Stats.position }}</span>
                  <span class="stat-name">Позиция</span>
                  <span class="stat-value stat-right">{{ selectedMatch.team2Stats.position }}</span>
                </div>
                <div class="stat-row">
                  <span class="stat-value stat-left">{{ selectedMatch.team1Stats.goalsScored }}</span>
                  <span class="stat-name">Голы</span>
                  <span class="stat-value stat-right">{{ selectedMatch.team2Stats.goalsScored }}</span>
                </div>
                <div class="stat-row">
                  <span class="stat-value stat-left">{{ selectedMatch.team1Stats.goalsConceded }}</span>
                  <span class="stat-name">Пропущено</span>
                  <span class="stat-value stat-right">{{ selectedMatch.team2Stats.goalsConceded }}</span>
                </div>
                <div class="stat-row">
                  <span class="stat-value stat-left">{{ selectedMatch.team1Stats.wins }}</span>
                  <span class="stat-name">Победы</span>
                  <span class="stat-value stat-right">{{ selectedMatch.team2Stats.wins }}</span>
                </div>
              </div>
            </div>

            <div class="analysis-card h2h-card">
              <h3 class="card-title">Личные встречи</h3>
              <div class="h2h-display">
                <div class="h2h-record">
                  <div class="h2h-team">
                    <span>{{ selectedMatch.team1 }}</span>
                    <span class="h2h-wins">{{ selectedMatch.h2h.team1Wins }}</span>
                  </div>
                  <div class="h2h-draws">
                    <span class="draws-label">Ничьи</span>
                    <span class="draws-count">{{ selectedMatch.h2h.draws }}</span>
                  </div>
                  <div class="h2h-team">
                    <span>{{ selectedMatch.team2 }}</span>
                    <span class="h2h-wins">{{ selectedMatch.h2h.team2Wins }}</span>
                  </div>
                </div>
                <div class="h2h-last">
                  <span class="h2h-last-label">Последние:</span>
                  <div class="h2h-scores">
                    <span v-for="(score, i) in selectedMatch.h2h.lastMatches" :key="i" class="h2h-score">{{ score }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="analysis-card reasoning-card">
              <h3 class="card-title">Почему такой прогноз?</h3>
              <ul class="reasoning-list">
                <li v-for="(reason, i) in selectedMatch.prediction.reasoning" :key="i">
                  <span class="reasoning-number">{{ i + 1 }}</span>
                  <span class="reasoning-text">{{ reason }}</span>
                </li>
              </ul>
            </div>

            <div class="analysis-card factors-card">
              <h3 class="card-title">Ключевые факторы</h3>
              <ul class="factors-list">
                <li v-for="(factor, i) in selectedMatch.factors" :key="i">{{ factor }}</li>
              </ul>
            </div>

            <div class="analysis-card streak-card">
              <h3 class="card-title">Серии</h3>
              <div class="streak-display">
                <div class="streak-item">
                  <span class="streak-team">{{ selectedMatch.team1 }}</span>
                  <span class="streak-text">{{ selectedMatch.team1Stats.streak }}</span>
                </div>
                <div class="streak-item">
                  <span class="streak-team">{{ selectedMatch.team2 }}</span>
                  <span class="streak-text">{{ selectedMatch.team2Stats.streak }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import type { AnalysisData } from '../data/Analysis/IAnalysis'
import { useRoute } from 'vue-router'

const route = useRoute()
const API_BASE = import.meta.env.VITE_API_BASE || ''
const matches = ref<AnalysisData[]>([])
const selectedMatch = ref<AnalysisData | null>(null)

onMounted(async () => {
  try {
    const res = await axios.get(`${API_BASE}/api/matches`)
    matches.value = res.data
  } catch (error) {
    console.error('Error fetching analysis matches:', error)
    matches.value = []
  }finally{
    selectMatch(Number(route.query.id))
  }
})

const selectMatch = async (id: number) => {
  try{
    const res = await axios.get(`${API_BASE}/api/matches/${id}/analysis`)
    selectedMatch.value = res.data
  }catch(error){
    console.error('Error fetching analysis matches:', error)
    selectedMatch.value = null
  }
}

const getWinnerName = () => {
  if (!selectedMatch.value) return ''
  const { prediction, team1, team2 } = selectedMatch.value
  if (prediction.winner === 'team1') return team1
  if (prediction.winner === 'team2') return team2
  return 'Ничья'
}

const isLive = (time: string) => {
  return time.toLowerCase().includes('сегодня') || time.toLowerCase().includes('live')
}
</script>

<style scoped>
.analyzer-page {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
}

.analyzer-header {
  margin-bottom: 2rem;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--main-font-color);
  margin-bottom: 0.5rem;
}

.page-subtitle {
  color: var(--secondary-font-color);
  font-size: 0.95rem;
}

.analyzer-layout {
  display: grid;
  grid-template-columns: 340px 1fr;
  gap: 2rem;
  align-items: start;
}

.matches-sidebar {
  background: var(--card-back-color);
  border: var(--main-border);
  border-radius: 12px;
  padding: 1.25rem;
  position: sticky;
  top: 100px;
  max-height: calc(100vh - 120px);
  overflow-y: auto;
}

.sidebar-title {
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--secondary-font-color);
  margin-bottom: 1rem;
}

.matches-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.match-item {
  
  border-radius: 10px;
  padding: 12px 14px;
  text-align: left;
  width: 100%;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.match-item.active {
  border-color: var(--accent-font-color);
  background: rgba(0, 255, 36, 0.05);
  box-shadow: 0 0 12px 1px #00ff2415;
}

.match-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.match-league {
  font-size: 0.7rem;
  color: var(--secondary-font-color);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 60%;
}

.match-time-badge {
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--secondary-font-color);
  background: var(--elem-back-hover-color);
  padding: 3px 8px;
  border-radius: 4px;
  white-space: nowrap;
}

.match-time-badge.live {
  color: #fff;
  background: #ff3b30;
  animation: livePulse 2s infinite;
}

@keyframes livePulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

.match-teams {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.team-name {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--main-font-color);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.analysis-content {
  min-height: 500px;
}

.placeholder {
  background: var(--card-back-color);
  border: var(--main-border);
  border-radius: 12px;
  padding: 4rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  min-height: 500px;
}

.placeholder-icon {
  color: var(--secondary-font-color);
  opacity: 0.5;
  margin-bottom: 1.5rem;
}

.placeholder-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--main-font-color);
  margin-bottom: 0.5rem;
}

.placeholder-text {
  color: var(--secondary-font-color);
  font-size: 0.9rem;
  max-width: 300px;
}

.analysis-result {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.analysis-match-header {
  background: var(--card-back-color);
  border: var(--main-border);
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
}

.analysis-tournament {
  font-size: 0.8rem;
  color: var(--secondary-font-color);
  margin-bottom: 0.75rem;
}

.analysis-teams {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 0.75rem;
}

.analysis-team {
  font-size: 1.25rem;
  font-weight: 700;
}

.analysis-vs {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--accent-font-color);
 
}

.analysis-time {
  font-size: 0.85rem;
  color: var(--accent-font-color);
}

.prediction-card {
  background: var(--card-back-color);
  border: 1px solid var(--accent-font-color);
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 2rem;
}

.prediction-badge {
  background: var(--accent-font-color);
  color: var(--card-back-color);
  font-size: 0.8rem;
  font-weight: 700;
  padding: 6px 14px;
  border-radius: 6px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.prediction-main {
  display: flex;
  align-items: center;
  gap: 2rem;
  flex: 1;
  justify-content: space-around;
}

.prediction-winner {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.winner-label {
  font-size: 0.75rem;
  color: var(--secondary-font-color);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.winner-name {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--accent-font-color);
}

.prediction-score {
  font-size: 1rem;
  font-weight: 600;
  color: var(--main-font-color);
}

.prediction-confidence {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  min-width: 120px;
}

.confidence-label {
  font-size: 0.75rem;
  color: var(--secondary-font-color);
  text-transform: uppercase;
}

.confidence-bar {
  width: 100%;
  height: 6px;
  background: var(--elem-back-color);
  border-radius: 3px;
  overflow: hidden;
}

.confidence-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--accent-font-color), var(--elem-hover-font-color));
  border-radius: 3px;
  transition: width 0.5s ease;
}

.confidence-value {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--accent-font-color);
}

.analysis-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.analysis-card {
  background: var(--card-back-color);
  border: var(--main-border);
  border-radius: 12px;
  padding: 1.25rem;
}

.analysis-card:hover {
  border-color: #00ff2430;
}

.card-title {
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--secondary-font-color);
  margin-bottom: 1rem;
}

.form-comparison {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.form-team-block {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.form-team-label {
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--main-font-color);
}

.form-badges {
  display: flex;
  gap: 4px;
}

.form-badge {
  width: 26px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  font-size: 0.7rem;
  font-weight: 700;
}

.form-badge.w {
  background: rgba(0, 255, 36, 0.15);
  color: var(--accent-font-color);
}

.form-badge.d {
  background: rgba(255, 193, 7, 0.15);
  color: #ffc107;
}

.form-badge.l {
  background: rgba(255, 59, 48, 0.15);
  color: #ff3b30;
}

.stats-comparison {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.stat-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.stat-value {
  font-size: 1rem;
  font-weight: 700;
  color: var(--main-font-color);
  min-width: 30px;
  text-align: center;
}

.stat-name {
  font-size: 0.8rem;
  color: var(--secondary-font-color);
  flex: 1;
  text-align: center;
}

.h2h-display {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.h2h-record {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.h2h-team {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.h2h-team span:first-child {
  font-size: 0.8rem;
  color: var(--secondary-font-color);
}

.h2h-wins {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--main-font-color);
}

.h2h-draws {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.draws-label {
  font-size: 0.7rem;
  color: var(--secondary-font-color);
}

.draws-count {
  font-size: 1rem;
  font-weight: 600;
  color: var(--secondary-font-color);
}

.h2h-last {
  display: flex;
  align-items: center;
  gap: 8px;
}

.h2h-last-label {
  font-size: 0.75rem;
  color: var(--secondary-font-color);
}

.h2h-scores {
  display: flex;
  gap: 6px;
}

.h2h-score {
  font-size: 0.75rem;
  background: var(--elem-back-color);
  padding: 3px 8px;
  border-radius: 4px;
  color: var(--main-font-color);
}

.reasoning-list {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.reasoning-list li {
  display: flex;
  gap: 10px;
  font-size: 0.85rem;
  color: var(--secondary-font-color);
  line-height: 1.4;
}

.reasoning-number {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--elem-back-color);
  border-radius: 50%;
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--accent-font-color);
  flex-shrink: 0;
}

.factors-list {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.factors-list li {
  font-size: 0.85rem;
  color: var(--secondary-font-color);
  line-height: 1.4;
  padding-left: 14px;
  position: relative;
}

.factors-list li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 7px;
  width: 6px;
  height: 6px;
  background: var(--accent-font-color);
  border-radius: 50%;
}

.streak-display {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.streak-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.streak-team {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--main-font-color);
}

.streak-text {
  font-size: 0.85rem;
  color: var(--accent-font-color);
}

@media (max-width: 1100px) {
  .analysis-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .prediction-main {
    flex-wrap: wrap;
    gap: 1rem;
  }
}

@media (max-width: 900px) {
  .analyzer-layout {
    grid-template-columns: 1fr;
  }

  .matches-sidebar {
    position: static;
    max-height: none;
  }

  .matches-list {
    flex-direction: row;
    overflow-x: auto;
    gap: 0.75rem;
  }

  .match-item {
    min-width: 240px;
  }

  .analysis-grid {
    grid-template-columns: 1fr;
  }
}
</style>
