<script setup lang="ts">
import { ref, watch } from 'vue'
import axios from 'axios'
import Analizer from '../../views/Analizer.vue';
import { savedMatchesStore } from '../../stores/savedMatches'

const API_BASE = import.meta.env.VITE_API_BASE || ''
const showModal = defineModel<boolean>()
const props = defineProps<{
  matchId: number | null
}>()

const bookmakers = ref<any[]>([])
const analysisData = ref<any>(null)
const activeTab = ref('odds')
const isLoading = ref(false)
const isAnalysisLoading = ref(false)
const isSaved = ref(false)
const isAuth = ref(!!localStorage.getItem('token'))

watch(showModal, async (newVal) => {
  if (newVal) {
    bookmakers.value = []
    analysisData.value = null
    isSaved.value = false
    if (props.matchId) {
      isLoading.value = true
      isAnalysisLoading.value = true
      try {
        const [bookRes, analysisRes] = await Promise.all([
          axios.get(`${API_BASE}/api/matches/${props.matchId}/bookmakers`),
          axios.get(`${API_BASE}/api/matches/${props.matchId}/analysis`)
        ])
        bookmakers.value = bookRes.data
        analysisData.value = analysisRes.data
        checkSaved()
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        isLoading.value = false
        isAnalysisLoading.value = false
      }
    }
  }
}, { immediate: true })

const toggleSave = async () => {
  if (!isAuth.value || !props.matchId) return
  isSaved.value = await savedMatchesStore.toggle(props.matchId)
}

const checkSaved = async () => {
  if (!isAuth.value || !props.matchId) return
  if (!savedMatchesStore.state.loaded) {
    await savedMatchesStore.fetch()
  }
  isSaved.value = savedMatchesStore.state.matches.some(m => m.id === props.matchId)
}

const getFormClass = (result: string) => {
  return result
}
</script>

