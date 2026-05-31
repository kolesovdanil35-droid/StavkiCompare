const pool = require('./pool');

const queries = [
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

  `ALTER TABLE matches DROP COLUMN IF EXISTS status CASCADE`,
  `DROP TYPE IF EXISTS match_status`,
];

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
  for (const sql of queries) {
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
}

module.exports = migrate;
