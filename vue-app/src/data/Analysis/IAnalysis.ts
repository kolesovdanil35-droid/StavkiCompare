export interface AnalysisData  {
  id: number
  team1: string
  team2: string
  time: string
  league: string
  team1Form: string[]
  team2Form: string[]
  team1Stats: TeamStats
  team2Stats: TeamStats
  h2h: H2HRecord
  prediction: Prediction
  factors: string[]
}

export interface TeamStats {
  position: number
  played: number
  wins: number
  draws: number
  losses: number
  goalsScored: number
  goalsConceded: number
  streak: string
  homeRecord?: string
  awayRecord?: string
}

export interface H2HRecord {
  total: number
  team1Wins: number
  draws: number
  team2Wins: number
  lastMatches: string[]
}

export interface Prediction {
  winner: 'team1' | 'team2' | 'draw'
  confidence: number
  predictedScore: string
  reasoning: string[]
}
