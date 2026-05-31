import { reactive, computed } from 'vue'

export interface PodcastEpisode {
  id: number
  title: string
  published_at: string
  duration_seconds: number
}

interface PlayerState {
  queue: PodcastEpisode[]
  currentIndex: number
  isPlaying: boolean
  currentTime: number
  duration: number
}

const state = reactive<PlayerState>({
  queue: [],
  currentIndex: -1,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
})

let timerInterval: ReturnType<typeof setInterval> | null = null

const startTimer = () => {
  stopTimer()
  timerInterval = setInterval(() => {
    if (state.currentTime < state.duration) {
      state.currentTime++
    } else {
      stopTimer()
      state.isPlaying = false
    }
  }, 1000)
}

const stopTimer = () => {
  if (timerInterval) {
    clearInterval(timerInterval)
    timerInterval = null
  }
}

export const usePodcastPlayer = () => {
  const currentEpisode = computed(() =>
    state.currentIndex >= 0 && state.currentIndex < state.queue.length
      ? state.queue[state.currentIndex]
      : null
  )

  const hasNext = computed(() => state.currentIndex < state.queue.length - 1)
  const hasPrev = computed(() => state.currentIndex > 0)

  const progressPercent = computed(() =>
    state.duration > 0 ? (state.currentTime / state.duration) * 100 : 0
  )

  const formatTime = (seconds: number): string => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  const playEpisode = (episode: PodcastEpisode, queue: PodcastEpisode[] = []) => {
    state.queue = queue.length > 0 ? queue : [episode]
    state.currentIndex = state.queue.findIndex(e => e.id === episode.id)
    if (state.currentIndex === -1) state.currentIndex = 0
    state.currentTime = 0
    state.duration = episode.duration_seconds || 180
    state.isPlaying = true
    startTimer()
  }

  const togglePlay = () => {
    if (state.currentIndex < 0) return
    state.isPlaying = !state.isPlaying
    if (state.isPlaying) {
      startTimer()
    } else {
      stopTimer()
    }
  }

  const next = () => {
    if (hasNext.value) {
      state.currentIndex++
      state.currentTime = 0
      state.isPlaying = true
      startTimer()
    }
  }

  const prev = () => {
    if (hasPrev.value) {
      state.currentIndex--
      state.currentTime = 0
      state.isPlaying = true
      startTimer()
    }
  }

  const close = () => {
    stopTimer()
    state.queue = []
    state.currentIndex = -1
    state.isPlaying = false
    state.currentTime = 0
    state.duration = 0
  }

  return {
    state,
    currentEpisode,
    hasNext,
    hasPrev,
    progressPercent,
    formatTime,
    playEpisode,
    togglePlay,
    next,
    prev,
    close,
  }
}
