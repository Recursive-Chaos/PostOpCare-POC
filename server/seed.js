// seed.js - Production Database Seeding Script
// Reads configuration from .env file
// Usage: npm run seed
 
import dotenv from 'dotenv';
 
// Load .env file
dotenv.config();
 
//Configuration
const DB_HOST = process.env.DB_HOST;
const DB_PORT = process.env.DB_PORT;
const DB_NAME = process.env.DB_NAME;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_URL = process.env.DATABASE_URL;

// Check connection
async function checkConnection() {
  try {
    const { error } = await supabase
      .from('users')
      .select()
      .limit(0);
    
    if (error) {
      throw error;
    }
    
    console.log('✅ Conexiune OK\n');
    return true;
    
  } catch (error) {
    console.error('❌ Eroare conexiune:', error.message);
    return false;
  }
}

// Delete existing data from DB before insert
async function clearDatabase() {
    const tables = [
        'users', 
        'doctors', 
        'hospitals', 
        'patients', 
        'procedures', 
        'metrics', 
        'metric_thresholds', 
        'check_ins', 
        'clinical_measurements', 
        'photos', 
        'questionnaire_templates', 
        'questions', 
        'questionnaire_assignments', 
        'questionnaire_responses', 
        'alerts'];

    try{
        for (const table of tables) {
            const { error } = await supabase
                .from(table)
                .delete()
                .neq('id', '');
            if (error) {
                throw error;
            }
        }
        console.log('✅ Baza de date a fost curatata\n');
    } catch (error) {
        console.error('❌ Eroare la curatarea bazei de date:', error.message);
    }
}
