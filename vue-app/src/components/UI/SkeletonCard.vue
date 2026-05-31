<template>
  <div class="skeleton-card">
    <div class="skeleton-top">
      <div class="skeleton-block skeleton-sport"></div>
      <div class="skeleton-block skeleton-time"></div>
    </div>
    <div class="skeleton-matchup">
      <div class="skeleton-block skeleton-team"></div>
      <div class="skeleton-block skeleton-score"></div>
      <div class="skeleton-block skeleton-team"></div>
    </div>
    <div class="skeleton-odds">
      <div class="skeleton-block skeleton-odd"></div>
      <div class="skeleton-block skeleton-odd"></div>
      <div class="skeleton-block skeleton-odd"></div>
    </div>
  </div>
</template>

<style scoped>
.skeleton-card {
  width: 300px;
  background: var(--card-back-color);
  border: var(--main-border);
  border-radius: 8px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.skeleton-top {
  display: flex;
  justify-content: space-between;
}

.skeleton-matchup {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.skeleton-odds {
  display: flex;
  gap: 6px;
}

.skeleton-block {
  background: linear-gradient(90deg, var(--elem-back-color) 25%, var(--elem-back-hover-color) 50%, var(--elem-back-color) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
  border-radius: 6px;
}

.skeleton-sport {
  width: 80px;
  height: 14px;
}

.skeleton-time {
  width: 50px;
  height: 14px;
}

.skeleton-team {
  flex: 1;
  height: 18px;
  max-width: 100px;
}

.skeleton-score {
  width: 40px;
  height: 22px;
}

.skeleton-odd {
  flex: 1;
  height: 36px;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
</style>
