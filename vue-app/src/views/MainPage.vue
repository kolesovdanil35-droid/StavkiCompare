
<template>
  <div class="main-page">
    <div class="hero">
      <h1>СтавкиCompare</h1>
      <p class="subtitle">Лучшие коэффициенты на спортивные события</p>
      <div class="stats">
        <div class="stat">
          <span class="number">1,247</span>
          <span class="label">активных событий</span>
        </div>
       
        <div class="stat">
          <span class="number">97.3%</span>
          <span class="label">uptime</span>
        </div>
      </div>
    </div>

    <div class="matches-container">
      <!-- Сейчас онлайн -->
      <section class="matches-section">
        <div class="section-header">
          <h2>⚡ Сейчас онлайн</h2>
          <div class="live-badge">LIVE</div>
        </div>
        <div class="matches-grid">
          <div class="match-card" v-for="match in liveMatches" :key="match.id">
            <div class="match-status">
              <span class="live-dot"></span>
              {{ match.time }}
            </div>
            <div class="teams">
              <div class="team">
                <span class="team-name">{{ match.team1 }}</span>
                <span class="odds">{{ match.odds1 }}</span>
              </div>
              <div class="vs">VS</div>
              <div class="team">
                <span class="team-name">{{ match.team2 }}</span>
                <span class="odds">{{ match.odds2 }}</span>
              </div>
            </div>
            <div class="draw">
              <span>Ничья</span>
              <span class="odds">{{ match.drawOdds }}</span>
            </div>
            <button class="bet-btn">Сделать ставку</button>
          </div>
        </div>
      </section>

      <!-- Предстоящие матчи -->
      <section class="matches-section">
        <div class="section-header">
          <h2>📅 Предстоящие матчи</h2>
          <span class="date-range">Сегодня - Завтра</span>
        </div>
        <div class="matches-grid">
          <div class="match-card" v-for="match in upcomingMatches" :key="match.id">
            <div class="match-time">
              {{ match.time }}
            </div>
            <div class="match-league">
              <img :src="match.leagueIcon" class="league-icon" />
              {{ match.league }}
            </div>
            <div class="teams">
              <div class="team">
                <span class="team-name">{{ match.team1 }}</span>
                <span class="odds">{{ match.odds1 }}</span>
              </div>
              <div class="vs">VS</div>
              <div class="team">
                <span class="team-name">{{ match.team2 }}</span>
                <span class="odds">{{ match.odds2 }}</span>
              </div>
            </div>
            <div class="match-meta">
              <span class="sport-icon" :class="match.sport">{{ getSportIcon(match.sport) }}</span>
              <span class="market-count">{{ match.markets }} рынков</span>
            </div>
            <button class="bet-btn upcoming">Предзаказ</button>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useHead } from '@vueuse/head'
useHead({
  title: 'BetAggregator: Лучшие коэффициенты на спорт в режиме онлайн',
  meta: [
    {
      name: 'description',
      content: 'Ставки на футбол, хоккей, баскетбол и киберспорт. Сравнение коэффициентов, live-ставки, аналитика и прогнозы. Регистрируйтесь для получения бонуса!'
    },
    {
      name: 'keywords',
      content: 'ставки на спорт, коэффициенты, беттинг, прогнозы на матчи, live ставки, спортивные события'
    },
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes'
    },
    {
      property: 'og:title',
      content: 'BetAggregator: Лучшие коэффициенты на спорт'
    },
    {
      property: 'og:description',
      content: 'Онлайн ставки на спортивные события с лучшими коэффициентами'
    },
    {
      property: 'og:type',
      content: 'website'
    },
    {
      name: 'yandex-verification',
      content: '716d3f5738e09bb9'
    },
  ],
  link: [
    {
      rel: 'canonical',
      href: 'https://ваш-username.github.io/vue-betaggregator/'
    }
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "SportsOrganization",
        "name": "BetAggregator",
        "description": "Агрегатор ставок с лучшими коэффициентами на спортивные события",
        "url": "https://ваш-username.github.io/vue-betaggregator/",
        "logo": "https://ваш-username.github.io/vue-betaggregator/logo.png",
        "sameAs": [
          "https://twitter.com/betaggregator",
          "https://facebook.com/betaggregator"
        ]
      })
    }
  ]
})

interface Match {
  id: number
  team1: string
  team2: string
  odds1: string
  odds2: string
  drawOdds?: string
  time: string
  league?: string
  leagueIcon?: string
  sport: string
  markets?: number
}

