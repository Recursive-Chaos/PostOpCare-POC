import { beforeEach, describe, expect, it, vi } from "vitest";
import request from "supertest";
import express from "express";
import questionnairesRouter from "./questionnaires.js";
import db from "../../db/index.js";
import { supabase } from "../../lib/supabase.js";

vi.mock("../../db/index.js", () => ({
  default: {
    query: vi.fn(),
    connect: vi.fn(),
  },
}));

vi.mock("../../lib/supabase.js", () => ({
  supabase: {
    auth: { getUser: vi.fn() },
  },
}));

const app = express();
app.use(express.json());
app.use("/doctor/questionnaires", questionnairesRouter);

describe("Doctor Questionnaires", () => {
  const client = {
    query: vi.fn(),
    release: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    client.query.mockReset();
    (db.connect as any).mockResolvedValue(client);
    (db.query as any).mockResolvedValue({ rows: [] });
    (supabase.auth.getUser as any).mockResolvedValue({
      data: { user: { id: "doc-1" } },
      error: null,
    });
  });

  it("salveaza optiunile choice ca json", async () => {
    client.query.mockImplementation((sql: string) => {
      if (sql.includes("RETURNING template_id")) {
        return Promise.resolve({ rows: [{ template_id: 5 }] });
      }

      return Promise.resolve({ rows: [] });
    });

    const res = await request(app)
      .post("/doctor/questionnaires")
      .set("Authorization", "Bearer token")
      .send({
        title: "Test",
        questions: [
          {
            question_text: "Cum te simti?",
            answer_type: "choice",
            options_json: ["bine", "rau"],
          },
        ],
      });

    expect(res.status).toBe(201);
    expect(client.query).toHaveBeenCalledWith(
      expect.stringContaining("INSERT INTO postopcare.questions"),
      [5, "Cum te simti?", "choice", JSON.stringify(["bine", "rau"]), 0],
    );
  });

  it("editeaza un chestionar existent", async () => {
    client.query.mockImplementation((sql: string) => {
      if (sql.includes("UPDATE postopcare.questionnaire_templates")) {
        return Promise.resolve({ rows: [{ template_id: 5 }] });
      }
      if (sql.includes("UPDATE postopcare.questions")) {
        return Promise.resolve({ rows: [{ question_id: 12 }] });
      }

      return Promise.resolve({ rows: [] });
    });

    const res = await request(app)
      .put("/doctor/questionnaires/5")
      .set("Authorization", "Bearer token")
      .send({
        title: "Test editat",
        questions: [
          {
            question_id: 12,
            question_text: "Durere?",
            answer_type: "scale",
            options_json: {
              min: 1,
              max: 10,
              unit: "",
              normal_min: 1,
              normal_max: 7,
            },
          },
        ],
      });

    expect(res.status).toBe(200);
    expect(client.query).toHaveBeenCalledWith(
      expect.stringContaining("UPDATE postopcare.questionnaire_templates"),
      ["Test editat", null, 5, "doc-1"],
    );
    expect(client.query).toHaveBeenCalledWith(
      expect.stringContaining("UPDATE postopcare.questions"),
      [
        "Durere?",
        "scale",
        JSON.stringify({
          min: 1,
          max: 10,
          unit: "",
          normal_min: 1,
          normal_max: 7,
        }),
        0,
        12,
        5,
      ],
    );
    expect(client.query).toHaveBeenCalledWith(
      expect.stringContaining("DELETE FROM postopcare.questions q"),
      [5, [12]],
    );
  });

  it("accepta scala fara unitate si fara interval normal", async () => {
    client.query.mockImplementation((sql: string) => {
      if (sql.includes("RETURNING template_id")) {
        return Promise.resolve({ rows: [{ template_id: 9 }] });
      }

      return Promise.resolve({ rows: [] });
    });

    const res = await request(app)
      .post("/doctor/questionnaires")
      .set("Authorization", "Bearer token")
      .send({
        title: "Scala simpla",
        questions: [
          {
            question_text: "Durere?",
            answer_type: "scale",
            options_json: {
              min: 1,
              max: 10,
            },
          },
        ],
      });

    expect(res.status).toBe(201);
    expect(client.query).toHaveBeenCalledWith(
      expect.stringContaining("INSERT INTO postopcare.questions"),
      [
        9,
        "Durere?",
        "scale",
        JSON.stringify({
          min: 1,
          max: 10,
          unit: "",
          normal_min: null,
          normal_max: null,
        }),
        0,
      ],
    );
  });

  it("sterge un chestionar al medicului", async () => {
    const res = await request(app)
      .delete("/doctor/questionnaires/5")
      .set("Authorization", "Bearer token");

    expect(res.status).toBe(204);
    expect(db.query).toHaveBeenCalledWith(
      expect.stringContaining("DELETE FROM postopcare.questionnaire_templates"),
      [5, "doc-1"],
    );
  });
});
