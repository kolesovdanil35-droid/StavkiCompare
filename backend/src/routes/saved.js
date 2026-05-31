const { Router } = require('express');
const pool = require('../db/pool');
const { authMiddleware } = require('../middleware/auth');
const { formatTime } = require('../utils');

const router = Router();

router.use(authMiddleware);

router.get('/', async (req, res, next) => {
  try {
    const result = await pool.query(`
      SELECT m.id, m.start_time, m.score_home, m.score_away,
        t1.name as team1, t2.name as team2,
        s.name as sport, l.name as league,
        MAX(CASE WHEN out.name = 'П1' THEN o.value END) as odds1,
        MAX(CASE WHEN out.name = 'X' THEN o.value END) as draw_odds,
        MAX(CASE WHEN out.name = 'П2' THEN o.value END) as odds2,
        sm.created_at as saved_at
      FROM saved_matches sm
      JOIN matches m ON sm.match_id = m.id
      JOIN teams t1 ON m.home_team_id = t1.id
      JOIN teams t2 ON m.away_team_id = t2.id
      JOIN sports s ON m.sport_id = s.id
      JOIN leagues l ON m.league_id = l.id
      LEFT JOIN odds o ON m.id = o.match_id
      LEFT JOIN outcomes out ON o.outcome_id = out.id
      WHERE sm.user_id = $1
      GROUP BY m.id, t1.name, t2.name, s.name, l.name, sm.created_at
      ORDER BY sm.created_at DESC
    `, [req.userId]);

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
    }));

    res.json(matches);
  } catch (err) {
    next(err);
  }
});

router.post('/:matchId', async (req, res, next) => {
  try {
    const matchId = parseInt(req.params.matchId, 10);
    if (isNaN(matchId)) return res.status(400).json({ error: 'Invalid match ID' });

    const existing = await pool.query(
      'SELECT id FROM saved_matches WHERE user_id = $1 AND match_id = $2',
      [req.userId, matchId]
    );

    if (existing.rows.length > 0) {
      await pool.query('DELETE FROM saved_matches WHERE user_id = $1 AND match_id = $2', [req.userId, matchId]);
      res.json({ saved: false, matchId });
    } else {
      await pool.query('INSERT INTO saved_matches (user_id, match_id) VALUES ($1, $2)', [req.userId, matchId]);
      res.json({ saved: true, matchId });
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
