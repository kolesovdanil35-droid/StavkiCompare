<script setup lang="ts">
import { ref } from 'vue'
import { useHead } from '@vueuse/head'
import EventPlace from '../components/EventPlace/EventPlace.vue'
useHead({
  title: 'BetAggregator: Лучшие коэффициенты на спорт в режиме онлайн',
  meta: [
   
  ],
  
})

</script>
<template>
  <div class="main-page">
    <EventPlace innerMathes = "live"/>
    <EventPlace innerMathes = "incoming"/>
    <EventPlace innerMathes = "live"/>
    <EventPlace innerMathes = "incoming"/>
    <EventPlace innerMathes = "live"/>
    <EventPlace innerMathes = "incoming"/>
  </div>
</template>
<style scoped>
  
</style>
