// seedData.js - Dummy Data for PostopCare Database
// Data is generated using AI tools (claude.ai) and manually refined for realism

import { v4 as uuidv4 } from 'uuid';

// ═══════════════════════════════════════════════════════════════
// 1. HOSPITALS
// ═══════════════════════════════════════════════════════════════

export const seedHospitals = [
  {
    hospital_id: uuidv4(),
    hospital_name: 'Spitalul Clinic Judetean de Urgenta Timisoara',
    hospital_address: 'str. Iosif Nemoianu nr. 2, Timisoara',
  },
  {
    hospital_id: uuidv4(),
    hospital_name: 'Spitalul Municipal Timisoara',
    hospital_address: 'str. Aries nr. 1, Timisoara',
  },
];

// Store hospital IDs for references
const hospital1Id = seedHospitals[0].hospital_id;
const hospital2Id = seedHospitals[1].hospital_id;

// ═══════════════════════════════════════════════════════════════
// 2. USERS (Doctors + Patients)
// ═══════════════════════════════════════════════════════════════

// Doctor 1
const doctor1Id = uuidv4();
const doctor2Id = uuidv4();

// Patients for Doctor 1 (6 patients)
const patient1Doctor1Id = uuidv4();
const patient2Doctor1Id = uuidv4();
const patient3Doctor1Id = uuidv4();
const patient4Doctor1Id = uuidv4();
const patient5Doctor1Id = uuidv4();
const patient6Doctor1Id = uuidv4();

// Patients for Doctor 2 (5 patients)
const patient1Doctor2Id = uuidv4();
const patient2Doctor2Id = uuidv4();
const patient3Doctor2Id = uuidv4();
const patient4Doctor2Id = uuidv4();
const patient5Doctor2Id = uuidv4();

export const seedUsers = [
  // DOCTORS
  {
    user_id: doctor1Id,
    email: 'dr.popescu@hospital.com',
    password_hash: '$2b$12$KIXxPfxQc8LMxB2V5eK8fe8rP3p3K5Q1R5Q1R5Q1R5Q1R5Q1R5Q1R', // hashed: password123
    role: 'doctor',
    first_name: 'Ion',
    last_name: 'Popescu',
    phone: '+40123456789',
    created_at: new Date('2024-01-15').toISOString(),
    is_active: true,
  },
  {
    user_id: doctor2Id,
    email: 'dr.ionescu@hospital.com',
    password_hash: '$2b$12$KIXxPfxQc8LMxB2V5eK8fe8rP3p3K5Q1R5Q1R5Q1R5Q1R5Q1R5Q1R',
    role: 'doctor',
    first_name: 'Emilia',
    last_name: 'Ionescu',
    phone: '+40987654321',
    created_at: new Date('2024-01-20').toISOString(),
    is_active: true,
  },
  // PATIENTS - Doctor 1
  {
    user_id: patient1Doctor1Id,
    email: 'ion.muresan@email.com',
    password_hash: '$2b$12$KIXxPfxQc8LMxB2V5eK8fe8rP3p3K5Q1R5Q1R5Q1R5Q1R5Q1R5Q1R',
    role: 'patient',
    first_name: 'Ion',
    last_name: 'Muresan',
    phone: '+401111111111',
    created_at: new Date('2024-02-01').toISOString(),
    is_active: true,
  },
  {
    user_id: patient2Doctor1Id,
    email: 'sara.pop@email.com',
    password_hash: '$2b$12$KIXxPfxQc8LMxB2V5eK8fe8rP3p3K5Q1R5Q1R5Q1R5Q1R5Q1R5Q1R',
    role: 'patient',
    first_name: 'Sara',
    last_name: 'Pop',
    phone: '+401111111112',
    created_at: new Date('2024-02-05').toISOString(),
    is_active: true,
  },
  {
    user_id: patient3Doctor1Id,
    email: 'michael.davis@email.com',
    password_hash: '$2b$12$KIXxPfxQc8LMxB2V5eK8fe8rP3p3K5Q1R5Q1R5Q1R5Q1R5Q1R5Q1R',
    role: 'patient',
    first_name: 'Mihai',
    last_name: 'Davidescu',
    phone: '+401111111113',
    created_at: new Date('2024-02-10').toISOString(),
    is_active: true,
  },
  {
    user_id: patient4Doctor1Id,
    email: 'emma.brown@email.com',
    password_hash: '$2b$12$KIXxPfxQc8LMxB2V5eK8fe8rP3p3K5Q1R5Q1R5Q1R5Q1R5Q1R5Q1R',
    role: 'patient',
    first_name: 'Emma',
    last_name: 'Brown',
    phone: '+1111111114',
    created_at: new Date('2024-02-15').toISOString(),
    is_active: true,
  },
  {
    user_id: patient5Doctor1Id,
    email: 'david.gavrilescu@email.com',
    password_hash: '$2b$12$KIXxPfxQc8LMxB2V5eK8fe8rP3p3K5Q1R5Q1R5Q1R5Q1R5Q1R5Q1R',
    role: 'patient',
    first_name: 'David',
    last_name: 'Gavrilescu',
    phone: '+401111111115',
    created_at: new Date('2024-02-20').toISOString(),
    is_active: true,
  },
  {
    user_id: patient6Doctor1Id,
    email: 'denisa.muntean@email.com',
    password_hash: '$2b$12$KIXxPfxQc8LMxB2V5eK8fe8rP3p3K5Q1R5Q1R5Q1R5Q1R5Q1R5Q1R',
    role: 'patient',
    first_name: 'Denisa',
    last_name: 'Muntean',
    phone: '+401111111116',
    created_at: new Date('2024-02-25').toISOString(),
    is_active: true,
  },
  // PATIENTS - Doctor 2
  {
    user_id: patient1Doctor2Id,
    email: 'milici.dragan@email.com',
    password_hash: '$2b$12$KIXxPfxQc8LMxB2V5eK8fe8rP3p3K5Q1R5Q1R5Q1R5Q1R5Q1R5Q1R',
    role: 'patient',
    first_name: 'Milici',
    last_name: 'Dragan',
    phone: '+401222222221',
    created_at: new Date('2024-03-01').toISOString(),
    is_active: true,
  },
  {
    user_id: patient2Doctor2Id,
    email: 'vlad.martis@email.com',
    password_hash: '$2b$12$KIXxPfxQc8LMxB2V5eK8fe8rP3p3K5Q1R5Q1R5Q1R5Q1R5Q1R5Q1R',
    role: 'patient',
    first_name: 'Vlad',
    last_name: 'Martis',
    phone: '+401222222222',
    created_at: new Date('2024-03-05').toISOString(),
    is_active: true,
  },
  {
    user_id: patient3Doctor2Id,
    email: 'cristian.albu@email.com',
    password_hash: '$2b$12$KIXxPfxQc8LMxB2V5eK8fe8rP3p3K5Q1R5Q1R5Q1R5Q1R5Q1R5Q1R',
    role: 'patient',
    first_name: 'Cristian',
    last_name: 'Albu',
    phone: '+401222222223',
    created_at: new Date('2024-03-10').toISOString(),
    is_active: true,
  },
  {
    user_id: patient4Doctor2Id,
    email: 'jessica.moldovan@email.com',
    password_hash: '$2b$12$KIXxPfxQc8LMxB2V5eK8fe8rP3p3K5Q1R5Q1R5Q1R5Q1R5Q1R5Q1R',
    role: 'patient',
    first_name: 'Jessica',
    last_name: 'Moldovan',
    phone: '+401222222224',
    created_at: new Date('2024-03-15').toISOString(),
    is_active: true,
  },
  {
    user_id: patient5Doctor2Id,
    email: 'eduard.ionescu@email.com',
    password_hash: '$2b$12$KIXxPfxQc8LMxB2V5eK8fe8rP3p3K5Q1R5Q1R5Q1R5Q1R5Q1R5Q1R',
    role: 'patient',
    first_name: 'Eduard',
    last_name: 'Ionescu',
    phone: '+401222222225',
    created_at: new Date('2024-03-20').toISOString(),
    is_active: true,
  },
];

