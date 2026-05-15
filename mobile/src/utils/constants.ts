import { Platform } from "react-native";
import { HistoryEntry, Questionnaire } from "../types";

export const API_URL =
  Platform.OS === "android" ? "http://10.0.2.2:3001" : "http://localhost:3001";
export const dailyQuestionnaire: Questionnaire = {
  assignmentId: 1,
  procedureId: 1,
  title: "Check-in post-operator",
  status: "Necompletat",
  questions: [
    {
      id: "pain",
      questionId: 1,
      text: "Durere",
      answerType: "scale",
      optionsJson: { min: 1, max: 10, unit: "scor" },
      required: true,
      dbTarget: "measurement",
      metricName: "pain",
    },
    {
      id: "temperature",
      questionId: 2,
      text: "Temperatura",
      answerType: "scale",
      optionsJson: { min: 35, max: 42, step: 0.1, unit: "C" },
      required: true,
      dbTarget: "measurement",
      metricName: "temperature",
    },
    {
      id: "fever",
      questionId: 3,
      text: "Ai avut febra?",
      answerType: "boolean",
      required: true,
      dbTarget: "response",
    },
    {
      id: "wound",
      questionId: 4,
      text: "Aspect plaga",
      answerType: "choice",
      optionsJson: ["Normal", "Rosu", "Umflat", "Secretii"],
      required: true,
      dbTarget: "response",
    },
    {
      id: "photo",
      questionId: 5,
      text: "Poza plaga",
      answerType: "photo",
      required: true,
      dbTarget: "photo",
      photoType: "wound",
    },
    {
      id: "notes",
      questionId: 6,
      text: "Note pentru medic",
      answerType: "text",
      dbTarget: "notes",
    },
  ],
};

export const historyEntries: HistoryEntry[] = [
  {
    id: "1",
    day: "3",
    month: "MAI",
    weekday: "Duminica",
    pain: 4,
    painSeverity: "low",
    temperatureC: 36.8,
  },
  {
    id: "2",
    day: "2",
    month: "MAI",
    weekday: "Sambata",
    pain: 5,
    painSeverity: "moderate",
    temperatureC: 37.0,
  },
  {
    id: "3",
    day: "1",
    month: "MAI",
    weekday: "Vineri",
    pain: 9,
    painSeverity: "high",
    temperatureC: 36.9,
  },
];
