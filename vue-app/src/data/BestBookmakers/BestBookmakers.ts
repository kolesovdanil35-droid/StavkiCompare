import { ref } from "vue";
import { bestBookmakers } from "./IBestBookmakers";

const BestBookmakers = ref<bestBookmakers[]>([
  { 
    id: 1, 
    name: '1xСтавка', 
    rating: 4.8, 
    outcomeValue: 'Победа хозяев',
    outcome: 'П1',
    odd: 2.15,
    color: '#00a65a'
  },
  { 
    id: 2, 
    name: 'Лига Ставок', 
    rating: 4.6, 
    outcomeValue: 'Ничья',
    outcome: 'X',
    odd: 3.45,
    color: '#f39c12'
  },
  { 
    id: 3, 
    name: 'BetBoom', 
    rating: 4.5, 
    outcomeValue: 'Победа гостей',
    outcome: 'П2',
    odd: 3.90,
    color: '#2c3e50'
  },
  { 
    id: 4, 
    name: 'Winline', 
    rating: 4.4, 
    outcomeValue: 'Фора (-1.5) хозяев',
    outcome: 'Ф1(-1.5)',
    odd: 2.85,
    color: '#e74c3c'
  },
  { 
    id: 5, 
    name: 'Фонбет', 
    rating: 4.3, 
    outcomeValue: 'Тотал больше 2.5',
    outcome: 'ТБ 2.5',
    odd: 1.95,
    color: '#3498db'
  },
  { 
    id: 6, 
    name: 'Мелбет', 
    rating: 4.2, 
    outcomeValue: 'Обе забьют',
    outcome: 'ОЗ',
    odd: 1.87,
    color: '#9b59b6'
  },
  { 
    id: 7, 
    name: 'Париматч', 
    rating: 4.7, 
    outcomeValue: 'Индивидуальный тотал хозяев больше 1.5',
    outcome: 'ИТБ1(1.5)',
    odd: 2.25,
    color: '#1abc9c'
  },
  { 
    id: 8, 
    name: 'Олимп', 
    rating: 4.1, 
    outcomeValue: 'Точный счет 2:1',
    outcome: '2:1',
    odd: 8.50,
    color: '#e67e22'
  },
 
  { 
    id: 11, 
    name: 'Зенит', 
    rating: 3.9, 
    outcomeValue: 'Угловые тотал больше 9.5',
    outcome: 'Углы ТБ 9.5',
    odd: 2.10,
    color: '#8e44ad'
  },
  { 
    id: 12, 
    name: 'Тенниси', 
    rating: 3.8, 
    outcomeValue: 'Желтые карточки тотал больше 4.5',
    outcome: 'ЖК ТБ 4.5',
    odd: 1.92,
    color: '#d35400'
  }
])

export {BestBookmakers}