// ═══════════════════════════════════════════════════════════════
// 3. DOCTORS
// ═══════════════════════════════════════════════════════════════

export const seedDoctors = [
  {
    user_id: doctor1Id,
    specialization: 'Chirurgie Ortopedica',
    hospital_id: hospital1Id,
    bio: 'Chirurg ortoped cu experienta de peste 15 ani in inlocuirea articulatiilor si medicina sportiva.',
    notification_pref: 'email',
  },
  {
    user_id: doctor2Id,
    specialization: 'Chirurgie Generala',
    hospital_id: hospital2Id,
    bio: 'Chirurg general cu experienta in ingrijirea post-operatorie si gestionarea recuperarii pacientilor.',
    notification_pref: 'email',
  },
];

// ═══════════════════════════════════════════════════════════════
// 4. PATIENTS
// ═══════════════════════════════════════════════════════════════

export const seedPatients = [
  // Doctor 1's patients
  {
    user_id: patient1Doctor1Id,
    doctor_id: doctor1Id,
    date_of_birth: '1965-03-15',
    notes: 'Post interventie de inlocuire a genunchiului. Progres bun in recuperare.',
  },
  {
    user_id: patient2Doctor1Id,
    doctor_id: doctor1Id,
    date_of_birth: '1978-07-22',
    notes: 'Post interventie de reparatie a ligamentului cruciat anterior. Stil de viata activ.',
  },
  {
    user_id: patient3Doctor1Id,
    doctor_id: doctor1Id,
    date_of_birth: '1952-11-08',
    notes: 'Post interventie de inlocuire a articulatiei coapsei. Mobilitatea se imbunatateste bine.',
  },
  {
    user_id: patient4Doctor1Id,
    doctor_id: doctor1Id,
    date_of_birth: '1985-01-30',
    notes: 'Post interventie de reparatie a meniscului. Unele inflamatiuni raportate.',
  },
  {
    user_id: patient5Doctor1Id,
    doctor_id: doctor1Id,
    date_of_birth: '1970-05-12',
    notes: 'Post interventie de reparatie a rotator cuffului. Physiotherapy ongoing.',
  },
  {
    user_id: patient6Doctor1Id,
    doctor_id: doctor1Id,
    date_of_birth: '1988-09-25',
    notes: 'Post interventie de reparatie a fracturii de wrist. Traiectorie excelenta de vindecare.',
  },
  // Doctor 2's patients
  {
    user_id: patient1Doctor2Id,
    doctor_id: doctor2Id,
    date_of_birth: '1960-02-14',
    notes: 'Post interventie de chirurgie abdominala. Ingrijire standard post-op.',
  },
  {
    user_id: patient2Doctor2Id,
    doctor_id: doctor2Id,
    date_of_birth: '1975-06-18',
    notes: 'Appendectomy. Recovering well, minimal pain.',
  },
  {
    user_id: patient3Doctor2Id,
    doctor_id: doctor2Id,
    date_of_birth: '1980-10-03',
    notes: 'Post interventie de reparatie a herniei. Nici o complicatie raportata.',
  },
  {
    user_id: patient4Doctor2Id,
    doctor_id: doctor2Id,
    date_of_birth: '1972-04-27',
    notes: 'Post interventie de eliminare a colecistului. Stare generala post-operatorie gestionata.',
  },
  {
    user_id: patient5Doctor2Id,
    doctor_id: doctor2Id,
    date_of_birth: '1983-12-11',
    notes: 'Post interventie de chirurgie minora. Recuperare rapida.',
  },
];

