import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const DB_TYPE = (process.env.DB_TYPE || 'postgres').toLowerCase();
const DB_HOST = process.env.DB_HOST || '127.0.0.1';
const DB_PORT = parseInt(process.env.DB_PORT || (DB_TYPE === 'mysql' ? '3306' : '5432'), 10);
const DB_USER = process.env.DB_USER || 'postgres';
const DB_PASSWORD = process.env.DB_PASSWORD || '';
const DB_NAME = process.env.DB_NAME || 'skillgrad';
const CLOUD_SQL_CONNECTION_NAME = process.env.CLOUD_SQL_CONNECTION_NAME || '';

let client = null;
let activeEngine = 'sqlite'; // 'cloudsql_pg' | 'cloudsql_mysql' | 'sqlite'
let sqliteDb = null;

// Initialize Database Connection
export async function initDatabase() {
  const hasCloudSqlConfig = Boolean(DB_PASSWORD && DB_HOST && DB_NAME);

  if (hasCloudSqlConfig) {
    if (DB_TYPE === 'postgres') {
      try {
        const { default: pg } = await import('pg');
        const pool = new pg.Pool({
          host: DB_HOST,
          port: DB_PORT,
          user: DB_USER,
          password: DB_PASSWORD,
          database: DB_NAME,
          max: 10,
          idleTimeoutMillis: 30000,
          connectionTimeoutMillis: 5000
        });

        // Test connection
        await pool.query('SELECT 1');
        client = pool;
        activeEngine = 'cloudsql_pg';
        console.log(`✓ [Google Cloud SQL] Connected to PostgreSQL at ${DB_HOST}:${DB_PORT}/${DB_NAME}`);
        if (CLOUD_SQL_CONNECTION_NAME) {
          console.log(`  Cloud SQL Instance: ${CLOUD_SQL_CONNECTION_NAME}`);
        }
      } catch (err) {
        console.warn(`! [Google Cloud SQL] Could not connect to PostgreSQL (${err.message}). Falling back to local development database.`);
      }
    } else if (DB_TYPE === 'mysql') {
      try {
        const { default: mysql } = await import('mysql2/promise');
        const pool = mysql.createPool({
          host: DB_HOST,
          port: DB_PORT,
          user: DB_USER,
          password: DB_PASSWORD,
          database: DB_NAME,
          waitForConnections: true,
          connectionLimit: 10,
          queueLimit: 0
        });

        await pool.query('SELECT 1');
        client = pool;
        activeEngine = 'cloudsql_mysql';
        console.log(`✓ [Google Cloud SQL] Connected to MySQL at ${DB_HOST}:${DB_PORT}/${DB_NAME}`);
      } catch (err) {
        console.warn(`! [Google Cloud SQL] Could not connect to MySQL (${err.message}). Falling back to local development database.`);
      }
    }
  }

  // Fallback to SQLite (built into Node.js 22+) for instant zero-config localhost dev
  if (!client) {
    try {
      const { DatabaseSync } = await import('node:sqlite');
      const dbPath = path.join(__dirname, 'skillgrad_dev.db');
      sqliteDb = new DatabaseSync(dbPath);
      activeEngine = 'sqlite';
      console.log(`✓ [Local Database] Initialized SQLite at ${dbPath}`);
      console.log(`  (To connect Google Cloud SQL, populate DB_PASSWORD, DB_HOST in server/.env)`);
    } catch (sqliteErr) {
      console.error('Failed to initialize local sqlite database:', sqliteErr);
    }
  }

  await createTablesIfNotExist();
  return activeEngine;
}

