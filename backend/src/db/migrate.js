const pool = require('./pool');

const createTables = [
  `CREATE TABLE IF NOT EXISTS articles (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    image_url VARCHAR(500),
    author_name VARCHAR(100) NOT NULL,
    author_role VARCHAR(100),
    author_avatar VARCHAR(10),
    published_at TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
  )`,

  `CREATE TABLE IF NOT EXISTS podcasts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    duration_seconds INT NOT NULL DEFAULT 0,
    episode_number INT,
    published_at TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW()
  )`,

  `CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    avatar VARCHAR(10) DEFAULT '',
    created_at TIMESTAMP DEFAULT NOW()
  )`,

  `CREATE TABLE IF NOT EXISTS saved_matches (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    match_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, match_id)
  )`,

  `CREATE TABLE IF NOT EXISTS sports (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
  )`,

  `CREATE TABLE IF NOT EXISTS leagues (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    sport_id INT NOT NULL
  )`,

  `CREATE TABLE IF NOT EXISTS teams (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
  )`,

  `CREATE TABLE IF NOT EXISTS matches (
    id SERIAL PRIMARY KEY,
    home_team_id INT NOT NULL REFERENCES teams(id),
    away_team_id INT NOT NULL REFERENCES teams(id),
    sport_id INT NOT NULL REFERENCES sports(id),
    league_id INT NOT NULL REFERENCES leagues(id),
    start_time TIMESTAMP NOT NULL,
    score_home INT,
    score_away INT
  )`,

  `CREATE TABLE IF NOT EXISTS outcomes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(10) NOT NULL UNIQUE
  )`,

  `CREATE TABLE IF NOT EXISTS bookmakers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    rating DECIMAL(3,1) DEFAULT 0,
    color VARCHAR(20),
    source_url VARCHAR(500)
  )`,

  `CREATE TABLE IF NOT EXISTS odds (
    id SERIAL PRIMARY KEY,
    match_id INT NOT NULL REFERENCES matches(id),
    bookmaker_id INT NOT NULL REFERENCES bookmakers(id),
    outcome_id INT NOT NULL REFERENCES outcomes(id),
    value DECIMAL(10,2) NOT NULL,
    UNIQUE(match_id, bookmaker_id, outcome_id)
  )`,

  `CREATE TABLE IF NOT EXISTS analysis_matches (
    id SERIAL PRIMARY KEY,
    match_id INT NOT NULL UNIQUE REFERENCES matches(id),
    team1_form TEXT[],
    team2_form TEXT[],
    team1_stats JSONB,
    team2_stats JSONB,
    h2h JSONB,
    prediction JSONB,
    factors TEXT[]
  )`,

  `ALTER TABLE matches DROP COLUMN IF EXISTS status CASCADE`,
  `DROP TYPE IF EXISTS match_status`,
  `ALTER TABLE leagues DROP CONSTRAINT IF EXISTS leagues_sport_id_fkey`,
];

async function seed() {
  const sports = ['Футбол', 'Баскетбол', 'Теннис', 'Киберспорт'];
  for (const name of sports) {
    await pool.query('INSERT INTO sports (name) VALUES ($1) ON CONFLICT DO NOTHING', [name]);
  }

  const leagues = [
    ['РПЛ', 1], ['АПЛ', 1], ['NBA', 2], ['ATP', 3], ['CS:GO', 4],
  ];
  for (const [name, sportId] of leagues) {
    await pool.query('INSERT INTO leagues (name, sport_id) VALUES ($1, $2) ON CONFLICT DO NOTHING', [name, sportId]);
  }

  const teams = ['Спартак', 'Зенит', 'Барселона', 'Реал Мадрид', 'Lakers', 'Celtics', 'Warriors', 'Bulls', 'Джокович', 'Надаль', 'Федерер', 'NAVI', 'FaZe', 'Vitality'];
  for (const name of teams) {
    await pool.query('INSERT INTO teams (name) VALUES ($1) ON CONFLICT DO NOTHING', [name]);
  }

  await pool.query("INSERT INTO outcomes (name) VALUES ('П1'), ('X'), ('П2') ON CONFLICT DO NOTHING");

  const bookmakersData = [
    ['Winline', 4.8, '#00aaff', 'https://winline.ru'],
    ['Fonbet', 4.6, '#ff6b00', 'https://fonbet.ru'],
    ['Bet365', 4.9, '#00ff00', 'https://bet365.com'],
    ['1xBet', 4.5, '#1a5fb4', 'https://1xbet.com'],
    ['Parimatch', 4.4, '#ffcc00', 'https://parimatch.ru'],
  ];
  for (const [name, rating, color, url] of bookmakersData) {
    await pool.query('INSERT INTO bookmakers (name, rating, color, source_url) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING',
      [name, rating, color, url]);
  }
}