// ═══════════════════════════════════════════════════════════════
// 5. PROCEDURES
// ═══════════════════════════════════════════════════════════════

const procedure1Id = 1;
const procedure2Id = 2;
const procedure3Id = 3;
const procedure4Id = 4;
const procedure5Id = 5;
const procedure6Id = 6;
const procedure7Id = 7;
const procedure8Id = 8;
const procedure9Id = 9;
const procedure10Id = 10;
const procedure11Id = 11;

export const seedProcedures = [
  // Doctor 1's procedures - in romanian
  {
    procedure_id: procedure1Id,
    patient_id: patient1Doctor1Id,
    surgery_type: 'Inlocuire totala a genunchiului',
    surgery_date: '2024-03-01',
    discharge_date: '2024-03-05',
    monitoring_end_date: '2024-04-01',
  },
  {
    procedure_id: procedure2Id,
    patient_id: patient2Doctor1Id,
    surgery_type: 'Reparatie a ligamentului incrucisat anterior',
    surgery_date: '2024-03-08',
    discharge_date: '2024-03-10',
    monitoring_end_date: '2024-04-08',
  },
  {
    procedure_id: procedure3Id,
    patient_id: patient3Doctor1Id,
    surgery_type: 'Inlocuire totala a soldului',
    surgery_date: '2024-02-20',
    discharge_date: '2024-02-25',
    monitoring_end_date: '2024-03-20',
  },
  {
    procedure_id: procedure4Id,
    patient_id: patient4Doctor1Id,
    surgery_type: 'Reparatie a meniscului',
    surgery_date: '2024-03-15',
    discharge_date: '2024-03-16',
    monitoring_end_date: '2024-04-15',
  },
  {
    procedure_id: procedure5Id,
    patient_id: patient5Doctor1Id,
    surgery_type: 'Reparatie coafa rotatorului',
    surgery_date: '2024-03-10',
    discharge_date: '2024-03-12',
    monitoring_end_date: '2024-04-10',
  },
  {
    procedure_id: procedure6Id,
    patient_id: patient6Doctor1Id,
    surgery_type: 'Reparatie fractura de incheietura',
    surgery_date: '2024-02-15',
    discharge_date: '2024-02-16',
    monitoring_end_date: '2024-03-15',
  },
  // Doctor 2's procedures
  {
    procedure_id: procedure7Id,
    patient_id: patient1Doctor2Id,
    surgery_type: 'Interventie abdominala',
    surgery_date: '2024-02-28',
    discharge_date: '2024-03-03',
    monitoring_end_date: '2024-03-28',
  },
  {
    procedure_id: procedure8Id,
    patient_id: patient2Doctor2Id,
    surgery_type: 'Apendicectomie',
    surgery_date: '2024-03-12',
    discharge_date: '2024-03-14',
    monitoring_end_date: '2024-04-12',
  },
  {
    procedure_id: procedure9Id,
    patient_id: patient3Doctor2Id,
    surgery_type: 'Operatie de hernie',
    surgery_date: '2024-03-05',
    discharge_date: '2024-03-07',
    monitoring_end_date: '2024-04-05',
  },
  {
    procedure_id: procedure10Id,
    patient_id: patient4Doctor2Id,
    surgery_type: 'Colecistectomie',
    surgery_date: '2024-03-18',
    discharge_date: '2024-03-19',
    monitoring_end_date: '2024-04-18',
  },
  {
    procedure_id: procedure11Id,
    patient_id: patient5Doctor2Id,
    surgery_type: 'Interventie chirurgicala minora',
    surgery_date: '2024-03-20',
    discharge_date: '2024-03-21',
    monitoring_end_date: '2024-04-20',
  },
];

// ═══════════════════════════════════════════════════════════════
// 6. METRICS
// ═══════════════════════════════════════════════════════════════

