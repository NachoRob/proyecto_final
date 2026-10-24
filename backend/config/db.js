require('dotenv').config({ quiet: true })
const { Pool } = require('pg')

// En producción (Render) se usa DATABASE_URL; en local, las variables PG*.
const pool = process.env.DATABASE_URL
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DB_SSL === 'false' ? false : { rejectUnauthorized: false }
    })
  : new Pool({
      host: process.env.PGHOST || 'localhost',
      user: process.env.PGUSER,
      password: process.env.PGPASSWORD,
      database: process.env.PGDATABASE || 'marketplace',
      port: process.env.PGPORT || 5432,
      allowExitOnIdle: true
    })

module.exports = pool
