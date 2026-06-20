const app = require('./src/app');
const migrate = require('./src/db/migrate');
const port = process.env.PORT || 3001;
console.log('DB_HOST=', process.env.DB_HOST);
console.log('POSTGRES_HOST=', process.env.POSTGRES_HOST);
migrate().then(() => {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
});
