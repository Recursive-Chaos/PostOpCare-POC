import { CheckinPayload, Question, Questionnaire } from "../types";

export type Answers = Record<string, string>;

export function setCheckinAnswer(
  answers: Answers,
  id: string,
  value: string,
): Answers {
  return { ...answers, [id]: value };
}

// sunt intrebari fara raspuns la care raspunsul e obligatoriu?
export function hasMissingRequired(questions: Question[], answers: Answers) {
  return questions.some(
    (question) => question.required && !answers[question.id],
  );
}

// face o lista cu numerele de la min la max
export function numberRange(min: number, max: number) {
  return Array.from({ length: max - min + 1 }, (_, index) => min + index);
}

export function questionType(question: Question) {
  return question.type ?? question.answerType ?? "text";
}

// returneaza optiunile intrebarii
export function questionOptions(question: Question): string[] {
  if (question.options) return question.options;
  return Array.isArray(question.optionsJson) ? question.optionsJson : [];
}

// returneaza min max si unit
export function questionRange(question: Question) {
  const options = Array.isArray(question.optionsJson)
    ? undefined
    : question.optionsJson;

  return {
    min: question.min ?? options?.min ?? 1,
    max: question.max ?? options?.max ?? 10,
    step: question.step ?? options?.step ?? 1,
    unit: question.unit ?? options?.unit,
  };
}

export function shouldUseStepper(question: Question) {
  return question.type === "number" || questionRange(question).step < 1;
}

export function normalizeQuestionnaire(data: any): Questionnaire | null {
  if (!data?.title || !Array.isArray(data.questions)) return null;

  return {
    assignmentId: data.assignment_id,
    procedureId: data.procedure_id,
    title: data.title,
    status: data.status ?? "Necompletat",
    questions: data.questions.map((question: any) => ({
      id: String(question.question_id),
      questionId: question.question_id,
      text: question.question_text,
      answerType: question.answer_type,
      optionsJson: question.options_json ?? undefined,
      required: true,
      dbTarget: question.answer_type === "photo" ? "photo" : "response",
    })),
  };
}

export function normalizeHistoryEntry(data: any) {
  const dateStr = data.submitted_at || new Date().toISOString();
  const date = new Date(dateStr.replace(" ", "T"));
  const day = date.getDate().toString();
  const month = date
    .toLocaleDateString("ro-RO", { month: "short" })
    .replace(".", "")
    .toUpperCase();
  const weekday = date.toLocaleDateString("ro-RO", { weekday: "long" });

  return {
    id: String(data.checkin_id),
    day,
    month,
    weekday,
    pain: 0,
    painSeverity: "low" as const,
    temperatureC: 0,
    submittedAt: dateStr,
    responses: data.responses ?? [],
    notes: data.general_notes,
    photos: data.photos ?? [],
  };
}

export function photoPreviewUri(value: string) {
  if (!value) return "";

  try {
    return JSON.parse(value).uri ?? "";
  } catch {
    return value;
  }
}

// construieste payload-ul pentru trimitere la backend
export function buildCheckinPayload(
  questionnaire: Questionnaire,
  answers: Answers,
): CheckinPayload {
  const payload: CheckinPayload = {
    procedure_id: questionnaire.procedureId,
    submitted_at: new Date().toISOString(),
    measurements: [],
    responses: [],
    photos: [],
  };

  questionnaire.questions.forEach((question) => {
    const value = answers[question.id];
    if (!value) return; // daca nu exista raspuns

    // adauga metricile
    if (question.dbTarget === "measurement" && question.metricName) {
      const metricValue = Number(value.replace(",", "."));
      if (!Number.isNaN(metricValue)) {
        payload.measurements.push({
          metric_name: question.metricName,
          metric_value: metricValue,
          unit: questionRange(question).unit,
        });
      }
      return;
    }

    // adauga foto
    if (question.dbTarget === "photo") {
      let photo: { uri?: string; base64?: string; mimeType?: string };
      try {
        photo = JSON.parse(value);
      } catch {
        return;
      }

      if (!photo.base64) return;

      payload.photos.push({
        uri: photo.uri,
        base64: photo.base64,
        mimeType: photo.mimeType,
        photo_type: question.photoType ?? "wound",
      });
      return;
    }

    // adauga notes
    if (question.dbTarget === "notes") {
      payload.general_notes = value;
      return;
    }
    payload.responses.push({
      assignment_id: questionnaire.assignmentId,
      question_id: question.questionId,
      answer_value: value,
    });
  });

  return payload;
}
