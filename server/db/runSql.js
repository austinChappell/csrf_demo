const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const runSql = async (filename, params) => {
  const sql = fs.readFileSync(path.resolve(__dirname, 'sql', `${filename}.sql`)).toString();

  const client = new Client()
  await client.connect()
  
  const res = await client.query(sql, params);
  await client.end();

  return res.rows;
}

module.exports = runSql;
