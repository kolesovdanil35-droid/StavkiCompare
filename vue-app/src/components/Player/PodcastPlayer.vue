<script setup lang="ts">
import { usePodcastPlayer } from '../../stores/podcastPlayer'

const {
  currentEpisode,
  hasNext,
  hasPrev,
  progressPercent,
  formatTime,
  state,
  togglePlay,
  next,
  prev,
  close,
} = usePodcastPlayer()
</script>

<template>
  <Transition name="player-slide">
    <div v-if="currentEpisode" class="podcast-player">
      <div class="player-progress" :style="{ width: progressPercent + '%' }"></div>
      <div class="player-body">
        <div class="player-info">
          <span class="player-title">{{ currentEpisode.title }}</span>
        </div>
        <div class="player-controls">
          <button class="ctrl-btn" :disabled="!hasPrev" @click="prev">⏮</button>
          <button class="ctrl-btn play-btn" @click="togglePlay">
            {{ state.isPlaying ? '⏸' : '▶' }}
          </button>
          <button class="ctrl-btn" :disabled="!hasNext" @click="next">⏭</button>
        </div>
        <div class="player-time">
          <span>{{ formatTime(state.currentTime) }}</span>
          <span class="time-sep">/</span>
          <span>{{ formatTime(state.duration) }}</span>
        </div>
        <button class="close-btn" @click="close">✕</button>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.podcast-player {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 999;
  background: var(--card-back-color);
  border-top: var(--main-border);
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.3);
}

.player-progress {
  height: 3px;
  background: var(--accent-font-color);
  transition: width 0.3s linear;
}

.player-body {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 8px 24px;
  max-width: 1400px;
  margin: 0 auto;
}

.player-info {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  min-width: 0;
}

.player-icon {
  font-size: 18px;
  flex-shrink: 0;
}

.player-title {
  font-size: 14px;
  font-weight: 500;
  color: var(--main-font-color);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.player-controls {
  display: flex;
  align-items: center;
  gap: 4px;
}

.ctrl-btn {
  background: transparent;
  border: none;
  padding: 6px 8px;
  font-size: 16px;
  cursor: pointer;
  border-radius: 6px;
  transition: background 0.15s;
}

.ctrl-btn:hover:not(:disabled) {
  background: var(--elem-back-color);
}

.ctrl-btn:disabled {
  opacity: 0.3;
  cursor: default;
}

.play-btn {
  font-size: 20px;
  padding: 6px 12px;
}

.player-time {
  font-size: 12px;
  color: var(--secondary-font-color);
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
}

.time-sep {
  margin: 0 2px;
  color: var(--accent-font-color);
}

.close-btn {
  background: transparent;
  border: none;
  padding: 4px 8px;
  font-size: 14px;
  color: var(--secondary-font-color);
  cursor: pointer;
  border-radius: 4px;
  transition: color 0.15s;
}

.close-btn:hover {
  color: var(--main-font-color);
  background: var(--elem-back-color);
}

/* Transition */
.player-slide-enter-active,
.player-slide-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.player-slide-enter-from,
.player-slide-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
</style>
