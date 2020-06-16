require('dotenv').config();

const migrationsFolder = 'db/sql/migrations';
const fs = require('fs');
const runSql = require('./db/runSql');

const files = fs.readdirSync(migrationsFolder);

async function runMigrations () {
  for (const file of files) {
    const fileWithoutExtension = file.split('.sql')[0];

    await runSql(`migrations/${fileWithoutExtension}`);
  }
}

runMigrations();
