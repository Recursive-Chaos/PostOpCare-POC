import { Pool, PoolClient } from "pg";

export async function getUserProfile(db: Pool | PoolClient, userId: string) {
  return db.query<{
    user_id: string;
    email: string;
    role: string;
    first_name: string;
    last_name: string;
    is_active: boolean;
  }>(
    `SELECT user_id, email, role, first_name, last_name, is_active
     FROM postopcare.users WHERE user_id = $1`,
    [userId],
  );
}

export async function getDoctorProfile(db: Pool | PoolClient, userId: string) {
  return db.query<{
    specialization: string;
    notification_pref: string;
    hospital_name: string | null;
  }>(
    `SELECT d.specialization, d.notification_pref, h.hospital_name
     FROM postopcare.doctors d
     LEFT JOIN postopcare.hospitals h ON h.hospital_id = d.hospital_id
     WHERE d.user_id = $1`,
    [userId],
  );
}

export async function getPatientProfile(db: Pool | PoolClient, userId: string) {
  return db.query<{
    doctor_id: string;
    date_of_birth: string | null;
  }>(
    `SELECT doctor_id, date_of_birth
     FROM postopcare.patients WHERE user_id = $1`,
    [userId],
  );
}

export async function getDoctorPatients(
  db: Pool | PoolClient,
  doctorId: string,
) {
  return db.query(
    `SELECT 
        u.user_id, u.email, u.first_name, u.last_name, u.phone,
        p.date_of_birth, p.notes,
        proc.surgery_type, proc.surgery_date, proc.discharge_date, proc.monitoring_end_date
       FROM postopcare.users u
       JOIN postopcare.patients p ON u.user_id = p.user_id
       LEFT JOIN postopcare.procedures proc ON u.user_id = proc.patient_id
       WHERE p.doctor_id = $1
       ORDER BY proc.surgery_date DESC NULLS LAST`,
    [doctorId],
  );
}

export async function checkPatientBelongsToDoctor(
  db: Pool | PoolClient,
  patientId: string,
  doctorId: string,
) {
  return db.query(
    `SELECT user_id FROM postopcare.patients WHERE user_id = $1 AND doctor_id = $2`,
    [patientId, doctorId],
  );
}

export async function checkDoctorExists(
  db: Pool | PoolClient,
  doctorId: string,
) {
  return db.query<{ user_id: string }>(
    `SELECT user_id FROM postopcare.users
     WHERE user_id = $1 AND role = 'doctor' AND is_active = true`,
    [doctorId],
  );
}

export async function checkUserActive(db: Pool | PoolClient, email: string) {
  return db.query(
    `SELECT user_id, is_active FROM postopcare.users WHERE email = $1`,
    [email],
  );
}

export async function getDoctorQuestionnaireTemplates(
  db: Pool | PoolClient,
  doctorId: string,
) {
  return db.query(
    `SELECT
        qt.template_id,
        qt.title,
        qt.description,
        qt.created_at,
        (
          SELECT COALESCE(
            json_agg(
              json_build_object(
                'question_id', q.question_id,
                'question_text', q.question_text,
                'answer_type', q.answer_type,
                'options_json', q.options_json,
                'order_index', q.order_index
              )
              ORDER BY q.order_index
            ),
            '[]'
          )
          FROM postopcare.questions q
          WHERE q.template_id = qt.template_id
        ) AS questions
       FROM postopcare.questionnaire_templates qt
       WHERE qt.doctor_id = $1
       ORDER BY qt.created_at DESC`,
    [doctorId],
  );
}

export async function getPatientCheckins(
  db: Pool | PoolClient,
  patientId: string,
) {
  return db.query(
    `SELECT
       ci.checkin_id,
       ci.submitted_at AT TIME ZONE 'UTC' AS submitted_at,
       ci.general_notes,
       (
         SELECT COALESCE(
           json_agg(
             json_build_object(
               'question', q.question_text,
               'answer', qr.answer_value,
               'answer_type', q.answer_type,
               'options_json', q.options_json
             )
             ORDER BY q.order_index
           ),
           '[]'
         )
         FROM postopcare.questionnaire_responses qr
         JOIN postopcare.questions q ON q.question_id = qr.question_id
         WHERE qr.checkin_id = ci.checkin_id
       ) AS responses,
       (
         SELECT COALESCE(json_agg(json_build_object('id', p.photo_id, 'uri', p.storage_path)), '[]')
         FROM postopcare.photos p
         WHERE p.checkin_id = ci.checkin_id
       ) AS photos
     FROM postopcare.check_ins ci
     WHERE ci.patient_id = $1
     ORDER BY ci.submitted_at DESC`,
    [patientId],
  );
}

