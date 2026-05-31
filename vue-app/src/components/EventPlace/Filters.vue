<script setup lang="ts">
import { ref, computed } from 'vue';
import { Match } from '../../data/Match/IMtach';

const sportSet = ref<Set<string>>(new Set())
const props = defineProps<{
    dataSourse: Match[]
}>()
const emit = defineEmits(['filterChanged'])

const sportEmoji: Record<string, string> = {
    Football: '⚽',
    Basketball: '🏀',
    Tennis: '🎾',
    'Dota 2': '🎮',
    Formula1: '🏎️',
    Esports: '🎮',
    Hockey: '🏒',
    Baseball: '⚾',
}

const uniqueSports = computed(() => {
    const seen = new Set<string>()
    return props.dataSourse.filter(m => {
        if (seen.has(m.sport)) return false
        seen.add(m.sport)
        return true
    })
})

const filterEdit = (sport: string) => {
    sportSet.value.has(sport) ? sportSet.value.delete(sport) : sportSet.value.add(sport)
    emit('filterChanged', sportSet.value)
}
</script>

<template>
    <div class="filter-body">
        <button
            v-for="event in uniqueSports"
            :key="event.sport"
            :class="['filter-btn', { active: sportSet.has(event.sport) }]"
            @click="filterEdit(event.sport)">
            
            <span class="filter-label">{{ event.sport }}</span>
        </button>
    </div>
</template>

<style lang="css" scoped>
.filter-body {
    justify-self: center;
    width: fit-content;
    max-width: 100%;
    background-color: var(--card-back-color);
    border-radius: 0 0 10px 10px;
    border: var(--main-border);
    border-top: none;
    position: relative;
    top: -16px;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 6px;
    padding: 12px 16px;
}

.filter-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 14px;
    background: var(--elem-back-color);
    border: var(--main-border);
    border-radius: 20px;
    color: var(--secondary-font-color);
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    white-space: nowrap;
}

.filter-btn:hover {
    background: var(--elem-back-hover-color);
    color: var(--main-font-color);
    border-color: #00ff2440;
    transform: translateY(-1px);
}

.filter-btn.active {
    background: rgba(0, 255, 36, 0.1);
    color: var(--accent-font-color);
    border-color: var(--accent-font-color);
}

.filter-emoji {
    font-size: 16px;
    line-height: 1;
}

.filter-label {
    line-height: 1;
}
</style>