<template>
  <div v-if="showModal" class="backdrop" @click.self="showModal=false">
    <div class="modalDialog">
      <div class="modalBody">
        <!-- Шапка с матчем -->
        <div class="modalHeader">
          <div class="match-header">
            <div class="tournament">
              <span>{{ analysisData?.league || analysisData?.sport }}</span>
              <span class="time-separator">|</span>
              <span class="time">{{ analysisData?.time }}</span>
            </div>
            <div class="header-actions">
              <button v-if="isAuth" class="save-btn" :class="{ saved: isSaved }" @click="toggleSave" :title="isSaved ? 'Убрать из сохраненных' : 'Сохранить матч'">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                </svg>
              </button>
              <button class="close-btn" @click="showModal=false">✕</button>
            </div>
          </div>
          <div class="teams">
            <div class="team-info">
              <span class="team-name">{{ analysisData?.team1 }}</span>
              
            </div>
            <div class="match-info">
              <span class="vs">VS</span>
            </div>
            <div class="team-info">
              <span class="team-name">{{ analysisData?.team2 }}</span>
              
            </div>
          </div>
        </div>

        <!-- Табы для переключения -->
        <div class="tabs">
          <div class="tabs-container">
            <button 
              :class="['tab-btn', { active: activeTab === 'odds' }]" 
              @click="activeTab = 'odds'"
            >
              Коэффициенты
            </button>
            <button 
              :class="['tab-btn', { active: activeTab === 'analysis' }]" 
              @click="activeTab = 'analysis'"
            >
              Анализ матча
            </button>
          </div>
        </div>

        <!-- Контент вкладок -->
        <div class="tab-content">
          <!-- Вкладка с коэффициентами -->
          <div v-show="activeTab === 'odds'" class="odds-cards">
            <div v-if="isLoading" class="loading-state">Загрузка...</div>
            <div v-for="bookmaker in bookmakers" :key="bookmaker.id" class="card bookmaker-card">
              <div class="bookmaker-header">
                <span class="bookmaker-name">{{ bookmaker.name }}</span>
                <span class="outcome-badge">{{ bookmaker.outcome }}</span>
                <span class="odd-value">{{ bookmaker.odd }}</span>
                <a :href="bookmaker.sourceUrl" target="_blank" class="bet-btn">Сайт</a>
              </div>
            </div>
          </div>

          <!-- Вкладка с анализом -->
          <div v-show="activeTab === 'analysis'" class="analysis-container">
            <div v-if="isAnalysisLoading" class="loading-state">Загрузка анализа...</div>
            <div v-else-if="analysisData" class="analysis-grid">
              <div class="analysis-card form-card">
                <h3 class="analysis-title">Форма команд</h3>
                <div class="form-comparison">
                  <div class="form-team">
                    <span class="form-team-name">{{ analysisData.team1 }}</span>
                    <div class="form-badges">
                      <span v-for="result in analysisData.team1Form" 
                            :key="result"
                            :class="['form-badge', getFormClass(result)]">
                        {{ result }}
                      </span>
                    </div>
                  </div>
                  <div class="form-team">
                    <span class="form-team-name">{{ analysisData.team2 }}</span>
                    <div class="form-badges">
                      <span v-for="result in analysisData.team2Form" 
                            :key="result"
                            :class="['form-badge', getFormClass(result)]">
                        {{ result }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="analysis-card factors-card">
                <h3 class="analysis-title">Ключевые факторы</h3>
                <ul class="factors-list">
                  <li v-for="factor in analysisData.factors" :key="factor">
                    <span>{{ factor }}</span>
                  </li>
                </ul>
              </div>

              <div class="analysis-card h2h-card">
                <h3 class="analysis-title">История встреч</h3>
                <div class="h2h-stats">
                  <div class="h2h-row">
                    <span class="h2h-label">Всего матчей</span>
                    <span class="h2h-value">{{ analysisData.h2h.total }}</span>
                  </div>
                  <div class="h2h-row">
                    <span class="h2h-label">{{ analysisData.team1 }}</span>
                    <span class="h2h-value win">{{ analysisData.h2h.team1Wins }}</span>
                  </div>
                  <div class="h2h-row">
                    <span class="h2h-label">Ничьи</span>
                    <span class="h2h-value draw">{{ analysisData.h2h.draws }}</span>
                  </div>
                  <div class="h2h-row">
                    <span class="h2h-label">{{ analysisData.team2 }}</span>
                    <span class="h2h-value win">{{ analysisData.h2h.team2Wins }}</span>
                  </div>
                </div>
                <div class="h2h-last">
                  <span class="h2h-subtitle">Последние результаты:</span>
                  <div class="h2h-scores">
                    <span v-for="score in analysisData.h2h.lastMatches" :key="score" class="h2h-score">
                      {{ score }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- <div class="analysis-card prediction-card">
                <h3 class="analysis-title">Прогноз</h3>
                <div class="prediction-content">
                  <div class="prediction-winner">
                    <span class="prediction-label">Победитель:</span>
                    <span class="prediction-value">{{ 
                      analysisData.prediction.winner === 'team1' ? analysisData.team1 : 
                      analysisData.prediction.winner === 'team2' ? analysisData.team2 : 'Ничья'
                    }}</span>
                  </div>
                  <div class="prediction-confidence">
                    <span class="confidence-label">Уверенность:</span>
                    <div class="confidence-bar">
                      <div class="confidence-fill" :style="{ width: analysisData.prediction.confidence + '%' }"></div>
                    </div>
                    <span class="confidence-value">{{ analysisData.prediction.confidence }}%</span>
                  </div>
                  <div class="prediction-score">
                    <span class="score-label">Прогнозируемый счёт:</span>
                    <span class="score-value">{{ analysisData.prediction.predictedScore }}</span>
                  </div>
                  <div class="prediction-reasoning">
                    <span v-for="reason in analysisData.prediction.reasoning" :key="reason" class="reason">
                      {{ reason }}
                    </span>
                  </div>
                </div>
              </div> -->
            </div>
            <div v-else class="loading-state">Анализ недоступен</div>
          </div>
        </div>

        <!-- Футер -->
        <div class="modalFooter">
          <div class="update-time">
             Коэффициенты обновлены: только что
          </div>
          <button  @click="$router.push({ path: 'analis', query: { id : props.matchId } })">
            Полный анализ матча →
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="css" scoped>

/* Бэкдроп */
.backdrop {
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  z-index: 1000;
  background-color: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow-y: auto;
  padding: 20px;
}

.modalDialog {
  width: 1000px;
  max-width: 100%;
  animation: modalSlideIn 0.2s ease-out;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modalBody {
  padding: 0;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: var(--card-back-color);
}

/* Шапка */
.modalHeader {
  padding: 24px 24px 20px;
  border-bottom: var(--main-border);
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.05), rgba(118, 75, 162, 0.05));
}

.match-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.tournament {
  font-size: 13px;
  color: var(--secondary-font-color);
  display: flex;
  align-items: center;
  gap: 8px;
}

.time-separator {
  color: var(--accent-font-color);
}

.time {
  color: var(--accent-font-color);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.close-btn {
  background: var(--elem-back-color);
  border: var(--main-border);
  font-size: 20px;
  padding: 0;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  transition: all 0.2s;
}

.close-btn:hover {
  background: var(--elem-back-hover-color);
  transform: rotate(90deg);
}

.save-btn {
  background: transparent;
  border: var(--main-border);
  width: 32px;
  height: 32px;
  padding: 0;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--secondary-font-color);
  transition: all 0.2s;
}

.save-btn:hover {
  color: var(--accent-font-color);
  border-color: var(--accent-font-color);
  background: rgba(0, 255, 36, 0.05);
}

.save-btn.saved {
  color: var(--accent-font-color);
  border-color: var(--accent-font-color);
  background: rgba(0, 255, 36, 0.1);
}

.teams {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 30px;
}

.team-info {
  flex: 1;
  text-align: center;
}

.team-name {
  font-size: 20px;
  font-weight: 700;
  background: var(--accent-font-color);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;

}

.form {
  font-size: 11px;
  color: var(--secondary-font-color);
  letter-spacing: 1px;
}

.match-info {
  text-align: center;
}

.vs {
  font-size: 18px;
  font-weight: bold;
  color: var(--accent-font-color);
  background: var(--elem-back-color);
  padding: 6px 12px;
  border-radius: 20px;
  border: var(--main-border);
}

/* Табы */
.tabs {
  padding: 0 24px;
  background: var(--card-back-color);
}

.tabs-container {
  display: flex;
  position: relative;
  gap: 0;
  padding-top: 16px;
}

.tab-btn {
  background: none;
  border: none;
  border-radius: 0;
  padding: 12px 24px;
  font-size: 14px;
  font-weight: 500;
  color: var(--secondary-font-color);
  cursor: pointer;
  transition: color 0.3s ease;
  position: relative;
  z-index: 1;
}

.tab-btn.active {
  color: var(--main-font-color);
  border-bottom: 1px solid var(--accent-font-color);
}

.tab-btn:hover:not(.active) {
  color: var(--elem-hover-font-color);
  background: none;
  transform: none;
}

/* Контентная область */
.tab-content {
  flex: 1;
  overflow-y: auto;
  min-height: 400px;
}
.odds-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
  padding: 20px;
}