const liveMatches = ref<Match[]>([
  {
    id: 1,
    team1: 'Манчестер Юнайтед',
    team2: 'Челси',
    odds1: '2.10',
    odds2: '3.25',
    drawOdds: '3.40',
    time: '65\'',
    sport: 'football'
  },
  {
    id: 2,
    team1: 'Golden State',
    team2: 'LA Lakers',
    odds1: '1.85',
    odds2: '1.95',
    time: 'Q3 08:32',
    sport: 'basketball'
  },
  {
    id: 3,
    team1: 'Djokovic',
    team2: 'Nadal',
    odds1: '1.65',
    odds2: '2.20',
    time: 'Set 2',
    sport: 'tennis'
  }
])

const upcomingMatches = ref<Match[]>([
  {
    id: 4,
    team1: 'Барселона',
    team2: 'Реал Мадрид',
    odds1: '2.45',
    odds2: '2.70',
    time: '20:00',
    league: 'La Liga',
    leagueIcon: '⚽',
    sport: 'football',
    markets: 145
  },
  {
    id: 5,
    team1: 'Red Bull Racing',
    team2: 'Mercedes',
    odds1: '1.90',
    odds2: '2.15',
    time: 'Завтра 15:00',
    league: 'Formula 1',
    leagueIcon: '🏎️',
    sport: 'formula1',
    markets: 89
  },
  {
    id: 6,
    team1: 'Astralis',
    team2: 'Na\'Vi',
    odds1: '2.30',
    odds2: '1.60',
    time: '21:30',
    league: 'ESL Pro League',
    leagueIcon: '🎮',
    sport: 'esports',
    markets: 67
  }
])

const getSportIcon = (sport: string): string => {
  const icons: Record<string, string> = {
    football: '⚽',
    basketball: '🏀',
    tennis: '🎾',
    formula1: '🏎️',
    esports: '🎮'
  }
  return icons[sport] || '🏆'
}
</script>

<style scoped>
.main-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.hero {
  text-align: center;
  padding: 3rem 1rem;
  background: linear-gradient(135deg, #1a2980, #26d0ce);
  border-radius: 16px;
  margin-bottom: 3rem;
  color: white;
}

.hero h1 {
  font-size: 3rem;
  margin-bottom: 0.5rem;
  font-weight: 700;
}

.subtitle {
  font-size: 1.2rem;
  opacity: 0.9;
  margin-bottom: 2rem;
}

.stats {
  display: flex;
  justify-content: center;
  gap: 3rem;
  margin-top: 2rem;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.number {
  font-size: 2.5rem;
  font-weight: 700;
  line-height: 1;
}

.label {
  font-size: 0.9rem;
  opacity: 0.8;
  margin-top: 0.5rem;
}

.matches-container {
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

.matches-section {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f0f2f5;
}

.section-header h2 {
  font-size: 1.5rem;
  color: #1a1a1a;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.live-badge {
  background: #ff4757;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  animation: pulse 2s infinite;
}

.date-range {
  color: #666;
  font-size: 0.9rem;
}

.matches-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.match-card {
  background: #f8fafc;
  border-radius: 12px;
  padding: 1.5rem;
  transition: transform 0.2s, box-shadow 0.2s;
  border: 1px solid #e2e8f0;
}

.match-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.match-status, .match-time {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #ff4757;
  font-weight: 600;
  margin-bottom: 1rem;
}

.live-dot {
  width: 8px;
  height: 8px;
  background: #ff4757;
  border-radius: 50%;
  animation: pulse 1.5s infinite;
}

.match-league {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #64748b;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.league-icon {
  font-size: 1.2rem;
}

.teams {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.team {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: white;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.team-name {
  font-weight: 500;
}

.odds {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  font-weight: 600;
  min-width: 60px;
  text-align: center;
}

.vs {
  text-align: center;
  color: #94a3b8;
  font-size: 0.9rem;
  font-weight: 500;
}

.draw {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0.75rem;
  margin-bottom: 1.5rem;
  background: white;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.match-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
  color: #64748b;
}

.sport-icon {
  font-size: 1.2rem;
}

.market-count {
  background: #e2e8f0;
  padding: 0.3rem 0.8rem;
  border-radius: 12px;
}

.bet-btn {
  width: 100%;
  padding: 0.75rem;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, opacity 0.2s;
}

.bet-btn:hover {
  opacity: 0.9;
  transform: scale(1.02);
}

.bet-btn.upcoming {
  background: linear-gradient(135deg, #4facfe, #00f2fe);
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

@media (max-width: 768px) {
  .hero h1 {
    font-size: 2rem;
  }
  
  .stats {
    flex-direction: column;
    gap: 1.5rem;
  }
  
  .matches-grid {
    grid-template-columns: 1fr;
  }
  
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
}
</style>
