<script setup lang="ts">
    import { ref } from 'vue'

    const props = defineProps({
        innerMathes: String
    })

    interface Match {
    id: number
    team1: string
    team2: string
    odds1: string
    odds2: string
    drawOdds?: string
    time: string
    league?: string
    leagueIcon?: string
    sport: string
    markets?: number
    }

    const dataSourse = ref<Match[]>([

    ])

    const liveMatches = ref<Match[]>([
    {
        id: 1,
        team1: 'Манчестер Юнайтед',
        team2: 'Челси',
        odds1: '2.10',
        odds2: '3.25',
        drawOdds: '3.40',
        time: '65\'',
        sport: 'football'
    },
    {
        id: 2,
        team1: 'Golden State',
        team2: 'LA Lakers',
        odds1: '1.85',
        odds2: '1.95',
        time: 'Q3 08:32',
        sport: 'basketball'
    },
    {
        id: 3,
        team1: 'Djokovic',
        team2: 'Nadal',
        odds1: '1.65',
        odds2: '2.20',
        time: 'Set 2',
        sport: 'tennis'
    }
    ])

    const upcomingMatches = ref<Match[]>([
    {
        id: 4,
        team1: 'Барселона',
        team2: 'Реал Мадрид',
        odds1: '2.45',
        odds2: '2.70',
        time: '20:00',
        league: 'La Liga',
        leagueIcon: '⚽',
        sport: 'football',
        markets: 145
    },
    {
        id: 5,
        team1: 'Red Bull Racing',
        team2: 'Mercedes',
        odds1: '1.90',
        odds2: '2.15',
        time: 'Завтра 15:00',
        league: 'Formula 1',
        leagueIcon: '🏎️',
        sport: 'formula1',
        markets: 89
    },
    {
        id: 6,
        team1: 'Astralis',
        team2: 'Na\'Vi',
        odds1: '2.30',
        odds2: '1.60',
        time: '21:30',
        league: 'ESL Pro League',
        leagueIcon: '🎮',
        sport: 'esports',
        markets: 67
    }
    ])

    switch (props.innerMathes) {
        case 'live':
            dataSourse.value = ([
                ...liveMatches.value
            ])
            break;
    
        case 'incoming':
            dataSourse.value = ([
                ...upcomingMatches.value
            ])
            break;
    }


</script>
<template>
    <div class="eventPlace">
      <div class="eventCard" v-for="event in dataSourse">
        <span class="eventCardTittle">{{ event.sport }}</span>
        <div class="eventCardBody">
          <div class="teams">
            <span class="team1">{{ event.team1 }}</span>
            <span class="score">0:3</span>
            <span class="team2">{{ event.team2 }}</span>
          </div>
          <div class="footerInfo">
            <span class="playTime">{{ event.time }}</span>
            <span class="ods"> {{event.odds1}} <span v-if="event.drawOdds">| {{ event.drawOdds }}</span> | {{ event.odds2 }}</span>
          </div>

        </div>
      </div>
    </div>
</template>
<style lang="css" scoped>
    .eventCard{
        background-color: rgb(20, 20, 20);
        padding: 8px;
        border: #dffcee6c;
        border-radius:16px;
        min-width: 350px;
    }
    .eventPlace{
        margin-bottom: 24px;
        /* Rectangle 26 */
        background: inherit;
        display: flex;
        flex-direction: row;
        justify-content: space-around;
    }
    .eventCardTittle{
        font-size: 28px;
    }
    .eventCardBody{
        border-top: 1px solid #00ff2447;
        background: inherit;
        color:#BECBFF;
        padding: 8px;
        
        /* opacity: 0.25; */
        /* Note: backdrop-filter has minimal browser support */
        /* border-radius: 20px; */
    }
    .teams{
        display: flex;
        gap: 18px;
        justify-content: center;
        font-size: 20px;
    }
    .footerInfo{
        display: flex;
        justify-content: space-around;
    }



</style>