const metricPainId = 1;
const metricSwellingId = 2;
const metricROMId = 3;
const metricWoundId = 4;
const metricTemperatureId = 5;
const metricHeartRateId = 6;
const metricBloodPressureId = 7;

export const seedMetrics = [
  {
    metric_id: metricPainId,
    metric_name: 'pain_level',
    display_name: 'Nivel de durere',
    unit: 'scara 0-10',
    min_value: 0,
    max_value: 10,
    description: 'Intensitatea durerii raportata de pacient. 0 - fara durere, 10 - durere maxima',
    created_at: new Date('2024-01-01').toISOString(),
  },
  {
    metric_id: metricSwellingId,
    metric_name: 'swelling_level',
    display_name: 'Nivel de umflare',
    unit: 'scara 0-10',
    min_value: 0,
    max_value: 10,
    description: 'Umflarea aproximata la locul operatiei. 0 - fara umflare, 10 - umflare severa',
    created_at: new Date('2024-01-01').toISOString(),
  },
  {
    metric_id: metricROMId,
    metric_name: 'range_of_motion',
    display_name: 'Mobilitate',
    unit: 'scara 0-10',
    min_value: 0,
    max_value: 10,
    description: 'Mobilitatea articulatiei operate, raportata de pacient. 0 - fara mobilitate, 10 - mobilitate completa',
    created_at: new Date('2024-01-01').toISOString(),
  },
  {
    metric_id: metricWoundId,
    metric_name: 'wound_condition',
    display_name: 'Starea ranii',
    unit: 'nivel 0-10',
    min_value: 0,
    max_value: 10,
    description: 'Evaluarea procesului de vindecare. 0 - vindecare completa, 10 - complicatii severe (infectie, dehiscenta)',
    created_at: new Date('2024-01-01').toISOString(),
  },
  {
    metric_id: metricTemperatureId,
    metric_name: 'body_temperature',
    display_name: 'Temperatura corpului',
    unit: '°C',
    min_value: 36,
    max_value: 39,
    description: 'Temperatura corpului exprimata in grade Celsius. Valori normale post-operatorii sunt intre 36.5 si 37.5 °C',
    created_at: new Date('2024-01-01').toISOString(),
  },
  {
    metric_id: metricHeartRateId,
    metric_name: 'heart_rate',
    display_name: 'Frecventa cardiaca',
    unit: 'bpm',
    min_value: 40,
    max_value: 120,
    description: 'Frecventa cardiaca exprimata in batai pe minut. Valori normale post-operatorii sunt intre 60 si 100 bpm',
    created_at: new Date('2024-01-01').toISOString(),
  },
  {
    metric_id: metricBloodPressureId,
    metric_name: 'blood_pressure',
    display_name: 'Tensiunea arteriala',
    unit: 'mmHg',
    min_value: 90,
    max_value: 180,
    description: 'Tensiunea arteriala sistolica exprimata in mmHg. Valori normale post-operatorii sunt intre 110 si 140 mmHg',
    created_at: new Date('2024-01-01').toISOString(),
  },
];

// ═══════════════════════════════════════════════════════════════
// 7. METRIC THRESHOLDS
// ═══════════════════════════════════════════════════════════════

const threshold1Id = 1;
const threshold2Id = 2;
const threshold3Id = 3;
const threshold4Id = 4;
const threshold5Id = 5;
const threshold6Id = 6;
const threshold7Id = 7;

