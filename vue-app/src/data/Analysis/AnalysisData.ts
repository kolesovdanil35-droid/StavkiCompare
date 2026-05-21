import { ref } from "vue"
import { AnalysisData } from "./IAnalysis"

const analysisMatches = ref<AnalysisData[]>([
  {
    id: 1,
    team1: 'Ливерпуль',
    team2: 'Манчестер Сити',
    time: 'Сегодня 20:45',
    league: 'АПЛ',
    team1Form: ['W', 'W', 'D', 'W', 'W'],
    team2Form: ['W', 'L', 'W', 'D', 'L'],
    team1Stats: {
      position: 1,
      played: 33,
      wins: 24,
      draws: 6,
      losses: 3,
      goalsScored: 72,
      goalsConceded: 28,
      streak: '5 матчей без поражений',
      homeRecord: '14W 2D 1L'
    },
    team2Stats: {
      position: 3,
      played: 33,
      wins: 20,
      draws: 7,
      losses: 6,
      goalsScored: 65,
      goalsConceded: 35,
      streak: '2 поражения подряд',
      awayRecord: '8W 4D 4L'
    },
    h2h: {
      total: 10,
      team1Wins: 4,
      draws: 3,
      team2Wins: 3,
      lastMatches: ['2:1', '1:1', '3:2', '0:1', '2:0']
    },
    prediction: {
      winner: 'team1',
      confidence: 72,
      predictedScore: '2:1',
      reasoning: [
        'Ливерпуль в превосходной форме — 5 матчей без поражений, 4 победы подряд',
        'Домашний стадион даёт значительное преимущество (14 побед в 17 матчах)',
        'Манчестер Сити проиграл 2 последних матча, что сказывается на морали',
        'В личных встречах Ливерпуль имеет небольшое преимущество на Энфилде'
      ]
    },
    factors: [
      'Ливерпуль забивает в 8 из 10 последних матчей',
      'Манчестер Сити слаб в выездных играх в этом сезоне',
      'Ожидаемая результативность: 2.5+ голов',
      'Лучший бомбардир Ливерпуля в отличной форме'
    ]
  },
  {
    id: 2,
    team1: 'Барселона',
    team2: 'Реал Мадрид',
    time: 'Завтра 22:00',
    league: 'Ла Лига',
    team1Form: ['W', 'W', 'W', 'D', 'W'],
    team2Form: ['W', 'W', 'L', 'W', 'W'],
    team1Stats: {
      position: 2,
      played: 34,
      wins: 23,
      draws: 5,
      losses: 6,
      goalsScored: 78,
      goalsConceded: 40,
      streak: '8 матчей без поражений',
      homeRecord: '13W 2D 2L'
    },
    team2Stats: {
      position: 1,
      played: 34,
      wins: 25,
      draws: 4,
      losses: 5,
      goalsScored: 70,
      goalsConceded: 30,
      streak: '3 победы подряд',
      awayRecord: '11W 2D 4L'
    },
    h2h: {
      total: 10,
      team1Wins: 3,
      draws: 2,
      team2Wins: 5,
      lastMatches: ['1:3', '2:1', '0:2', '1:1', '0:4']
    },
    prediction: {
      winner: 'team2',
      confidence: 58,
      predictedScore: '1:2',
      reasoning: [
        'Реал Мадрид доминирует в последних очных встречах — 5 побед из 10',
        'Барселона имеет проблемы в защите, пропуская в среднем 1.2 гола за матч',
        'Реал выиграл 3 последних матча, демонстрируя стабильную игру',
        'В Эль Класико Реал часто показывает лучший результат в гостях'
      ]
    },
    factors: [
      'Эль Класико — всегда непредсказуемый матч',
      'Барселона забила 15 голов в последних 5 домашних матчах',
      'Винисиус в отличной форме — 8 голов в 10 матчах',
      'Вероятность тотала больше 2.5 — 75%'
    ]
  },
  {
    id: 3,
    team1: 'Бавария',
    team2: 'Боруссия Дортмунд',
    time: 'Суббота 19:30',
    league: 'Бундеслига',
    team1Form: ['W', 'D', 'W', 'W', 'L'],
    team2Form: ['L', 'W', 'W', 'D', 'W'],
    team1Stats: {
      position: 1,
      played: 30,
      wins: 22,
      draws: 5,
      losses: 3,
      goalsScored: 80,
      goalsConceded: 32,
      streak: '4 победы дома подряд',
      homeRecord: '13W 1D 1L'
    },
    team2Stats: {
      position: 4,
      played: 30,
      wins: 17,
      draws: 5,
      losses: 8,
      goalsScored: 62,
      goalsConceded: 45,
      streak: '3 матча без поражений',
      awayRecord: '7W 3D 5L'
    },
    h2h: {
      total: 10,
      team1Wins: 6,
      draws: 2,
      team2Wins: 2,
      lastMatches: ['3:1', '2:2', '4:0', '1:2', '3:0']
    },
    prediction: {
      winner: 'team1',
      confidence: 68,
      predictedScore: '3:1',
      reasoning: [
        'Бавария доминирует в домашних матчах — 13 побед из 15',
        'Дер Классикер — 6 побед Баварии в последних 10 встречах',
        'Боруссия пропускает в среднем 1.5 гола за выездной матч',
        'Бавария имеет лучшую атаку лиги — 80 голов в 30 матчах'
      ]
    },
    factors: [
      'Бавария забила в каждом домашнем матче сезона',
      'Боруссия нестабильна в гостях',
      'Мюллер забил 5 голов в последних 6 матчах против Дортмунда',
      'Ожидается открытый матч с множеством голов'
    ]
  }
])

export { analysisMatches }
