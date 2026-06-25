import { reactive } from 'vue'
import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE || ''

interface Match {
  id: number
  status: string
  team1: string
  team2: string
  odds1: string
  odds2: string
  drawOdds?: string
  time: string
  sport: string
  score?: string
  league: string
  is_saved?: boolean
}

const state = reactive({
  matches: [] as Match[],
  loaded: false,
})

async function fetch() {
  const token = localStorage.getItem('token')
  if (!token) {
    state.matches = []
    state.loaded = true
    return
  }
  try {
    const res = await axios.get(`${API_BASE}/api/saved-matches`)
    state.matches = res.data
  } catch {
    state.matches = []
  }
  state.loaded = true
}

async function toggle(matchId: number): Promise<boolean> {
  const token = localStorage.getItem('token')
  if (!token) return false

  const res = await axios.post(`${API_BASE}/api/saved-matches/${matchId}`)
  const saved = res.data.saved

  if (saved && res.data.match) {
    state.matches.push(res.data.match)
  } else if (!saved) {
    const idx = state.matches.findIndex(m => m.id === matchId)
    if (idx !== -1) state.matches.splice(idx, 1)
  } else {
    await fetch()
  }

  return saved
}

export const savedMatchesStore = { state, fetch, toggle }