.loading-state {
  grid-column: 1 / -1;
  text-align: center;
  padding: 40px;
  color: var(--secondary-font-color);
  font-size: 14px;
}

.bookmaker-card {
  background: var(--elem-back-color);
  
}

.bookmaker-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}

.bookmaker-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.bookmaker-icon {
  font-size: 24px;
}

.bookmaker-name {
  font-weight: 600;
  font-size: 15px;
  flex-shrink: 0;
}

.outcome-badge {
  background: rgba(0, 255, 36, 0.1);
  padding: 4px 8px;
  border-radius: 6px;
  color: var(--accent-font-color);
  text-transform: uppercase;
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;
}

.odd-value {
  font-weight: 800;
  font-size: 20px;
  color: var(--accent-font-color);
  line-height: 1;
  min-width: 48px;
  text-align: center;
}

.bet-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px 12px;
  background: var(--elem-back-color);
  border: var(--main-border);
  border-radius: 8px;
  color: var(--main-font-color);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
  text-decoration: none;
  white-space: nowrap;
}

.bet-btn:hover {
  background: var(--elem-back-hover-color);
  color: #a8ffb4;
  border-color: #20fa3d40;
  transform: translateY(-0.5px);
}

.odd-label {
  color: var(--secondary-font-color);
  display: block;
}

/* Таблица коэффициентов */
.odds-container {
  padding: 20px 24px;
  min-height: 400px;
}

.odds-table {
  width: 100%;
  border-collapse: collapse;
}

.odds-table th,
.odds-table td {
  text-align: left;
  padding: 14px 12px;
}

.odds-table th {
  background: var(--elem-back-color);
  font-weight: 600;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--secondary-font-color);
  border-bottom: var(--main-border);
}

.odds-table tr {
  border-bottom: var(--main-border);
  transition: background 0.2s;
}

.odds-table tbody tr:hover {
  background: rgba(0, 255, 36, 0.05);
}

.col-bookmaker {
  font-weight: 500;
}

.odds-value {
  font-weight: 700;
  color: var(--accent-font-color);
  font-size: 16px;
}

/* Анализ матча */
.analysis-container {
  padding: 24px;
  min-height: 400px;
}

.analysis-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-card {
  grid-column: 1 / -1;
}

.factors-card {
  grid-column: 1;
}

