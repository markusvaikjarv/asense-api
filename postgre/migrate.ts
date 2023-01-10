/* eslint-disable @typescript-eslint/no-var-requires */
import 'dotenv/config';
import path from 'path';

const marv = require('marv/api/promise');
const driver = require('marv-pg-driver');

const directory = path.resolve('./postgre/migrations');

const connection = {
  database: process.env.PSQL_DB,
  host: process.env.PSQL_HOST,
  port: parseInt(process.env.PSQL_PORT as string),
  user: process.env.PSQL_USER,
  password: process.env.PSQL_PASS,
};

// This runs all of the migrations files that have not yet been run on the database
(async () => {
  const migrations = await marv.scan(directory);
  await marv.migrate(migrations, driver({ connection }));
})();
