<script setup lang="ts">
import { ref } from 'vue';
import { Match } from '../../data/Match/IMtach';

const sportSet = ref<Set<string>>(new Set())
const props = defineProps<{
    dataSourse: Match[]
}>()
const emit = defineEmits(['filterChanged'])

const filterEdit =(sport:string)=>{
    sportSet.value.has(sport) ? sportSet.value.delete(sport) : sportSet.value.add(sport)
    emit('filterChanged',sportSet.value)
}
</script>

<template>
    <div class="filter-body">
        <button 
            v-for="event in dataSourse" 
            :class="{active:sportSet.has(event.sport)}"  
            @click="filterEdit(event.sport)">
            <span>{{ event.sport }}</span>
        </button>
    </div>
</template>
<style lang="css" scoped>
.filter-body{
    height: 50px;
    top: -16px;
    justify-self: center;
    width: fit-content;
    background-color: var(--card-back-color);
    border-radius: 0 0 8px 8px;
    border: var(--main-border);
    border-top: none;
    position: relative;
    display: flex;
    align-content: center;
    gap: 8px;
    padding: 12px; 
}

</style>