const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || process.env.POSTGRES_HOST || 'localhost',
  port: process.env.DB_PORT || process.env.POSTGRES_PORT || 5432,
  user: process.env.DB_USER || process.env.POSTGRES_USER || process.env.POSTGRES_POSTGRES_USER || 'postgres',
  password: process.env.DB_PASSWORD || process.env.POSTGRES_PASSWORD || process.env.POSTGRES_POSTGRES_PASSWORD || 'your_strong_password',
  database: process.env.DB_NAME || process.env.POSTGRES_DB || process.env.POSTGRES_POSTGRES_DB || 'postgres',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

module.exports = pool;
