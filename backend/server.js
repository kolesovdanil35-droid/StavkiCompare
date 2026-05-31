const app = require('./src/app');
const migrate = require('./src/db/migrate');
const port = process.env.PORT || 3001;

migrate().then(() => {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
});
