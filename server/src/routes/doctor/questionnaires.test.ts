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
    (db.connect as any).mockResolvedValue(client);
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
});
