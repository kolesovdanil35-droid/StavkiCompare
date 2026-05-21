import { ref } from "vue"
import { Match } from "./IMtach"

const liveMatches = ref<Match[]>([
    {
        id: 1,
        team1: 'Манчестер Юнайтед',
        team2: 'Челси',
        odds1: '2.10',
        odds2: '3.25',
        drawOdds: '3.40',
        time: '65\'',
        sport: 'Football',
        score: '1:1'
    },
    {
        id: 2,
        team1: 'Golden State',
        team2: 'LA Lakers',
        odds1: '1.85',
        odds2: '1.95',
        time: 'Q3 08:32',
        sport: 'Basketball',
        score: '89:87'
    },
    {
        id: 3,
        team1: 'Djokovic',
        team2: 'Nadal',
        odds1: '1.65',
        odds2: '2.20',
        time: 'Set 2',
        sport: 'Tennis',
        score: '9:6'
    },
    {
        id: 4,
        team1: 'Team Spirit',
        team2: 'OG',
        odds1: '1.75',
        odds2: '2.05',
        time: 'Map 2 - 15:43',
        sport: 'Dota 2',
        score: '23:18'
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
        sport: 'Football',
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
        sport: 'Formula1',
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
        sport: 'Esports',
        markets: 67
    }
])

export {liveMatches, upcomingMatches}