export const seedMetricThresholds = [
  // ===================== PAIN (0–10) =====================
  {
    metric_id: metricPainId,
    severity: 'low',
    min_value: 0,
    max_value: 3,
    label: 'Durere usoara',
    message: 'Durere in limite normale post-operatorii.',
    notify_doctor: false,
  },
  {
    metric_id: metricPainId,
    severity: 'medium',
    min_value: 4,
    max_value: 6,
    label: 'Durere moderata',
    message: 'Durere moderata, necesita monitorizare.',
    notify_doctor: false,
  },
  {
    metric_id: metricPainId,
    severity: 'high',
    min_value: 7,
    max_value: 9,
    label: 'Durere intensa',
    message: 'Durere crescuta, evaluare recomandata.',
    notify_doctor: true,
  },
  {
    metric_id: metricPainId,
    severity: 'urgent',
    min_value: 10,
    max_value: 10,
    label: 'Durere severa',
    message: 'Durere extrema, interventie imediata.',
    notify_doctor: true,
  },

  // ===================== SWELLING (0–10) =====================
  {
    metric_id: metricSwellingId,
    severity: 'low',
    min_value: 0,
    max_value: 3,
    label: 'Umflare usoara',
    message: 'Inflamatie normala.',
    notify_doctor: false,
  },
  {
    metric_id: metricSwellingId,
    severity: 'medium',
    min_value: 4,
    max_value: 6,
    label: 'Umflare moderata',
    message: 'Inflamatie moderata.',
    notify_doctor: false,
  },
  {
    metric_id: metricSwellingId,
    severity: 'high',
    min_value: 7,
    max_value: 9,
    label: 'Umflare severa',
    message: 'Inflamatie ridicata.',
    notify_doctor: true,
  },
  {
    metric_id: metricSwellingId,
    severity: 'urgent',
    min_value: 10,
    max_value: 10,
    label: 'Umflare critica',
    message: 'Inflamatie severa, risc de complicatii.',
    notify_doctor: true,
  },

  // ===================== ROM (0–10, invers logic!) =====================
  // ATENTIE: aici 0 = rau, 10 = bun → invers fata de pain
  {
    metric_id: metricROMId,
    severity: 'urgent',
    min_value: 0,
    max_value: 2,
    label: 'Mobilitate critica',
    message: 'Mobilitate extrem de redusa.',
    notify_doctor: true,
  },
  {
    metric_id: metricROMId,
    severity: 'high',
    min_value: 3,
    max_value: 5,
    label: 'Mobilitate redusa',
    message: 'Recuperare sub asteptari.',
    notify_doctor: true,
  },
  {
    metric_id: metricROMId,
    severity: 'medium',
    min_value: 6,
    max_value: 8,
    label: 'Mobilitate moderata',
    message: 'Progres bun.',
    notify_doctor: false,
  },
  {
    metric_id: metricROMId,
    severity: 'low',
    min_value: 9,
    max_value: 10,
    label: 'Mobilitate buna',
    message: 'Recuperare foarte buna.',
    notify_doctor: false,
  },

  // ===================== WOUND (0–10, invers) =====================
  {
    metric_id: metricWoundId,
    severity: 'low',
    min_value: 0,
    max_value: 2,
    label: 'Vindecare buna',
    message: 'Vindecare normala.',
    notify_doctor: false,
  },
  {
    metric_id: metricWoundId,
    severity: 'medium',
    min_value: 3,
    max_value: 5,
    label: 'Vindecare lenta',
    message: 'Necesita monitorizare.',
    notify_doctor: false,
  },
  {
    metric_id: metricWoundId,
    severity: 'high',
    min_value: 6,
    max_value: 8,
    label: 'Probleme vindecare',
    message: 'Posibile complicatii.',
    notify_doctor: true,
  },
  {
    metric_id: metricWoundId,
    severity: 'urgent',
    min_value: 9,
    max_value: 10,
    label: 'Complicatii severe',
    message: 'Risc de infectie sau dehiscenta.',
    notify_doctor: true,
  },

  // ===================== TEMPERATURE =====================
  {
    metric_id: metricTemperatureId,
    severity: 'low',
    min_value: 36,
    max_value: 37.5,
    label: 'Normal',
    message: 'Temperatura normala.',
    notify_doctor: false,
  },
  {
    metric_id: metricTemperatureId,
    severity: 'medium',
    min_value: 37.6,
    max_value: 38.4,
    label: 'Subfebrilitate',
    message: 'Posibila inflamatie.',
    notify_doctor: false,
  },
  {
    metric_id: metricTemperatureId,
    severity: 'high',
    min_value: 38.5,
    max_value: 39,
    label: 'Febra',
    message: 'Posibila infectie.',
    notify_doctor: true,
  },
  {
    metric_id: metricTemperatureId,
    severity: 'urgent',
    min_value: 39.1,
    max_value: null,
    label: 'Febra severa',
    message: 'Risc major de infectie.',
    notify_doctor: true,
  },

  // ===================== HEART RATE =====================
  {
    metric_id: metricHeartRateId,
    severity: 'low',
    min_value: 60,
    max_value: 100,
    label: 'Normal',
    message: 'Ritm cardiac normal.',
    notify_doctor: false,
  },
  {
    metric_id: metricHeartRateId,
    severity: 'medium',
    min_value: 50,
    max_value: 59,
    label: 'Usor scazut',
    message: 'Bradicardie usoara.',
    notify_doctor: false,
  },
  {
    metric_id: metricHeartRateId,
    severity: 'high',
    min_value: 101,
    max_value: 120,
    label: 'Crescut',
    message: 'Tahicardie.',
    notify_doctor: true,
  },
  {
    metric_id: metricHeartRateId,
    severity: 'urgent',
    min_value: 121,
    max_value: null,
    label: 'Critic',
    message: 'Risc cardiovascular.',
    notify_doctor: true,
  },

  // ===================== BLOOD PRESSURE (systolic) =====================
  {
    metric_id: metricBloodPressureId,
    severity: 'low',
    min_value: 110,
    max_value: 140,
    label: 'Normal',
    message: 'Tensiune in limite normale.',
    notify_doctor: false,
  },
  {
    metric_id: metricBloodPressureId,
    severity: 'medium',
    min_value: 90,
    max_value: 109,
    label: 'Scazuta',
    message: 'Hipotensiune usoara.',
    notify_doctor: false,
  },
  {
    metric_id: metricBloodPressureId,
    severity: 'high',
    min_value: 141,
    max_value: 160,
    label: 'Crescuta',
    message: 'Hipertensiune moderata.',
    notify_doctor: true,
  },
  {
    metric_id: metricBloodPressureId,
    severity: 'urgent',
    min_value: 161,
    max_value: null,
    label: 'Hipertensiune severa',
    message: 'Risc cardiovascular major.',
    notify_doctor: true,
  },
];

// ═══════════════════════════════════════════════════════════════
// 8. CHECK-INS (Last 14 days for each patient)
// ═══════════════════════════════════════════════════════════════