export async function getPatientActiveQuestionnaire(
  db: Pool | PoolClient,
  patientId: string,
) {
  return db.query<{
    assignment_id: number;
    procedure_id: number | null;
    title: string;
    status: "Necompletat" | "Completat";
    questions: unknown[];
  }>(
    `SELECT
       qa.assignment_id,
       (
         SELECT procedure_id
         FROM postopcare.procedures
         WHERE patient_id = qa.patient_id
         ORDER BY surgery_date DESC
         LIMIT 1
       ) AS procedure_id,
       qt.title,
       'Necompletat' AS status,
       (
         SELECT COALESCE(
           json_agg(
             json_build_object(
               'question_id', q.question_id,
               'question_text', q.question_text,
               'answer_type', q.answer_type,
               'options_json', q.options_json,
               'order_index', q.order_index
             ) ORDER BY q.order_index
           ),
           '[]'
         )
         FROM postopcare.questions q
         WHERE q.template_id = qt.template_id
       ) AS questions
     FROM postopcare.questionnaire_assignments qa
     JOIN postopcare.questionnaire_templates qt ON qt.template_id = qa.template_id
     WHERE qa.patient_id = $1
     ORDER BY qa.start_date DESC, qa.assignment_id DESC
     LIMIT 1`,
    [patientId],
  );
}

export async function checkCheckinExistsToday(
  db: Pool | PoolClient,
  patientId: string,
) {
  return db.query(
    `SELECT checkin_id FROM postopcare.check_ins 
     WHERE patient_id = $1 
     AND DATE((submitted_at AT TIME ZONE 'UTC') AT TIME ZONE 'Europe/Bucharest') = DATE(CURRENT_TIMESTAMP AT TIME ZONE 'Europe/Bucharest')`,
    [patientId],
  );
}

export async function insertCheckin(
  db: PoolClient,
  patientId: string,
  procedureId: number | null,
  generalNotes: string | null,
) {
  return db.query<{ checkin_id: number }>(
    `INSERT INTO postopcare.check_ins
       (patient_id, procedure_id, general_notes)
     VALUES ($1, $2, $3)
     RETURNING checkin_id`,
    [patientId, procedureId, generalNotes],
  );
}

export async function insertQuestionnaireResponses(
  db: PoolClient,
  assignmentId: number,
  checkinId: number,
  questionId: number,
  answerValue: string,
  patientId: string,
) {
  return db.query(
    `INSERT INTO postopcare.questionnaire_responses
       (assignment_id, checkin_id, question_id, answer_value)
     SELECT $1, $2, $3, $4
     FROM postopcare.questionnaire_assignments qa
     JOIN postopcare.questions q ON q.template_id = qa.template_id
     WHERE qa.assignment_id = $1 AND qa.patient_id = $5 AND q.question_id = $3`,
    [assignmentId, checkinId, questionId, String(answerValue), patientId],
  );
}

export async function insertCheckinPhoto(
  db: PoolClient,
  checkinId: number,
  storagePath: string,
  photoType: string,
) {
  return db.query(
    `INSERT INTO postopcare.photos (checkin_id, storage_path, photo_type)
     VALUES ($1, $2, $3)`,
    [checkinId, storagePath, photoType],
  );
}

export async function deleteExistingProcedures(
  db: PoolClient,
  patientId: string,
) {
  return db.query(`DELETE FROM postopcare.procedures WHERE patient_id = $1`, [
    patientId,
  ]);
}

export async function insertProcedure(
  db: Pool | PoolClient,
  patientId: string,
  surgeryType: string,
  surgeryDate: string | null,
  dischargeDate: string | null,
  monitoringEndDate: string | null,
) {
  return db.query(
    `INSERT INTO postopcare.procedures 
       (patient_id, surgery_type, surgery_date, discharge_date, monitoring_end_date)
     VALUES ($1, $2, $3, $4, $5)`,
    [
      patientId,
      surgeryType || "N/A",
      surgeryDate || null,
      dischargeDate || null,
      monitoringEndDate || null,
    ],
  );
}

export async function updatePatientInfo(
  db: PoolClient,
  patientId: string,
  dateOfBirth: string | null,
  notes: string | null,
) {
  return db.query(
    `UPDATE postopcare.patients 
     SET date_of_birth = $1, notes = $2, updated_at = CURRENT_TIMESTAMP
     WHERE user_id = $3`,
    [dateOfBirth || null, notes || null, patientId],
  );
}

export async function deleteExistingAssignments(
  db: PoolClient,
  patientId: string,
  templateId: number,
) {
  return db.query(
    `DELETE FROM postopcare.questionnaire_assignments
     WHERE patient_id = $1 AND template_id = $2`,
    [patientId, templateId],
  );
}

export async function insertQuestionnaireAssignment(
  db: PoolClient,
  patientId: string,
  templateId: number,
) {
  return db.query(
    `INSERT INTO postopcare.questionnaire_assignments (patient_id, template_id)
     VALUES ($1, $2)`,
    [patientId, templateId],
  );
}

export async function insertQuestionnaireTemplate(
  db: PoolClient,
  doctorId: string,
  title: string,
  description: string | null,
) {
  return db.query<{ template_id: number }>(
    `INSERT INTO postopcare.questionnaire_templates (doctor_id, title, description)
     VALUES ($1, $2, $3)
     RETURNING template_id`,
    [doctorId, title, description],
  );
}

