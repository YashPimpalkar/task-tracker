import 'dotenv/config'
import { Pool } from 'pg';

const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD } = process.env;

export const pool = new Pool({
  host: PGHOST,
  database: PGDATABASE,
  username: PGUSER,
  password: PGPASSWORD,
  port: 5432,
  ssl: {
    require: true,
  },
});

async function getPgVersion() {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT version()');
    console.log('PostgreSQL connected.\n version:', result.rows[0].version);
    console.log(result.rows[0]);
  } finally {
    client.release();
  }
}

getPgVersion();