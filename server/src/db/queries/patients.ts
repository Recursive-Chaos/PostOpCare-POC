import type { Patient } from "../../../../shared/types";
import db from "../index.js";

// pacientii unui medic
export async function getPatientsByDoctor(doctorId: string): Promise<Patient[]> {
  const result = await db.query("SELECT * FROM patients WHERE doctor_id = $1", [doctorId]);
  return result.rows;
}

export async function getPatientById(id: string): Promise<Patient | null> {
  const result = await db.query("SELECT * FROM patients WHERE user_id = $1", [id]);
  return result.rows[0] ?? null;
}