function getTeamId(name) {
  const map = { Спартак: 1, Зенит: 2, Барселона: 3, 'Реал Мадрид': 4, Lakers: 5, Celtics: 6, Warriors: 7, Bulls: 8, Джокович: 9, Надаль: 10, Федерер: 11, NAVI: 12, FaZe: 13, Vitality: 14 };
  return map[name];
}

async function seedMatches() {
  const now = new Date();
  const d = (daysOffset, hoursOffset = 0) => {
    const t = new Date(now);
    t.setDate(t.getDate() + daysOffset);
    t.setHours(t.getHours() + hoursOffset);
    return t.toISOString().slice(0, 19).replace('T', ' ');
  };

  const matchData = [
    { id: 1, home: 'Спартак', away: 'Зенит', sportId: 1, leagueId: 1, time: d(-1, -2), sh: 1, sa: 0 },
    { id: 2, home: 'Барселона', away: 'Реал Мадрид', sportId: 1, leagueId: 2, time: d(0, -1), sh: 2, sa: 1 },
    { id: 3, home: 'Lakers', away: 'Celtics', sportId: 2, leagueId: 3, time: d(0, -3), sh: 108, sa: 102 },
    { id: 4, home: 'Warriors', away: 'Bulls', sportId: 2, leagueId: 3, time: d(3, 4), sh: null, sa: null },
    { id: 5, home: 'Джокович', away: 'Надаль', sportId: 3, leagueId: 4, time: d(0, -5), sh: 2, sa: 1 },
    { id: 6, home: 'Федерер', away: 'Джокович', sportId: 3, leagueId: 4, time: d(5, 2), sh: null, sa: null },
    { id: 7, home: 'NAVI', away: 'FaZe', sportId: 4, leagueId: 5, time: d(0, -4), sh: 13, sa: 9 },
    { id: 8, home: 'Vitality', away: 'NAVI', sportId: 4, leagueId: 5, time: d(2, 6), sh: null, sa: null },
    { id: 9, home: 'Спартак', away: 'Барселона', sportId: 1, leagueId: 1, time: d(4, 0), sh: null, sa: null },
    { id: 10, home: 'Зенит', away: 'Реал Мадрид', sportId: 1, leagueId: 2, time: d(7, 2), sh: null, sa: null },
    { id: 11, home: 'Lakers', away: 'Warriors', sportId: 2, leagueId: 3, time: d(0, -6), sh: 115, sa: 110 },
    { id: 12, home: 'Celtics', away: 'Bulls', sportId: 2, leagueId: 3, time: d(6, 8), sh: null, sa: null },
    { id: 13, home: 'Надаль', away: 'Федерер', sportId: 3, leagueId: 4, time: d(3, 10), sh: null, sa: null },
  ];

  for (const m of matchData) {
    await pool.query(`
      INSERT INTO matches (id, home_team_id, away_team_id, sport_id, league_id, start_time, score_home, score_away)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      ON CONFLICT (id) DO UPDATE SET score_home = COALESCE(EXCLUDED.score_home, matches.score_home), score_away = COALESCE(EXCLUDED.score_away, matches.score_away)
    `, [m.id, getTeamId(m.home), getTeamId(m.away), m.sportId, m.leagueId, m.time, m.sh, m.sa]);
  }
}

function pickOdds(matchIdx, outcomeIdx, bookmakerIdx) {
  const base = 1.2 + (matchIdx * 0.7) % 2.5 + (outcomeIdx * 0.5) + (bookmakerIdx * 0.08);
  return Math.round(base * 100) / 100;
}

async function seedOdds() {
  const { rows: bmRows } = await pool.query('SELECT id FROM bookmakers ORDER BY id');
  const { rows: outcomeRows } = await pool.query('SELECT id FROM outcomes ORDER BY id');
  const { rows: matchRows } = await pool.query('SELECT id FROM matches ORDER BY id');

  for (let mi = 0; mi < matchRows.length; mi++) {
    const matchId = matchRows[mi].id;
    for (let bi = 0; bi < bmRows.length; bi++) {
      const bmId = bmRows[bi].id;
      for (let oi = 0; oi < outcomeRows.length; oi++) {
        const outId = outcomeRows[oi].id;
        const value = pickOdds(mi, oi, bi);
        await pool.query(`
          INSERT INTO odds (match_id, bookmaker_id, outcome_id, value)
          VALUES ($1, $2, $3, $4)
          ON CONFLICT (match_id, bookmaker_id, outcome_id) DO UPDATE SET value = EXCLUDED.value
        `, [matchId, bmId, outId, value]);
      }
    }
  }
}

