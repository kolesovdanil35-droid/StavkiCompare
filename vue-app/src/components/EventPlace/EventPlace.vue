<script setup lang="ts">
    import { computed, ref } from 'vue' 
    import { Match } from '../../data/Match/IMtach'
    
    import Filters from './Filters.vue'
    import EventModal from '../Modal/EventModal.vue'
    
    const showMathes = ref(false)
    const sportSet = ref<Set<string>>(new Set())
    const showModal = ref<boolean>(false)
    const selectedMatchId = ref<number | null>(null)
    const openModal = (eventId: number) => {
        selectedMatchId.value = eventId
        showModal.value = true
    }
    const closeModal = () => {
        showModal.value = false
        selectedMatchId.value = null
    }
    const props = defineProps<{
        innerMathes: string
        dataSourse: Match[]
    }>()
    const filteredDataSourse = computed<Match[]>(()=>{
        if(sportSet.value.size === 0) return props.dataSourse
        else return props.dataSourse
                .filter((item)=>sportSet.value.has(item.sport))
    })
    const filterSports = (sports:Set<string>) => {
        sportSet.value = sports
    }
</script>

<template>
    <div class="match-section">
        <div class="section-header" @click="showMathes = !showMathes">
            <div style="
                    display: flex;
                    align-items: center;
                    gap: 8px;">
                <span class="live-dot" v-if="innerMathes === 'Live'"></span>
                {{ innerMathes }}
            </div>
            
            <span class="hover-show" >{{ showMathes ? "Скрыть" : "Показать матчи" }}</span>
        </div>
        
        
        <TransitionGroup name="slide">
            <Filters v-if="showMathes" :dataSourse="props.dataSourse" @filter-changed="filterSports"></Filters>
            <div class="match-grid" v-if="showMathes">
                
                <div class="card match-card" v-for="event in filteredDataSourse" :key="event.id">
                    <div class="card-top">
                        <span class="card-top-info">{{ event.sport }}</span>
                        <span class="card-top-info">{{ event.time }}</span>
                    </div>
            
                    <div class="matchup">
                        <span class="team">{{ event.team1 }}</span>
                        <span class="score">{{ event.score ? event.score : 'VS' }}</span>
                        <span class="team">{{ event.team2 }}</span>
                    </div>
            
                    <div class="odds">
                        <button class="odd" @click="openModal(event.id)">{{ event.odds1 }}</button>
                        <button class="odd" :disabled="!event.drawOdds" @click="event.drawOdds && openModal(event.id)">{{ event.drawOdds || '-' }}</button>
                        <button class="odd" @click="openModal(event.id)">{{ event.odds2 }}</button>
                    </div>
                    
                    
                    
                </div>
            </div>
        </TransitionGroup>
        
    </div>
    <EventModal v-if="showModal" v-model="showModal" :match-id="selectedMatchId"/>
</template>

<style lang="css" scoped>
    .match-section {
        margin: 24px 0;
        padding: 0 12px;
    }

    .section-header {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 24px;
        font-weight: 600;
        color: var(--main-font-color);
        margin-bottom: 16px;
        padding-left: 8px;
        border-bottom: var(--main-border);
        letter-spacing: -0.3px;
        justify-content: space-between;
    }
    .section-header:hover{
        background: var(--elem-back-color);
        border-radius: 8px;
        color: var(--accent-font-color);
        border: var(--hover-border);
    }

    .section-header .hover-show{
        display: none;
    } 
    .section-header:hover .hover-show{
        display: inline;
        cursor: pointer;
        margin-right: 16px;
        font-size: 14px;
        color: var(--elem-hover-font-color);
    }

    .live-dot {
        width: 8px;
        height: 8px;
        background: var(--accent-font-color);
        border-radius: 50%;
        animation: pulse 2s infinite;
    }

    @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.3; }
    }

    .match-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 12px;
    }
    .slide-enter-active,
    .slide-leave-active {
    transition: all 0.2s ease-in;
    overflow: hidden;
    }

    .slide-enter-from,
    .slide-leave-to {
    opacity: 0;
    max-height: 0;
    
    }

    .slide-enter-to,
    .slide-leave-from {
    opacity: 1;
    max-height: 250px;
    }

    .match-card {
        width: 300px;
        display: flex;
        justify-content: space-between;
        flex-direction: column;
        gap: 12px;
    }

    .card-top {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .card-top-info{
        text-transform: uppercase;
        font-size: 12px;
        color: var(--secondary-font-color);
        letter-spacing: 0.5px;
    }

    .matchup {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
    }

    .team {
        font-size: 16px;
        font-weight: 500;
        color: var(--main-font-color);
        flex: 1;
        text-align: center;
        line-height: 1.2;
        word-break: break-word;
    }

    .score {
        font-size: 22px;
        font-weight: 700;
        color: var(--accent-font-color);
        min-width: 64px;
        text-align: center;
        letter-spacing: 2px;
        /* animation: pulse 3s infinite; */
    }

    .odds {
        display: flex;
        gap: 6px;
    }

    .odd {
        flex: 1;
        padding: 8px 6px;
    }

    @media (max-width: 768px) {
        .match-card {
            width: 100%;
            max-width: 350px;
        }
        
        .section-header {
            font-size: 20px;
        }
    }
</style>