export async function dropQuestionPhotoConstraint(db: PoolClient) {
  return db.query(
    `ALTER TABLE postopcare.questions
     DROP CONSTRAINT IF EXISTS questions_answer_type_check`,
  );
}

export async function addQuestionPhotoConstraint(db: PoolClient) {
  return db.query(
    `ALTER TABLE postopcare.questions
     ADD CONSTRAINT questions_answer_type_check
     CHECK (answer_type IN ('scale', 'boolean', 'text', 'choice', 'photo'))`,
  );
}

export async function insertQuestion(
  db: PoolClient,
  templateId: number,
  text: string,
  type: string,
  options: unknown,
  orderIndex: number,
) {
  return db.query<{ question_id: number }>(
    `INSERT INTO postopcare.questions
       (template_id, question_text, answer_type, options_json, order_index)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING question_id`,
    [
      templateId,
      text,
      type,
      options ? JSON.stringify(options) : null,
      orderIndex,
    ],
  );
}

export async function updateQuestion(
  db: PoolClient,
  questionId: number,
  templateId: number,
  text: string,
  type: string,
  options: unknown,
  orderIndex: number,
) {
  return db.query<{ question_id: number }>(
    `UPDATE postopcare.questions
     SET question_text = $1,
         answer_type = $2,
         options_json = $3,
         order_index = $4
     WHERE question_id = $5 AND template_id = $6
     RETURNING question_id`,
    [
      text,
      type,
      options ? JSON.stringify(options) : null,
      orderIndex,
      questionId,
      templateId,
    ],
  );
}

export async function updateQuestionnaireTemplate(
  db: PoolClient,
  templateId: number,
  doctorId: string,
  title: string,
  description: string | null,
) {
  return db.query<{ template_id: number }>(
    `UPDATE postopcare.questionnaire_templates
     SET title = $1, description = $2
     WHERE template_id = $3 AND doctor_id = $4
     RETURNING template_id`,
    [title, description, templateId, doctorId],
  );
}

export async function deleteTemplateQuestions(
  db: PoolClient,
  templateId: number,
) {
  return db.query(`DELETE FROM postopcare.questions WHERE template_id = $1`, [
    templateId,
  ]);
}

export async function deleteUnreferencedTemplateQuestionsExcept(
  db: PoolClient,
  templateId: number,
  keepQuestionIds: number[],
) {
  return db.query(
    `DELETE FROM postopcare.questions q
     WHERE q.template_id = $1
       AND NOT (q.question_id = ANY($2::int[]))
       AND NOT EXISTS (
         SELECT 1
         FROM postopcare.questionnaire_responses qr
         WHERE qr.question_id = q.question_id
       )`,
    [templateId, keepQuestionIds],
  );
}

export async function deleteQuestionnaireTemplate(
  db: Pool | PoolClient,
  templateId: number,
  doctorId: string,
) {
  return db.query(
    `DELETE FROM postopcare.questionnaire_templates
     WHERE template_id = $1 AND doctor_id = $2`,
    [templateId, doctorId],
  );
}

export async function getUserByEmail(db: Pool | PoolClient, email: string) {
  return db.query<{
    user_id: string;
    role: string;
  }>(
    `SELECT user_id, role
     FROM postopcare.users WHERE email = $1`,
    [email],
  );
}

export async function insertUser(
  db: Pool | PoolClient,
  userId: string,
  email: string,
  firstName: string,
  lastName: string,
  phone: string | null,
) {
  return db.query(
    `INSERT INTO postopcare.users
     (user_id, email, password_hash, role, first_name, last_name, phone, is_active)
     VALUES ($1, $2, $3, 'patient', $4, $5, $6, true)`,
    [userId, email, "managed_by_supabase", firstName, lastName, phone],
  );
}

export async function upsertPatient(
  db: Pool | PoolClient,
  patientId: string,
  doctorId: string,
  dateOfBirth: string | null,
  notes: string | null,
) {
  return db.query(
    `INSERT INTO postopcare.patients (user_id, doctor_id, date_of_birth, notes)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (user_id)
     DO UPDATE SET doctor_id = EXCLUDED.doctor_id,
                   date_of_birth = EXCLUDED.date_of_birth,
                   notes = EXCLUDED.notes`,
    [patientId, doctorId, dateOfBirth, notes],
  );
}

export async function insertQuestionnaireAssignmentWithDates(
  db: Pool | PoolClient,
  patientId: string,
  templateId: number,
  endDate: string | null,
) {
  return db.query(
    `INSERT INTO postopcare.questionnaire_assignments
       (patient_id, template_id, frequency, start_date, end_date)
       VALUES ($1, $2, 'daily', CURRENT_DATE, $3)`,
    [patientId, templateId, endDate],
  );
}

export async function checkTemplateExists(
  db: Pool | PoolClient,
  templateId: number,
  doctorId: string,
) {
  const res = await db.query(
    `SELECT template_id FROM postopcare.questionnaire_templates
     WHERE template_id = $1 AND doctor_id = $2`,
    [templateId, doctorId],
  );
  return res.rows.length > 0;
}