// Helper: Generate check-ins for last 14 days
function generateCheckInsForPatient(patientId, procedureId, startDate = null) {
  const checkIns = [];
  const now = new Date();
  
  // Last 14 days
  for (let i = 14; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    checkIns.push({
      patient_id: patientId,
      procedure_id: procedureId,
      submitted_at: date.toISOString(),
      general_notes: i % 3 === 0 ? 'Progres recuparare' : 'Check-in regulat',
    });
  }
  
  return checkIns;
}

const checkInsData = [
  ...generateCheckInsForPatient(patient1Doctor1Id, procedure1Id),
  ...generateCheckInsForPatient(patient2Doctor1Id, procedure2Id),
  ...generateCheckInsForPatient(patient3Doctor1Id, procedure3Id),
  ...generateCheckInsForPatient(patient4Doctor1Id, procedure4Id),
  ...generateCheckInsForPatient(patient5Doctor1Id, procedure5Id),
  ...generateCheckInsForPatient(patient6Doctor1Id, procedure6Id),
  ...generateCheckInsForPatient(patient1Doctor2Id, procedure7Id),
  ...generateCheckInsForPatient(patient2Doctor2Id, procedure8Id),
  ...generateCheckInsForPatient(patient3Doctor2Id, procedure9Id),
  ...generateCheckInsForPatient(patient4Doctor2Id, procedure10Id),
  ...generateCheckInsForPatient(patient5Doctor2Id, procedure11Id),
];

// Add IDs
export const seedCheckIns = checkInsData.map((checkIn, index) => ({
  checkin_id: index + 1,
  ...checkIn,
}));

// ═══════════════════════════════════════════════════════════════
// 9. CLINICAL MEASUREMENTS
// ═══════════════════════════════════════════════════════════════

// Helper: Generate measurements with variation
function generateMeasurementsForCheckIns(checkInIds, metrics) {
  const measurements = [];
  let id = 1;
  
  checkInIds.forEach(checkinId => {
    // Pain level (varies 2-8)
    measurements.push({
      measurement_id: id++,
      checkin_id: checkinId,
      metric_id: metricPainId,
      metric_value: Math.random() * 6 + 2,
      unit: '1-10 scale',
      recorded_at: new Date().toISOString(),
    });
    
    // Swelling (varies 20-120)
    measurements.push({
      measurement_id: id++,
      checkin_id: checkinId,
      metric_id: metricSwellingId,
      metric_value: Math.random() * 100 + 20,
      unit: '1-10 scale',
      recorded_at: new Date().toISOString(),
    });
    
    // Range of motion (improves over time: 0-10)
    const daysAgo = Math.floor(Math.random() * 14);
    const baseROM = 0 + (daysAgo * 5);
    measurements.push({
      measurement_id: id++,
      checkin_id: checkinId,
      metric_id: metricROMId,
      metric_value: Math.min(10, baseROM + Math.random() * 10),
      unit: '1-10 scale',
      recorded_at: new Date().toISOString(),
    });
    
    // Wound condition (0-10, improving)
    measurements.push({
      measurement_id: id++,
      checkin_id: checkinId,
      metric_id: metricWoundId,
      metric_value: 5 + Math.random() * 4,
      unit: 'assessment',
      recorded_at: new Date().toISOString(),
    });
    
    // Temperature (36.5-37.5 normal)
    measurements.push({
      measurement_id: id++,
      checkin_id: checkinId,
      metric_id: metricTemperatureId,
      metric_value: 36.8 + Math.random() * 0.8,
      unit: '°C',
      recorded_at: new Date().toISOString(),
    });
    
    // Heart rate (60-90 normal)
    measurements.push({
      measurement_id: id++,
      checkin_id: checkinId,
      metric_id: metricHeartRateId,
      metric_value: 60 + Math.random() * 30,
      unit: 'bpm',
      recorded_at: new Date().toISOString(),
    });
    
    // Blood pressure (systolic 110-140)
    measurements.push({
      measurement_id: id++,
      checkin_id: checkinId,
      metric_id: metricBloodPressureId,
      metric_value: 110 + Math.random() * 30,
      unit: 'mmHg',
      recorded_at: new Date().toISOString(),
    });
  });
  
  return measurements;
}

export const seedClinicalMeasurements = generateMeasurementsForCheckIns(
  seedCheckIns.map(ci => ci.checkin_id),
  seedMetrics
);

// ═══════════════════════════════════════════════════════════════
// 10. PHOTOS
// ═══════════════════════════════════════════════════════════════

function generatePhotosForCheckIns(checkInIds) {
  const photos = [];
  let id = 1;
  
  // ~30% of check-ins have photos
  // these photos are not actual image files, but represent the metadata that would be stored in the database for each photo associated with a check-in
  checkInIds.forEach(checkinId => {
    if (Math.random() < 0.3) {
      const photoCount = Math.random() < 0.6 ? 1 : 2;
      for (let i = 0; i < photoCount; i++) {
        photos.push({
          photo_id: id++,
          checkin_id: checkinId,
          storage_path: `photos/checkin_${checkinId}_photo_${i + 1}.jpg`,
          photo_type: Math.random() < 0.8 ? 'wound' : 'general',
          uploaded_at: new Date().toISOString(),
          doctor_reviewed: Math.random() < 0.7,
        });
      }
    }
  });
  
  return photos;
}