// Unified Query Execution Helper
export async function dbQuery(sql, params = []) {
  if (activeEngine === 'cloudsql_pg') {
    // PostgreSQL uses $1, $2 parameter placeholders
    let pgSql = sql;
    let idx = 1;
    while (pgSql.includes('?')) {
      pgSql = pgSql.replace('?', `$${idx++}`);
    }
    const res = await client.query(pgSql, params);
    return res.rows;
  }

  if (activeEngine === 'cloudsql_mysql') {
    const [rows] = await client.query(sql, params);
    return rows;
  }

  if (activeEngine === 'sqlite' && sqliteDb) {
    // If it's a SELECT query, use prepare().all()
    const trimmed = sql.trim();
    if (trimmed.toUpperCase().startsWith('SELECT')) {
      const stmt = sqliteDb.prepare(sql);
      return stmt.all(...params);
    } else {
      const stmt = sqliteDb.prepare(sql);
      const res = stmt.run(...params);
      return res;
    }
  }

  return [];
}

// Automatic Schema Table Creation
async function createTablesIfNotExist() {
  const isPg = activeEngine === 'cloudsql_pg';
  const isMysql = activeEngine === 'cloudsql_mysql';

  const textType = isMysql ? 'VARCHAR(255)' : 'TEXT';
  const longTextType = isMysql ? 'TEXT' : 'TEXT';

  try {
    // 1. Internships table
    await dbQuery(`
      CREATE TABLE IF NOT EXISTS internships (
        id VARCHAR(100) PRIMARY KEY,
        title ${textType} NOT NULL,
        company ${textType} NOT NULL,
        logo ${textType},
        location ${textType},
        type ${textType},
        stipend ${textType},
        duration ${textType},
        domain ${textType},
        experience_level ${textType},
        skills ${longTextType},
        description ${longTextType},
        perks ${longTextType},
        openings INT DEFAULT 2,
        creator_id ${textType},
        creator_email ${textType},
        contact_email ${textType},
        status ${textType} DEFAULT 'Active',
        is_new INT DEFAULT 1,
        posted_at ${textType}
      )
    `);

    // 2. Applications table
    await dbQuery(`
      CREATE TABLE IF NOT EXISTS applications (
        id VARCHAR(100) PRIMARY KEY,
        job_id VARCHAR(100) NOT NULL,
        job_title ${textType},
        company_name ${textType},
        name ${textType} NOT NULL,
        email ${textType} NOT NULL,
        phone ${textType},
        college ${textType},
        portfolio_url ${longTextType},
        cover_note ${longTextType},
        user_id ${textType},
        status ${textType} DEFAULT 'Under Review',
        submitted_at ${textType}
      )
    `);

    // 3. Users table
    await dbQuery(`
      CREATE TABLE IF NOT EXISTS users (
        uid VARCHAR(100) PRIMARY KEY,
        email ${textType} NOT NULL UNIQUE,
        password ${textType} NOT NULL,
        display_name ${textType},
        role ${textType} DEFAULT 'student',
        registered_at ${textType}
      )
    `);

    // 4. Contact messages table
    await dbQuery(`
      CREATE TABLE IF NOT EXISTS contact_messages (
        id VARCHAR(100) PRIMARY KEY,
        name ${textType} NOT NULL,
        email ${textType} NOT NULL,
        phone ${textType},
        role ${textType},
        subject ${textType},
        message ${longTextType},
        submitted_at ${textType}
      )
    `);

    // 5. Certificates table
    await dbQuery(`
      CREATE TABLE IF NOT EXISTS certificates (
        id VARCHAR(100) PRIMARY KEY,
        serial_number VARCHAR(100) NOT NULL UNIQUE,
        student_name ${textType} NOT NULL,
        student_email ${textType} NOT NULL,
        company_name ${textType} NOT NULL,
        company_email ${textType},
        role_title ${textType} NOT NULL,
        domain ${textType},
        grade ${textType} DEFAULT 'A+',
        issue_date ${textType} NOT NULL,
        summary ${longTextType},
        created_at ${textType}
      )
    `);

    console.log('✓ Database schema tables verified and ready.');
  } catch (err) {
    console.error('Error verifying database tables:', err.message);
  }
}

export function getDatabaseStatus() {
  return {
    engine: activeEngine,
    connected: Boolean(client || sqliteDb),
    type: DB_TYPE,
    host: DB_HOST,
    database: DB_NAME,
    cloudSqlInstance: CLOUD_SQL_CONNECTION_NAME || 'Direct/IP'
  };
}
