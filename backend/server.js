const express = require('express');
const { Pool } = require('pg');
const app = express();
const port = process.env.PORT || 3001;

// Настройка подключения к БД
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'your_strong_password',
  database: process.env.DB_NAME || 'stavki_database',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Middleware
app.use(express.json());

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// API Routes
app.get('/api/matches', async (req, res) => {
  try {
    const status = req.query.status;
    let query = `SELECT m.id, m.status, m.team1, m.team2, m.match_time as time, m.sport, m.score, m.league, m.markets,
      MAX(CASE WHEN b.outcome = 'П1' THEN b.odd END) as odds1,
      MAX(CASE WHEN b.outcome = 'X' THEN b.odd END) as draw_odds,
      MAX(CASE WHEN b.outcome = 'П2' THEN b.odd END) as odds2
      FROM matches m
      LEFT JOIN bookmakers b ON m.id = b.match_id`;
    let params = [];
    
    if (status) {
      query += ' WHERE m.status = $1';
      params = [status];
    }
    
    query += ' GROUP BY m.id ORDER BY m.id';
    
    const result = await pool.query(query, params);
    
    const matches = result.rows.map(row => ({
      id: row.id,
      status: row.status,
      team1: row.team1,
      team2: row.team2,
      odds1: row.odds1 ? row.odds1.toString() : '-',
      odds2: row.odds2 ? row.odds2.toString() : '-',
      drawOdds: row.draw_odds ? row.draw_odds.toString() : undefined,
      time: row.time,
      sport: row.sport,
      score: row.score || undefined,
      league: row.league || undefined,
      markets: row.markets || undefined
    }));
    
    res.json(matches);
  } catch (err) {
    console.error('Error fetching matches:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/bookmakers', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, rating::float, outcome_value, outcome, odd::float, color FROM bookmakers ORDER BY id'
    );
    
    const bookmakers = result.rows.map(row => ({
      id: row.id,
      name: row.name,
      rating: row.rating,
      outcomeValue: row.outcome_value,
      outcome: row.outcome,
      odd: row.odd,
      color: row.color
    }));
    
    res.json(bookmakers);
  } catch (err) {
    console.error('Error fetching bookmakers:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/matches/:matchId/bookmakers', async (req, res) => {
  try {
    const matchId = parseInt(req.params.matchId);
    if (isNaN(matchId)) {
      return res.status(400).json({ error: 'Invalid match ID' });
    }
    
    const result = await pool.query(
      'SELECT id, name, rating::float, outcome_value, outcome, odd::float, color, source_url FROM bookmakers WHERE match_id = $1 ORDER BY id',
      [matchId]
    );
    
    const bookmakers = result.rows.map(row => ({
      id: row.id,
      name: row.name,
      rating: row.rating,
      outcomeValue: row.outcome_value,
      outcome: row.outcome,
      odd: row.odd,
      color: row.color,
      sourceUrl: row.source_url
    }));
    
    res.json(bookmakers);
  } catch (err) {
    console.error('Error fetching bookmakers for match:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/analysis/matches', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT a.id, a.match_id, m.team1, m.team2, m.match_time as time, m.league, m.sport, a.team1_form, a.team2_form, a.team1_stats, a.team2_stats, a.h2h, a.prediction, a.factors FROM analysis_matches a JOIN matches m ON a.match_id = m.id ORDER BY a.match_id'
    );
    
    const matches = result.rows.map(row => ({
      id: row.id,
      matchId: row.match_id,
      team1: row.team1,
      team2: row.team2,
      time: row.time,
      league: row.league,
      sport: row.sport,
      team1Form: row.team1_form,
      team2Form: row.team2_form,
      team1Stats: row.team1_stats,
      team2Stats: row.team2_stats,
      h2h: row.h2h,
      prediction: row.prediction,
      factors: row.factors
    }));
    
    res.json(matches);
  } catch (err) {
    console.error('Error fetching analysis matches:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/matches/:matchId/analysis', async (req, res) => {
  try {
    const matchId = parseInt(req.params.matchId);
    if (isNaN(matchId)) {
      return res.status(400).json({ error: 'Invalid match ID' });
    }
    
    const result = await pool.query(
      'SELECT a.id, a.match_id, m.team1, m.team2, m.match_time as time, m.league, m.sport, a.team1_form, a.team2_form, a.team1_stats, a.team2_stats, a.h2h, a.prediction, a.factors FROM analysis_matches a JOIN matches m ON a.match_id = m.id WHERE a.match_id = $1',
      [matchId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Analysis not found' });
    }
    
    const row = result.rows[0];
    res.json({
      id: row.id,
      matchId: row.match_id,
      team1: row.team1,
      team2: row.team2,
      time: row.time,
      league: row.league,
      sport: row.sport,
      team1Form: row.team1_form,
      team2Form: row.team2_form,
      team1Stats: row.team1_stats,
      team2Stats: row.team2_stats,
      h2h: row.h2h,
      prediction: row.prediction,
      factors: row.factors
    });
  } catch (err) {
    console.error('Error fetching analysis:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/health', async (req, res) => {
  try {
    // Проверяем подключение к БД
    await pool.query('SELECT 1');
    res.json({ 
      status: 'OK', 
      database: 'connected',
      timestamp: new Date().toISOString() 
    });
  } catch (err) {
    res.status(500).json({ 
      status: 'ERROR', 
      database: 'disconnected',
      timestamp: new Date().toISOString() 
    });
  }
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('Shutting down...');
  await pool.end();
  process.exit(0);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});