import type { Alert } from "../../../../shared/types.js";
import db from "../index.js";

// alertele unui pacient specific
export async function getAlertsByPatient(patientId: string): Promise<Alert[]> {
  const result = await db.query("SELECT * FROM alerts WHERE patient_id = $1 ORDER BY triggered_at DESC", [patientId]);
  return result.rows;
}