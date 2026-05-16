import {
  buildCheckinPayload,
  hasMissingRequired,
  normalizeQuestionnaire,
  numberRange,
  setCheckinAnswer,
} from "./checkin";
import { Question } from "../types";

const questions: Question[] = [
  { id: "pain", text: "Durere", type: "scale", required: true },
  { id: "notes", text: "Note", type: "text" },
];

describe("checkin utils", () => {
  it("adauga raspuns fara sa schimbe obiectul vechi", () => {
    const oldAnswers = { pain: "3" };
    const nextAnswers = setCheckinAnswer(oldAnswers, "notes", "ok");

    expect(nextAnswers).toEqual({ pain: "3", notes: "ok" });
    expect(oldAnswers).toEqual({ pain: "3" });
  });

  it("vede cand lipseste un camp obligatoriu", () => {
    expect(hasMissingRequired(questions, {})).toBe(true);
    expect(hasMissingRequired(questions, { pain: "4" })).toBe(false);
  });

  it("face lista pentru scala", () => {
    expect(numberRange(2, 5)).toEqual([2, 3, 4, 5]);
  });

  it("normalizeaza chestionarul primit din backend", () => {
    expect(
      normalizeQuestionnaire({
        assignment_id: 7,
        procedure_id: 3,
        title: "Check-in medic",
        status: "Necompletat",
        questions: [
          {
            question_id: 11,
            question_text: "Cum te simti?",
            answer_type: "text",
            options_json: null,
          },
        ],
      }),
    ).toEqual({
      assignmentId: 7,
      procedureId: 3,
      title: "Check-in medic",
      status: "Necompletat",
      questions: [
        {
          id: "11",
          questionId: 11,
          text: "Cum te simti?",
          answerType: "text",
          optionsJson: undefined,
          required: true,
          dbTarget: "response",
        },
      ],
    });
  });

  it("trimite poza ca base64, nu ca uri local simplu", () => {
    const payload = buildCheckinPayload(
      {
        assignmentId: 7,
        procedureId: 3,
        title: "Check-in",
        status: "Necompletat",
        questions: [
          {
            id: "photo",
            text: "Poza",
            answerType: "photo",
            dbTarget: "photo",
          },
        ],
      },
      {
        photo: JSON.stringify({
          uri: "file://local.jpg",
          base64: "abc",
          mimeType: "image/jpeg",
        }),
      },
    );

    expect(payload.photos).toEqual([
      {
        uri: "file://local.jpg",
        base64: "abc",
        mimeType: "image/jpeg",
        photo_type: "wound",
      },
    ]);
  });
});