async function seedAnalysis() {
  const analysisData = [
    { matchId: 1, team1Form: ['W', 'W', 'D', 'W', 'L'], team2Form: ['W', 'W', 'W', 'D', 'W'], factors: ['Домашнее поле', 'Травма ключевого игрока у гостей'], h2h: { total: 30, team1Wins: 12, draws: 8, team2Wins: 10, lastMatches: ['1:0', '2:2', '0:1', '1:1', '2:1'] } },
    { matchId: 2, team1Form: ['W', 'L', 'W', 'D', 'W'], team2Form: ['W', 'W', 'W', 'W', 'D'], factors: ['Принципиальное противостояние', 'Отличная форма гостей'], h2h: { total: 50, team1Wins: 18, draws: 15, team2Wins: 17, lastMatches: ['2:1', '1:3', '2:2', '0:0', '3:2'] } },
    { matchId: 3, team1Form: ['W', 'W', 'L', 'W', 'W'], team2Form: ['L', 'W', 'W', 'L', 'W'], factors: ['Серия побед хозяев', 'Высокая результативность'], h2h: { total: 120, team1Wins: 65, draws: 0, team2Wins: 55, lastMatches: ['112:108', '95:101', '120:115', '98:92', '105:110'] } },
    { matchId: 4, team1Form: ['L', 'W', 'W', 'L', 'W'], team2Form: ['L', 'L', 'W', 'L', 'L'], factors: ['Неровная форма обеих команд', 'Проблемы в защите у гостей'], h2h: { total: 90, team1Wins: 48, draws: 0, team2Wins: 42, lastMatches: ['110:105', '95:100', '115:108', '88:92', '102:98'] } },
    { matchId: 5, team1Form: ['W', 'W', 'W', 'L', 'W'], team2Form: ['L', 'W', 'W', 'W', 'L'], factors: ['Лидерство в рейтинге', 'Грунтовое покрытие'], h2h: { total: 40, team1Wins: 23, draws: 0, team2Wins: 17, lastMatches: ['2:1', '3:2', '1:2', '2:0', '2:3'] } },
    { matchId: 6, team1Form: ['W', 'L', 'W', 'L', 'W'], team2Form: ['W', 'W', 'W', 'W', 'W'], factors: ['Возраст игроков', 'Разная физическая форма'], h2h: { total: 35, team1Wins: 12, draws: 0, team2Wins: 23, lastMatches: ['1:2', '2:3', '0:2', '2:1', '1:3'] } },
    { matchId: 7, team1Form: ['W', 'W', 'L', 'W', 'W'], team2Form: ['W', 'W', 'W', 'L', 'L'], factors: ['Домашняя карта', 'Пик формы у NAVI'], h2h: { total: 15, team1Wins: 9, draws: 0, team2Wins: 6, lastMatches: ['16:12', '13:16', '16:10', '19:17', '14:16'] } },
    { matchId: 8, team1Form: ['L', 'W', 'L', 'W', 'L'], team2Form: ['W', 'W', 'W', 'W', 'L'], factors: ['Недавняя смена состава', 'Проблемы с коммуникацией'], h2h: { total: 10, team1Wins: 3, draws: 0, team2Wins: 7, lastMatches: ['16:12', '10:16', '14:16', '16:13', '11:16'] } },
  ];

  for (const a of analysisData) {
    const exists = await pool.query('SELECT id FROM analysis_matches WHERE match_id = $1', [a.matchId]);
    if (exists.rows.length > 0) continue;

    const prediction = {
      winner: a.matchId % 2 === 1 ? 'team1' : 'team2',
      confidence: 55 + (a.matchId * 3) % 30,
      predictedScore: ['2:1', '3:2', '1:0', '4:2', '2:0', '1:2', '16:13', '16:14', '1:1', '2:1', '112:108', '98:92', '2:1'][a.matchId - 1] || '2:1',
      reasoning: ['Анализ последних 5 игр', 'Форма команд в текущем сезоне', 'Статистика личных встреч'],
    };

    await pool.query(`
      INSERT INTO analysis_matches (match_id, team1_form, team2_form, team1_stats, team2_stats, h2h, prediction, factors)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `, [a.matchId, a.team1Form, a.team2Form,
      JSON.stringify({ position: 3 + a.matchId, goalsScored: 12 + a.matchId * 2, goalsConceded: 8 + a.matchId, wins: 5 + a.matchId, streak: a.matchId % 2 === 0 ? '3 победы' : '2 поражения' }),
      JSON.stringify({ position: 5 + a.matchId, goalsScored: 10 + a.matchId, goalsConceded: 9 + a.matchId, wins: 4 + a.matchId, streak: a.matchId % 2 === 0 ? '1 ничья' : '2 победы' }),
      JSON.stringify(a.h2h), JSON.stringify(prediction), a.factors]);
  }
}

