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
      payload.photos.push({
        uri: value,
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
