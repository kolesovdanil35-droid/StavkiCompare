const migrate = require('./src/db/migrate');
migrate().then(() => process.exit(0)).catch(() => process.exit(1));
