import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  user: process.env.PGUSER || "postgres",
  host: process.env.PGHOST || "localhost",
  database: process.env.PGDATABASE || "hydrogen",
  password: process.env.PGPASSWORD || "password",
  port: process.env.PGPORT || 5432,
});

export default pool;
