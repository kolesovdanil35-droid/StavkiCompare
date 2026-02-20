<template>
  <div class="app">
    <herosection></herosection>
    <Header></Header>
    
    <main class="main">
      <RouterView />
    </main>

    <footer class="footer">
      <!-- ваш футер -->
    </footer>
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import Header from './components/Header/header.vue'
import Herosection from './components/Herosection.vue';
</script>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main {
  flex: 1;
  /* Автоматический отступ не нужен, sticky сам разберется */
}

/* Ваши существующие стили для футера */
.footer {
  /* ... */
}
.header{
  position: sticky;
  top:0;
}
</style>