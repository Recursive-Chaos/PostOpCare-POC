CREATE SCHEMA IF NOT EXISTS postopcare;
SET search_path TO postopcare;
 
-- Contul generic de utilizator (medic, pacient sau admin)
CREATE TABLE users (
user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
email VARCHAR(255) UNIQUE,
password_hash VARCHAR(255) NOT NULL,
role VARCHAR(10) NOT NULL CHECK (role IN ('doctor', 'patient', 'admin')),
first_name VARCHAR(100) NOT NULL,
last_name VARCHAR(100) NOT NULL,
phone VARCHAR(20) NOT NULL UNIQUE,
created_at TIMESTAMP DEFAULT NOW(),
is_active BOOLEAN DEFAULT TRUE
);
 
-- Spitalele in care lucreaza medicii
CREATE TABLE hospitals (
hospital_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
hospital_name VARCHAR(200) NOT NULL UNIQUE,
hospital_address VARCHAR NOT NULL
);
 
-- Profilul extins al medicului
CREATE TABLE doctors (
user_id UUID PRIMARY KEY REFERENCES users(user_id) ON DELETE CASCADE,
specialization VARCHAR(150) NOT NULL,
hospital_id UUID NOT NULL REFERENCES hospitals(hospital_id),
bio TEXT,
notification_pref VARCHAR NOT NULL DEFAULT 'email'
);
 
-- Profilul extins al pacientului
CREATE TABLE patients (
user_id UUID PRIMARY KEY REFERENCES users(user_id) ON DELETE CASCADE,
doctor_id UUID NOT NULL REFERENCES doctors(user_id),
date_of_birth DATE,
notes TEXT
);
 
-- Procedurile medicale (operatii)
CREATE TABLE procedures (
procedure_id SERIAL PRIMARY KEY,
patient_id UUID NOT NULL REFERENCES patients(user_id) ON DELETE CASCADE,
surgery_type VARCHAR(200),
surgery_date DATE,
discharge_date DATE,
monitoring_end_date DATE
);             	
 
-- Catalogul de parametri clinici
CREATE TABLE metrics (
metric_id SERIAL PRIMARY KEY,
metric_name VARCHAR(50) NOT NULL UNIQUE,
display_name VARCHAR(100) NOT NULL,
unit VARCHAR(20),
min_value NUMERIC(6,2),
max_value NUMERIC(6,2),
description TEXT,
created_at TIMESTAMP DEFAULT NOW()
);
 
-- Pragurile de severitate pe intervale pentru fiecare metric
CREATE TABLE metric_thresholds (
threshold_id SERIAL PRIMARY KEY,
metric_id INT NOT NULL REFERENCES metrics(metric_id) ON DELETE CASCADE,
doctor_id UUID REFERENCES doctors(user_id) ON DELETE CASCADE,
procedure_id INT REFERENCES procedures(procedure_id) ON DELETE CASCADE,
severity VARCHAR(10) NOT NULL CHECK (severity IN ('normal', 'low', 'medium', 'high', 'urgent')),
min_value NUMERIC(6,2),
max_value NUMERIC(6,2),
label VARCHAR(100),
message TEXT,
notify_doctor BOOLEAN DEFAULT FALSE,
is_active BOOLEAN DEFAULT TRUE,
created_at TIMESTAMP DEFAULT NOW(),
CONSTRAINT chk_range CHECK (min_value IS NOT NULL OR max_value IS NOT NULL)
);
 
-- Check-in-ul zilnic trimis de pacient
CREATE TABLE check_ins (
checkin_id SERIAL PRIMARY KEY,
patient_id UUID NOT NULL REFERENCES patients(user_id) ON DELETE CASCADE,
procedure_id INT REFERENCES procedures(procedure_id) ON DELETE SET NULL,
submitted_at TIMESTAMP NOT NULL DEFAULT NOW(),
general_notes TEXT
);
 
