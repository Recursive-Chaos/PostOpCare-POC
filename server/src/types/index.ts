export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

export type Role = "doctor" | "patient" | "admin";
export type Severity = "low" | "medium" | "high" | "critical";

export interface User {
  user_id: string;
  email: string;
  password_hash: string;
  role: Role;
  first_name: string;
  last_name: string;
  phone?: string | null;
  is_active: boolean;
  created_at: string;
}

export interface Patient {
  user_id: string;
  doctor_id: string;
  date_of_birth?: string | null;
  notes?: string | null;
}

export interface CheckIn {
  checkin_id: number;
  patient_id: string;
  pain_level: number;
  temperature?: number | null;
  wound_status?: string | null;
  symptoms?: string | null;
  submitted_at: string;
}

export interface Alert {
  alert_id: number;
  patient_id: string;
  checkin_id?: number | null;
  severity: Severity;
  message: string;
  triggered_at: string;
  resolved_at?: string | null;
}
