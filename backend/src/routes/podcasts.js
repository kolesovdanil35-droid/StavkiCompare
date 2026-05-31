const { Router } = require('express');
const pool = require('../db/pool');

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const result = await pool.query(
      'SELECT id, title, description, duration_seconds, episode_number, published_at FROM podcasts ORDER BY episode_number ASC'
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
