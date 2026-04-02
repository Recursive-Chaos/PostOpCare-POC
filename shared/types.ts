// tipurile de date folosite in toata aplicatia
// reflecta tabelele din baza de date

export type Role = "doctor" | "patient" | "admin";

export type Severity = "normal" | "low" | "medium" | "high" | "urgent";

export type User = {
  user_id: string;
  email: string;
  role: Role;
  first_name: string;
  last_name: string;
  phone: string;
  is_active: boolean;
  created_at: string;
};

export type Doctor = {
  user_id: string;
  specialization: string;
  hospital_id: string;
  bio?: string;
};

export type Patient = {
  user_id: string;
  doctor_id: string;
  date_of_birth?: string;
  notes?: string;
};

export type Procedure = {
  procedure_id: number;
  patient_id: string;
  surgery_type?: string;
  surgery_date?: string;
  discharge_date?: string;
  monitoring_end_date?: string;
};

export type CheckIn = {
  checkin_id: number;
  patient_id: string;
  procedure_id?: number;
  submitted_at: string;
  general_notes?: string;
};

export type Alert = {
  alert_id: number;
  patient_id: string;
  checkin_id: number;
  triggered_value: number;
  severity: Severity;
  triggered_at: string;
  status: "new" | "acknowledged" | "resolved";
  doctor_notes?: string;
};