export const seedPhotos = generatePhotosForCheckIns(
  seedCheckIns.map(ci => ci.checkin_id)
);

// ═══════════════════════════════════════════════════════════════
// 11. QUESTIONNAIRE TEMPLATES
// ═══════════════════════════════════════════════════════════════

const template1Id = 1;
const template2Id = 2;

export const seedQuestionnaireTemplates = [
  {
    template_id: template1Id,
    doctor_id: doctor1Id,
    title: 'Instrument de evaluare pentru recuperare ortopedica',
    description: 'Evaluare zilnica pentru pacientii ortopedici, acoperind durerea, umflarea, mobilitatea si starea ranii',
    is_public: true,
    created_at: new Date('2024-01-01').toISOString(),
  },
  {
    template_id: template2Id,
    doctor_id: doctor2Id,
    title: 'Chirurgie generala - evaluare post-operatorie',
    description: 'Evaluare post-operatorie pentru chirurgia generala',
    is_public: true,
    created_at: new Date('2024-01-05').toISOString(),
  },
];

// ═══════════════════════════════════════════════════════════════
// 12. QUESTIONS
// ═══════════════════════════════════════════════════════════════

export const seedQuestions = [
  // Template 1 questions
  {
    question_id: 1,
    template_id: template1Id,
    question_text: 'Cum ai evalua nivelul de durere general?',
    answer_type: 'scale',
    options_json: JSON.stringify({ min: 0, max: 10, step: 1 }),
    order_index: 1,
  },
  {
    question_id: 2,
    template_id: template1Id,
    question_text: 'Ai experimentat vreo umflare la locul operatiei?',
    answer_type: 'boolean',
    options_json: JSON.stringify({ yes: true, no: false }),
    order_index: 2,
  },
  {
    question_id: 3,
    template_id: template1Id,
    question_text: 'Ai experimentat vreo scurgere din rana?',
    answer_type: 'boolean',
    options_json: null,
    order_index: 3,
  },
  {
    question_id: 4,
    template_id: template1Id,
    question_text: 'Te rog descrie nivelul tau actual de activitate',
    answer_type: 'choice',
    options_json: JSON.stringify(['Stau in pat', 'Activitate usoara', 'Activitate moderata', 'Activitate normala']),
    order_index: 4,
  },
  {
    question_id: 5,
    template_id: template1Id,
    question_text: 'Ai alte preocupari sau observatii?',
    answer_type: 'text',
    options_json: null,
    order_index: 5,
  },
  // Template 2 questions
  {
    question_id: 6,
    template_id: template2Id,
    question_text: 'Ai experimentat vreo greata sau varsaturi?',
    answer_type: 'boolean',
    options_json: null,
    order_index: 1,
  },
  {
    question_id: 7,
    template_id: template2Id,
    question_text: 'Ai avut o digestie normala dupa operatie?',
    answer_type: 'boolean',
    options_json: null,
    order_index: 2,
  },
  {
    question_id: 8,
    template_id: template2Id,
    question_text: 'Evalueaza apetitul de mancare (1-10)',
    answer_type: 'scale',
    options_json: JSON.stringify({ min: 0, max: 10, step: 1 }),
    order_index: 3,
  },
  {
    question_id: 9,
    template_id: template2Id,
    question_text: 'Ai semne de infectie (febra, frisoane, roseata)?',
    answer_type: 'boolean',
    options_json: null,
    order_index: 4,
  },
];

// ═══════════════════════════════════════════════════════════════
// 13. QUESTIONNAIRE ASSIGNMENTS
// ═══════════════════════════════════════════════════════════════

export const seedQuestionnaireAssignments = [
  // Doctor 1 assignments to patients
  {
    assignment_id: 1,
    patient_id: patient1Doctor1Id,
    template_id: template1Id,
    frequency: 'daily',
    start_date: '2024-03-01',
    end_date: '2024-04-01',
    is_active: true,
  },
  {
    assignment_id: 2,
    patient_id: patient2Doctor1Id,
    template_id: template1Id,
    frequency: 'daily',
    start_date: '2024-03-08',
    end_date: '2024-04-08',
    is_active: true,
  },
  {
    assignment_id: 3,
    patient_id: patient3Doctor1Id,
    template_id: template1Id,
    frequency: 'daily',
    start_date: '2024-02-20',
    end_date: '2024-03-20',
    is_active: false,
  },
  {
    assignment_id: 4,
    patient_id: patient4Doctor1Id,
    template_id: template1Id,
    frequency: 'daily',
    start_date: '2024-03-15',
    end_date: '2024-04-15',
    is_active: true,
  },
  {
    assignment_id: 5,
    patient_id: patient5Doctor1Id,
    template_id: template1Id,
    frequency: 'daily',
    start_date: '2024-03-10',
    end_date: '2024-04-10',
    is_active: true,
  },
  {
    assignment_id: 6,
    patient_id: patient6Doctor1Id,
    template_id: template1Id,
    frequency: 'daily',
    start_date: '2024-02-15',
    end_date: '2024-03-15',
    is_active: false,
  },
  // Doctor 2 assignments
  {
    assignment_id: 7,
    patient_id: patient1Doctor2Id,
    template_id: template2Id,
    frequency: 'daily',
    start_date: '2024-02-28',
    end_date: '2024-03-28',
    is_active: true,
  },
  {
    assignment_id: 8,
    patient_id: patient2Doctor2Id,
    template_id: template2Id,
    frequency: 'daily',
    start_date: '2024-03-12',
    end_date: '2024-04-12',
    is_active: true,
  },
  {
    assignment_id: 9,
    patient_id: patient3Doctor2Id,
    template_id: template2Id,
    frequency: 'daily',
    start_date: '2024-03-05',
    end_date: '2024-04-05',
    is_active: true,
  },
  {
    assignment_id: 10,
    patient_id: patient4Doctor2Id,
    template_id: template2Id,
    frequency: 'daily',
    start_date: '2024-03-18',
    end_date: '2024-04-18',
    is_active: true,
  },
  {
    assignment_id: 11,
    patient_id: patient5Doctor2Id,
    template_id: template2Id,
    frequency: 'daily',
    start_date: '2024-03-20',
    end_date: '2024-04-20',
    is_active: true,
  },
];

