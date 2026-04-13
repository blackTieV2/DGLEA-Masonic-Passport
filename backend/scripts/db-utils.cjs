const fs = require('node:fs');
const path = require('node:path');
const { Client } = require('pg');

function sortedSqlFiles(dir) {
  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith('.sql'))
    .sort()
    .map((file) => path.join(dir, file));
}

async function runSqlFiles({ dir, label }) {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL is required.');
  }

  const files = sortedSqlFiles(dir);
  const client = new Client({ connectionString });
  await client.connect();

  try {
    for (const file of files) {
      const sql = fs.readFileSync(file, 'utf8');
      if (!sql.trim()) continue;
      console.log(`[${label}] applying ${path.basename(file)}`);
      await client.query(sql);
    }
  } finally {
    await client.end();
  }
}

module.exports = { runSqlFiles };