.h2h-card {
  grid-column: 2;
}

.prediction-card {
  grid-column: 1 / -1;
}

.analysis-card {
  background: var(--elem-back-color);
  border: var(--main-border);
  border-radius: 12px;
  padding: 20px;
  transition: all 0.2s;
}

.analysis-card:hover {
  border-color: #00ff2430;
  box-shadow: 0 4px 20px rgba(0, 255, 36, 0.06);
}

.analysis-title {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 16px;
  color: var(--main-font-color);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Форма команд */
.form-comparison {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-team {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
}

.form-team-name {
  font-weight: 500;
  font-size: 14px;
}

.form-badges {
  display: flex;
  gap: 6px;
}

.form-badge {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 700;
}

.form-badge.W {
  background: rgba(0, 255, 36, 0.2);
  color: #00ff24;
}

.form-badge.D {
  background: rgba(255, 193, 7, 0.2);
  color: #ffc107;
}

.form-badge.L {
  background: rgba(255, 59, 48, 0.2);
  color: #ff3b30;
}

/* История встреч */
.h2h-card {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.h2h-stats {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.h2h-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 0;
  border-bottom: var(--main-border);
}

.h2h-label {
  font-size: 13px;
  color: var(--secondary-font-color);
}

.h2h-value {
  font-weight: 700;
  font-size: 16px;
  color: var(--main-font-color);
}

.h2h-value.win {
  color: var(--accent-font-color);
}

.h2h-value.draw {
  color: #ffc107;
}

.h2h-last {
  margin-top: 8px;
}

.h2h-subtitle {
  font-size: 12px;
  color: var(--secondary-font-color);
  display: block;
  margin-bottom: 8px;
}

.h2h-scores {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.h2h-score {
  background: var(--elem-back-color);
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  color: var(--main-font-color);
  border: var(--main-border);
}

/* Прогноз */
.prediction-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.prediction-winner {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.prediction-label {
  font-size: 13px;
  color: var(--secondary-font-color);
}

.prediction-value {
  font-size: 18px;
  font-weight: 700;
  color: var(--accent-font-color);
}

.prediction-confidence {
  display: flex;
  align-items: center;
  gap: 12px;
}

.confidence-label {
  font-size: 13px;
  color: var(--secondary-font-color);
  white-space: nowrap;
}

.confidence-bar {
  flex: 1;
  height: 8px;
  background: var(--elem-back-color);
  border-radius: 4px;
  overflow: hidden;
}

.confidence-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea, #764ba2);
  border-radius: 4px;
  transition: width 0.5s ease;
}

.confidence-value {
  font-size: 14px;
  font-weight: 700;
  color: var(--accent-font-color);
  min-width: 40px;
  text-align: right;
}

.prediction-score {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.score-label {
  font-size: 13px;
  color: var(--secondary-font-color);
}

.score-value {
  font-size: 18px;
  font-weight: 700;
  color: var(--main-font-color);
}

.prediction-reasoning {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 4px;
}

.reason {
  font-size: 13px;
  color: var(--secondary-font-color);
  padding-left: 12px;
  border-left: 2px solid var(--accent-font-color);
  line-height: 1.4;
}

/* Ключевые факторы */
.factors-list {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.factors-list li {
  font-size: 13px;
  color: var(--secondary-font-color);
  display: flex;
  align-items: flex-start;
  gap: 10px;
  line-height: 1.5;
}

/* Футер */
.modalFooter {
  padding: 16px 24px;
  border-top: var(--main-border);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--card-back-color);
}

.update-time {
  font-size: 12px;
  color: var(--secondary-font-color);
}

.full-analysis-btn {
  background: linear-gradient(135deg, #667eea, #764ba2);
  border: none;
  padding: 8px 16px;
  font-size: 13px;
}

.full-analysis-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

/* Адаптив */
@media (max-width: 768px) {
  .teams {
    flex-direction: column;
    gap: 15px;
  }
  
  .team-name {
    font-size: 18px;
  }
  
  .analysis-grid {
    grid-template-columns: 1fr;
  }
  
  .factors-card,
  .h2h-card {
    grid-column: 1;
  }
  
  .modalFooter {
    flex-direction: column;
    gap: 12px;
  }
  
  .odds-table th,
  .odds-table td {
    padding: 10px 8px;
    font-size: 12px;
  }
  
  .tab-btn {
    padding: 10px 16px;
    font-size: 13px;
  }
}

/* Анимации для появления */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.2s;
}

.slide-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.slide-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}
</style>
