import {
  buildCheckinPayload,
  hasMissingRequired,
  numberRange,
  setCheckinAnswer,
} from "./checkin";
import { Question, Questionnaire } from "../types";

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
});