const seedArticles = `
  INSERT INTO articles (title, excerpt, content, category, author_name, author_role, author_avatar, published_at)
  VALUES
    ('Тактический разбор: почему Барселона проигрывает в гостях', 'Анализ последних матчей каталонского клуба, проблемы в обороне и статистика выездных игр в этом сезоне.', 'Барселона в этом сезоне демонстрирует нестабильные результаты на выезде.\n\n## Проблемы в обороне\nКаталонцы пропускают в среднем 1.6 гола на выезде против 0.8 дома.\n\n## Прогноз\nЭксперты сходятся во мнении, что без усиления обороны команда рискует потерять место в топ-4.', 'Футбол', 'Алексей Петров', 'Главный аналитик', '👨‍💼', '2024-01-15'),
    ('NBA: Статистические аномалии января 2024', 'Неожиданные результаты, переоцененные фавориты и темные лошадки второй половины сезона.', 'Январь 2024 года принес немало сюрпризов в мире NBA.\n\n## Неожиданные результаты\nНесколько команд показали результаты, которые не прогнозировали букмекеры.\n\n## Вывод\nСледите за линиями на аутсайдеров в ближайших турах.', 'Баскетбол', 'Мария Иванова', 'Спортивный аналитик', '👩‍💼', '2024-01-14'),
    ('Киберспорт: мета-анализ CS2 после последнего обновления', 'Как изменилась статистика команд, новые тактики и влияние патча на профессиональную сцену.', 'Последнее обновление CS2 внесло значительные изменения.\n\n## Изменения в мете\nС патчем 2024 года изменился баланс оружия.\n\n## Прогноз на турниры\nОжидаем больше неожиданных результатов на ближайших турнирах.', 'Киберспорт', 'Дмитрий Смирнов', 'Эксперт по киберспорту', '🎮', '2024-01-13')
  ON CONFLICT DO NOTHING
`;

const seedPodcasts = `
  INSERT INTO podcasts (title, description, duration_seconds, episode_number, published_at)
  VALUES
    ('Зимние трансферы в футболе', 'Обзор главных трансферных новостей зимнего окна.', 1800, 1, '2024-01-12'),
    ('Анализ Australian Open', 'Разбор первых кругов Australian Open.', 2100, 2, '2024-01-10'),
    ('Новости NBA All-Star', 'Обсуждение составов на Матч Всех Звезд.', 2520, 3, '2024-01-08')
  ON CONFLICT DO NOTHING
`;

async function migrate() {
  for (const sql of createTables) {
    await pool.query(sql);
  }
  console.log('✓ Tables ready');

  const { rows } = await pool.query('SELECT COUNT(*)::int as cnt FROM articles');
  if (rows[0].cnt === 0) {
    await pool.query(seedArticles);
    console.log('✓ Articles seeded');
  }

  const { rows: podcastRows } = await pool.query('SELECT COUNT(*)::int as cnt FROM podcasts');
  if (podcastRows[0].cnt === 0) {
    await pool.query(seedPodcasts);
    console.log('✓ Podcasts seeded');
  }

  const { rows: sportRows } = await pool.query('SELECT COUNT(*)::int as cnt FROM sports');
  if (sportRows[0].cnt === 0) {
    await seed();
    console.log('✓ Sports, leagues, teams, outcomes, bookmakers seeded');
  }

  const { rows: matchRows } = await pool.query('SELECT COUNT(*)::int as cnt FROM matches');
  if (matchRows[0].cnt === 0) {
    await seedMatches();
    console.log('✓ Matches seeded');
  }

  const { rows: oddRows } = await pool.query('SELECT COUNT(*)::int as cnt FROM odds');
  if (oddRows[0].cnt === 0) {
    await seedOdds();
    console.log('✓ Odds seeded');
  }

  const { rows: analysisRows } = await pool.query('SELECT COUNT(*)::int as cnt FROM analysis_matches');
  if (analysisRows[0].cnt === 0) {
    await seedAnalysis();
    console.log('✓ Analysis data seeded');
  }
}

module.exports = migrate;
