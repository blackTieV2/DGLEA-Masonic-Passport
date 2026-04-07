const path = require('node:path');
const { runSqlFiles } = require('./db-utils.cjs');

runSqlFiles({
  dir: path.resolve(__dirname, '../db/fixtures'),
  label: 'fixture',
}).catch((error) => {
  console.error(error);
  process.exit(1);
});
