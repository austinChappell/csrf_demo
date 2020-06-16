require('dotenv').config();

console.log('DB: ', process.env.PGDATABASE);

const migrationsFolder = 'db/migrations';
const fs = require('fs');
const runSql = require('./db/runSql');

fs.readdirSync(migrationsFolder).forEach(file => {
  runSql(`migrations/${file}`);
});
