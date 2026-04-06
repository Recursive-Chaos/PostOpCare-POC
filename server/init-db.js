import dotenv from 'dotenv';
import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';

dotenv.config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: { rejectUnauthorized: false },
});

async function initDatabase() {
  try {
    // Citește schema.sql
    const schemaPath = path.join(path.dirname(new URL(import.meta.url).pathname), '../documentatie/schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf-8');

    // Execută schema.sql
    console.log('📋 Executând schema.sql...');
    await pool.query(schema);
    console.log('✅ Schema creată cu succes!\n');

    await pool.end();
  } catch (error) {
    console.error('❌ Eroare la crearea schemei:', error.message);
    process.exit(1);
  }
}

initDatabase();
