const express = require('express');
const path = require('path');
const matchesRouter = require('./routes/matches');
const articlesRouter = require('./routes/articles');
const podcastsRouter = require('./routes/podcasts');
const authRouter = require('./routes/auth');
const savedRouter = require('./routes/saved');
const healthRouter = require('./routes/health');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

app.use('/api/matches', matchesRouter);
app.use('/api/articles', articlesRouter);
app.use('/api/podcasts', podcastsRouter);
app.use('/api/auth', authRouter);
app.use('/api/saved-matches', savedRouter);
app.use('/api/health', healthRouter);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'public')));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });
}

app.use(errorHandler);

module.exports = app;