// ═══════════════════════════════════════════════════════════════
// 14. QUESTIONNAIRE RESPONSES
// ═══════════════════════════════════════════════════════════════

function generateResponsesForAssignments(assignments, checkIns, questions) {
  const responses = [];
  let id = 1;
  
  assignments.forEach(assignment => {
    // Get check-ins for this patient
    const patientCheckIns = checkIns.filter(ci => ci.patient_id === assignment.patient_id);
    
    // Get questions for this template
    const templateQuestions = questions.filter(q => q.template_id === assignment.template_id);
    
    patientCheckIns.forEach(checkIn => {
      templateQuestions.forEach(question => {
        let answerValue = '';
        
        switch (question.answer_type) {
          case 'scale':
            answerValue = Math.floor(Math.random() * 11).toString();
            break;
          case 'boolean':
            answerValue = Math.random() < 0.5 ? 'true' : 'false';
            break;
          case 'choice':
            const options = JSON.parse(question.options_json);
            answerValue = options[Math.floor(Math.random() * options.length)];
            break;
          case 'text':
            const textResponses = [
              'Feeling good',
              'Some discomfort',
              'No issues',
              'Slight improvement',
              'Managing well',
            ];
            answerValue = textResponses[Math.floor(Math.random() * textResponses.length)];
            break;
        }
        
        responses.push({
          response_id: id++,
          assignment_id: assignment.assignment_id,
          checkin_id: checkIn.checkin_id,
          question_id: question.question_id,
          answer_value: answerValue,
          answered_at: checkIn.submitted_at,
        });
      });
    });
  });
  
  return responses;
}

export const seedQuestionnaireResponses = generateResponsesForAssignments(
  seedQuestionnaireAssignments,
  seedCheckIns,
  seedQuestions
);

// ═══════════════════════════════════════════════════════════════
// 15. ALERTS
// ═══════════════════════════════════════════════════════════════

export const seedAlerts = [
  // Active alerts
  {
    alert_id: 1,
    threshold_id: threshold1Id,
    checkin_id: 15, // Recent check-in
    patient_id: patient1Doctor1Id,
    triggered_value: 8.5,
    severity: 'medium',
    triggered_at: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),
    status: 'new',
    acknowledged_at: null,
    doctor_notes: null,
  },
  {
    alert_id: 2,
    threshold_id: threshold3Id,
    checkin_id: 30,
    patient_id: patient2Doctor1Id,
    triggered_value: 8,
    severity: 'high',
    triggered_at: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(),
    status: 'acknowledged',
    acknowledged_at: new Date().toISOString(),
    doctor_notes: 'Inflamatie post-operatorie asteptata, monitorizare necesara',
  },
  {
    alert_id: 3,
    threshold_id: threshold4Id,
    checkin_id: 45,
    patient_id: patient4Doctor1Id,
    triggered_value: 38.7,
    severity: 'high',
    triggered_at: new Date(new Date().setDate(new Date().getDate() - 3)).toISOString(),
    status: 'resolved',
    acknowledged_at: new Date(new Date().setDate(new Date().getDate() - 3)).toISOString(),
    doctor_notes: 'Temperatura normalizata'
  },
  {
    alert_id: 4,
    threshold_id: threshold2Id,
    checkin_id: 60,
    patient_id: patient1Doctor2Id,
    triggered_value: 9.2,
    severity: 'urgent',
    triggered_at: new Date(new Date().setDate(new Date().getDate() - 4)).toISOString(),
    status: 'acknowledged',
    acknowledged_at: new Date(new Date().setDate(new Date().getDate() - 4)).toISOString(),
    doctor_notes: 'Pacientul a fost contactat, recomandari comunicate',
  },
  {
    alert_id: 5,
    threshold_id: threshold5Id,
    checkin_id: 75,
    patient_id: patient3Doctor2Id,
    triggered_value: 112,
    severity: 'medium',
    triggered_at: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString(),
    status: 'resolved',
    acknowledged_at: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString(),
    doctor_notes: 'Ritm cardiac stabilizat dupa odihna',
  },
];