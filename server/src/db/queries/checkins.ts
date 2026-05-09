import type { CheckIn } from "../../types/index.js";
import db from "../index.js";

export async function getCheckinsByPatient(patientId: string): Promise<CheckIn[]> {
  const result = await db.query(
    "SELECT * FROM check_ins WHERE patient_id = $1 ORDER BY submitted_at DESC",
    [patientId]
  );
  return result.rows;
}

export async function getCheckinById(id: number): Promise<CheckIn | null> {
  const result = await db.query("SELECT * FROM check_ins WHERE checkin_id = $1", [id]);
  return result.rows[0] ?? null;
}