-- Valorile clinice masurate in cadrul unui check-in
CREATE TABLE clinical_measurements (
measurement_id SERIAL PRIMARY KEY,
checkin_id INT NOT NULL REFERENCES check_ins(checkin_id) ON DELETE CASCADE,
metric_id INT NOT NULL REFERENCES metrics(metric_id),
metric_value NUMERIC(6,2) NOT NULL,
unit VARCHAR(20),
recorded_at TIMESTAMP DEFAULT NOW(),
UNIQUE (checkin_id, metric_id)
);
 
-- Pozele atasate de catre un pacient
CREATE TABLE photos (
photo_id SERIAL PRIMARY KEY,
checkin_id INT NOT NULL REFERENCES check_ins(checkin_id) ON DELETE CASCADE,
storage_path VARCHAR(500) NOT NULL,
photo_type VARCHAR(30) DEFAULT 'wound',
uploaded_at TIMESTAMP DEFAULT NOW(),
doctor_reviewed BOOLEAN DEFAULT FALSE
);
 
-- Template-urile de chestionare
CREATE TABLE questionnaire_templates (
template_id SERIAL PRIMARY KEY,
doctor_id UUID NOT NULL REFERENCES doctors(user_id) ON DELETE CASCADE,
title VARCHAR(200) NOT NULL,
description TEXT,
is_public BOOLEAN DEFAULT FALSE,
created_at TIMESTAMP DEFAULT NOW()
);
 
-- Intrebarile dintr-un template de chestionar
CREATE TABLE questions (
question_id SERIAL PRIMARY KEY,
template_id INT NOT NULL REFERENCES questionnaire_templates(template_id) ON DELETE CASCADE,
question_text TEXT NOT NULL,
answer_type VARCHAR(20) CHECK (answer_type IN ('scale', 'boolean', 'text', 'choice')),
options_json JSONB,
order_index INT NOT NULL DEFAULT 0
);
 
-- Asocierea dintre un chestionar si un pacient
CREATE TABLE questionnaire_assignments (
assignment_id SERIAL PRIMARY KEY,
patient_id UUID NOT NULL REFERENCES patients(user_id) ON DELETE CASCADE,
template_id INT NOT NULL REFERENCES questionnaire_templates(template_id),
frequency VARCHAR(20) CHECK (frequency IN ('daily', 'weekly')),
start_date DATE NOT NULL,
end_date DATE,
is_active BOOLEAN DEFAULT TRUE
);
 
-- Raspunsurile pacientului la fiecare intrebare din chestionar
CREATE TABLE questionnaire_responses (
response_id SERIAL PRIMARY KEY,
assignment_id INT NOT NULL REFERENCES questionnaire_assignments(assignment_id) ON DELETE CASCADE,
checkin_id INT NOT NULL REFERENCES check_ins(checkin_id) ON DELETE CASCADE,
question_id INT NOT NULL REFERENCES questions(question_id),
answer_value TEXT NOT NULL,
answered_at TIMESTAMP DEFAULT NOW(),
UNIQUE (assignment_id, checkin_id, question_id)
);
 
 
-- Alertele generate automat cand o valoare intra intr-un prag cu notify_doctor = true (de discutat daca facem cu trigger din DB sau backend code cu insert)
CREATE TABLE alerts (
alert_id SERIAL PRIMARY KEY,
threshold_id INT NOT NULL REFERENCES metric_thresholds(threshold_id) ON DELETE CASCADE,
checkin_id INT NOT NULL REFERENCES check_ins(checkin_id) ON DELETE CASCADE,
patient_id UUID NOT NULL REFERENCES patients(user_id) ON DELETE CASCADE,
triggered_value NUMERIC(6,2) NOT NULL,
severity VARCHAR(10) NOT NULL CHECK (severity IN ('normal', 'low', 'medium', 'high', 'urgent')),
triggered_at TIMESTAMP DEFAULT NOW(),
status VARCHAR(20) DEFAULT 'new' CHECK (status IN ('new', 'acknowledged', 'resolved')),
acknowledged_at TIMESTAMP,
doctor_notes TEXT
);
 
