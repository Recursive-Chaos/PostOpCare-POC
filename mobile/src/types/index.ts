export type Patient = {
  firstName: string;
  recoveryDay: number;
  surgeryType: string;
};

export type HistoryEntry = {
  id: string;
  day: string;
  month: string;
  weekday: string;
  pain: number;
  painSeverity: "low" | "moderate" | "high";
  temperatureC: number;
};

export type Question = {
  id: string;
  questionId?: number;
  text: string;
  type?: "text" | "number" | "scale" | "boolean" | "choice" | "photo";
  answerType?: "text" | "scale" | "boolean" | "choice" | "photo";
  required?: boolean;
  options?: string[];
  optionsJson?:
    | string[]
    | { min?: number; max?: number; step?: number; unit?: string };
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  dbTarget?: "measurement" | "response" | "photo" | "notes";
  metricName?: string;
  photoType?: string;
};

export type Questionnaire = {
  assignmentId?: number;
  procedureId?: number;
  title: string;
  status: "Necompletat" | "Completat";
  questions: Question[];
};

export type CheckinPayload = {
  procedure_id?: number;
  submitted_at?: string;
  general_notes?: string;
  measurements: {
    metric_name: string;
    metric_value: number;
    unit?: string;
  }[];
  responses: {
    assignment_id?: number;
    question_id?: number;
    answer_value: string;
  }[];
  photos: {
    uri: string;
    photo_type: string;
  }[];
};
