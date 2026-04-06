// seed.js - Production Database Seeding Script
// Reads configuration from .env file
// Usage: npm run seed
 
import dotenv from 'dotenv';
dotenv.config();
import { Pool } from 'pg';
import { 
    seedUsers, 
    seedDoctors, 
    seedHospitals, 
    seedPatients, 
    seedProcedures, 
    seedMetrics, 
    seedMetricThresholds, 
    seedCheckIns, 
    seedClinicalMeasurements, 
    seedPhotos, 
    seedQuestionnaireTemplates, 
    seedQuestions, 
    seedQuestionnaireAssignments, 
    seedQuestionnaireResponses, 
    seedAlerts } from './seedData.js';

console.log("DATABASE_URL =", process.env.DATABASE_URL);
 
const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: { rejectUnauthorized: false },
});

pool.connect()
  .then(() => console.log("conectat la baza de date!"))
  .catch((err) => console.error("eroare la conectare:", err.message));

const tables = [
  'hospitals',
  'users',
  'doctors',
  'patients',
  'procedures',
  'metrics',
  'questionnaire_templates',
  'questions',
  'check_ins',
  'clinical_measurements',
  'photos',
  'metric_thresholds',
  'questionnaire_assignments',
  'questionnaire_responses',
  'alerts',
];

async function queryDatabase(text, params = []) {
  const client = await pool.connect();
  try {
    // seteaza schema postopcare 
    await client.query('SET search_path TO postopcare');
    return await client.query(text, params);
  } finally {
    client.release();
  }
}

async function checkConnection() {
  try {
    await queryDatabase('SELECT 1');
    console.log('Conexiune OK\n');
    return true;
  } catch (error) {
    console.error('Eroare conexiune:', error.message);
    return false;
  }
}

// Delete existing data from DB before insert
async function clearDatabase() {
  try {
    const truncateQuery = `
      TRUNCATE TABLE alerts, questionnaire_responses, questionnaire_assignments, 
                     questions, questionnaire_templates, photos, clinical_measurements, 
                     check_ins, metric_thresholds, procedures, patients, doctors, 
                     users, hospitals, metrics 
      RESTART IDENTITY CASCADE;
    `;
    await queryDatabase(truncateQuery);
    console.log('Baza de date a fost curatata\n');
  } catch (error) {
    console.error('Eroare la curatarea bazei de date:', error.message);
  }
}

function formatInsertQuery(table, rows) {
  if (!rows.length) return null;

  const columns = Object.keys(rows[0]);
  const values = rows.flatMap((row) => columns.map((column) => row[column]));
  const placeholders = rows
    .map((_, rowIndex) =>
      `(${columns.map((_, colIndex) => `$${rowIndex * columns.length + colIndex + 1}`).join(', ')})`
    )
    .join(', ');

  const text = `INSERT INTO ${table} (${columns.join(', ')}) VALUES ${placeholders}`;
  return { text, values };
}

async function insertRows(table, rows) {
  if (!rows.length) return;

  const query = formatInsertQuery(table, rows);
  if (!query) return;

  await queryDatabase(query.text, query.values);
}


// Seed data
async function seedData() {
  try {
    await insertRows('hospitals', seedHospitals);
    await insertRows('users', seedUsers);
    await insertRows('doctors', seedDoctors);
    await insertRows('patients', seedPatients);
    await insertRows('procedures', seedProcedures);
    await insertRows('metrics', seedMetrics);
    await insertRows('questionnaire_templates', seedQuestionnaireTemplates);
    await insertRows('questions', seedQuestions);
    await insertRows('check_ins', seedCheckIns);
    await insertRows('clinical_measurements', seedClinicalMeasurements);
    await insertRows('photos', seedPhotos);
    await insertRows('metric_thresholds', seedMetricThresholds);
    await insertRows('questionnaire_assignments', seedQuestionnaireAssignments);
    await insertRows('questionnaire_responses', seedQuestionnaireResponses);
    await insertRows('alerts', seedAlerts);
    console.log('Datele de test au fost inserate cu succes\n');
    process.exit(0);
  } catch (error) {
    console.error('Eroare la inserarea datelor de test:', error.message);
    process.exit(1);
  }
}

// Main function to run the seeding process
async function main() {
    const isConnected = await checkConnection();
    if (!isConnected) {
        console.error('Probleme de conexiune, inserarea nu s-a efectuat.');
        await pool.end();
        process.exit(1);
    }

    await clearDatabase();
    await seedData();
    await pool.end();
    process.exit(0);
}
 
// Run the main function
main();