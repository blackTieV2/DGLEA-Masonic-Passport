const path = require('node:path');
const { runSqlFiles } = require('./db-utils.cjs');

runSqlFiles({
  dir: path.resolve(__dirname, '../db/seeds'),
  label: 'seed',
}).catch((error) => {
  console.error(error);
  process.exit(1);
});
