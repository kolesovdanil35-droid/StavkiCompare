const { Router } = require('express');
const jwt = require('jsonwebtoken');
const pool = require('../db/pool');
const { formatTime } = require('../utils');

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET || 'stavki-compare-jwt-secret-dev';

const getUserId = (req) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) return null;
  try {
    const token = header.split(' ')[1];
    return jwt.verify(token, JWT_SECRET).userId;
  } catch {
    return null;
  }
};

router.get('/', async (req, res, next) => {
  try {
    const status = req.query.status;
    const userId = getUserId(req);

    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');

    const query = `
      SELECT m.id, m.start_time, m.score_home, m.score_away,
        t1.name as team1, t2.name as team2,
        s.name as sport, l.name as league,
        MAX(CASE WHEN out.name = 'П1' THEN o.value END) as odds1,
        MAX(CASE WHEN out.name = 'X' THEN o.value END) as draw_odds,
        MAX(CASE WHEN out.name = 'П2' THEN o.value END) as odds2
        ${userId ? ', MAX((CASE WHEN sm.id IS NOT NULL THEN 1 ELSE 0 END)::integer) as is_saved' : ''}
      FROM matches m
      JOIN teams t1 ON m.home_team_id = t1.id
      JOIN teams t2 ON m.away_team_id = t2.id
      JOIN sports s ON m.sport_id = s.id
      JOIN leagues l ON m.league_id = l.id
      LEFT JOIN odds o ON m.id = o.match_id
      LEFT JOIN outcomes out ON o.outcome_id = out.id
      ${userId ? `LEFT JOIN saved_matches sm ON m.id = sm.match_id AND sm.user_id = ${userId}` : ''}
      WHERE ($1::text IS NULL OR (CASE WHEN m.start_time <= NOW() THEN 'live' ELSE 'upcoming' END) = $1)
      GROUP BY m.id, t1.name, t2.name, s.name, l.name
      ORDER BY m.id
    `;

    const result = await pool.query(query, [status || null]);

    const matches = result.rows.map(row => ({
      id: row.id,
      status: row.start_time <= new Date() ? 'live' : 'upcoming',
      team1: row.team1,
      team2: row.team2,
      odds1: row.odds1 ? row.odds1.toString() : '-',
      odds2: row.odds2 ? row.odds2.toString() : '-',
      drawOdds: row.draw_odds ? row.draw_odds.toString() : undefined,
      time: formatTime(row.start_time, row.start_time <= new Date(), row.sport),
      sport: row.sport,
      score: row.score_home !== null ? `${row.score_home}:${row.score_away}` : undefined,
      league: row.league,
      ...(userId ? { is_saved: !!row.is_saved } : {}),
    }));

    res.json(matches);
  } catch (err) {
    next(err);
  }
});

router.get('/:id/bookmakers', async (req, res, next) => {
  try {
    const result = await pool.query(`
      SELECT b.id, b.name, b.rating, b.color, b.source_url,
        o.value as odd, out.name as outcome
      FROM odds o
      JOIN bookmakers b ON o.bookmaker_id = b.id
      JOIN outcomes out ON o.outcome_id = out.id
      WHERE o.match_id = $1
      ORDER BY b.id
    `, [req.params.id]);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

router.get('/:id/analysis', async (req, res, next) => {
  try {
    const result = await pool.query(`
      SELECT a.*,
        t1.name as team1, t2.name as team2,
        l.name as league, s.name as sport, m.start_time
      FROM analysis_matches a
      JOIN matches m ON a.match_id = m.id
      JOIN teams t1 ON m.home_team_id = t1.id
      JOIN teams t2 ON m.away_team_id = t2.id
      JOIN leagues l ON m.league_id = l.id
      JOIN sports s ON m.sport_id = s.id
      WHERE a.match_id = $1
    `, [req.params.id]);

    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });

    const row = result.rows[0];
    res.json({
      id: row.id,
      matchId: row.match_id,
      team1: row.team1,
      team2: row.team2,
      time: formatTime(row.start_time, row.start_time <= new Date(), row.sport),
      league: row.league,
      sport: row.sport,
      team1Form: row.team1_form,
      team2Form: row.team2_form,
      team1Stats: row.team1_stats,
      team2Stats: row.team2_stats,
      h2h: row.h2h,
      prediction: row.prediction,
      factors: row.factors,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
