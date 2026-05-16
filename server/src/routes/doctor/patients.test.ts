import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import express from "express";
import patientsRouter from "./patients.js";
import db from "../../db/index.js";
import { supabase, supabaseAdmin } from "../../lib/supabase.js";

vi.mock("../../db/index.js", () => ({
  default: { query: vi.fn() },
}));

vi.mock("../../lib/supabase.js", () => ({
  supabase: {
    auth: { getUser: vi.fn() },
  },
  supabaseAdmin: {
    auth: {
      admin: {
        createUser: vi.fn(),
        listUsers: vi.fn(),
      },
    },
  },
}));

const app = express();
app.use(express.json());
app.use("/doctor/patients", patientsRouter);

describe("Doctor Patients Management", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});

    // default: query returneaza empty array
    (db.query as any).mockResolvedValue({ rows: [] });
  });

  const setupAuth = (userId: string = "doctor-1") => {
    (supabase.auth.getUser as any).mockResolvedValue({
      data: { user: { id: userId } },
      error: null,
    });
  };

  describe("GET /", () => {
    it("should return patients for the logged-in doctor", async () => {
      setupAuth("doc-1");

      (db.query as any).mockImplementation((sql: string) => {
        if (sql.includes("SELECT") && sql.includes("JOIN")) {
          return Promise.resolve({
            rows: [{ first_name: "Ion", last_name: "Popescu" }],
          });
        }
        return Promise.resolve({ rows: [] });
      });

      const res = await request(app)
        .get("/doctor/patients")
        .set("Authorization", "Bearer token");

      expect(res.status).toBe(200);
      expect(res.body[0].first_name).toBe("Ion");
    });
  });

  describe("POST /invite", () => {
    const endpoint = "/doctor/patients/invite";

    it("should invite a new patient successfully", async () => {
      setupAuth("doc-1");

      (db.query as any).mockImplementation((sql: string) => {
        if (sql.includes("role = 'doctor'"))
          return Promise.resolve({ rows: [{ user_id: "doc-1" }] });
        if (sql.includes("FROM postopcare.questionnaire_templates"))
          return Promise.resolve({ rows: [{ template_id: 7 }] });
        if (sql.includes("FROM postopcare.users WHERE email"))
          return Promise.resolve({ rows: [] });
        return Promise.resolve({ rows: [] });
      });

      (supabaseAdmin.auth.admin.listUsers as any).mockResolvedValue({
        data: { users: [] },
      });
      (supabaseAdmin.auth.admin.createUser as any).mockResolvedValue({
        data: { user: { id: "new-p-1" } },
        error: null,
      });

      const res = await request(app)
        .post(endpoint)
        .set("Authorization", "Bearer token")
        .send({
          email: "new@patient.com",
          firstName: "New",
          lastName: "Patient",
          templateId: 7,
        });

      expect(res.status).toBe(201);
      expect(res.body.patientId).toBe("new-p-1");
      expect(res.body.existed).toBe(false);
    });

    it("should link an existing patient to the doctor", async () => {
      setupAuth("doc-1");

      (db.query as any).mockImplementation((sql: string) => {
        if (sql.includes("role = 'doctor'"))
          return Promise.resolve({ rows: [{ user_id: "doc-1" }] });
        if (sql.includes("FROM postopcare.questionnaire_templates"))
          return Promise.resolve({ rows: [{ template_id: 7 }] });
        if (sql.includes("FROM postopcare.users WHERE email")) {
          return Promise.resolve({
            rows: [{ user_id: "existing-p-1", role: "patient" }],
          });
        }
        return Promise.resolve({ rows: [] });
      });

      const res = await request(app)
        .post(endpoint)
        .set("Authorization", "Bearer token")
        .send({ email: "existing@patient.com", templateId: 7 });

      expect(res.status).toBe(200);
      expect(res.body.existed).toBe(true);
      expect(res.body.patientId).toBe("existing-p-1");
    });

    it("should assign a questionnaire when templateId is sent", async () => {
      setupAuth("doc-1");

      (db.query as any).mockImplementation((sql: string) => {
        if (sql.includes("role = 'doctor'"))
          return Promise.resolve({ rows: [{ user_id: "doc-1" }] });
        if (sql.includes("FROM postopcare.questionnaire_templates"))
          return Promise.resolve({ rows: [{ template_id: 7 }] });
        if (sql.includes("FROM postopcare.users WHERE email")) {
          return Promise.resolve({
            rows: [{ user_id: "existing-p-1", role: "patient" }],
          });
        }
        return Promise.resolve({ rows: [] });
      });

      const res = await request(app)
        .post(endpoint)
        .set("Authorization", "Bearer token")
        .send({ email: "existing@patient.com", templateId: 7 });

      expect(res.status).toBe(200);
      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining("questionnaire_assignments"),
        ["existing-p-1", 7, null],
      );
    });

    it("should return a clear error when phone is already used", async () => {
      setupAuth("doc-1");

      (db.query as any).mockImplementation((sql: string) => {
        if (sql.includes("role = 'doctor'"))
          return Promise.resolve({ rows: [{ user_id: "doc-1" }] });
        if (sql.includes("FROM postopcare.questionnaire_templates"))
          return Promise.resolve({ rows: [{ template_id: 7 }] });
        if (sql.includes("FROM postopcare.users WHERE email"))
          return Promise.resolve({ rows: [] });
        if (sql.includes("INSERT INTO postopcare.users")) {
          return Promise.reject({
            code: "23505",
            constraint: "users_phone_key",
          });
        }
        return Promise.resolve({ rows: [] });
      });

      (supabaseAdmin.auth.admin.listUsers as any).mockResolvedValue({
        data: { users: [] },
      });
      (supabaseAdmin.auth.admin.createUser as any).mockResolvedValue({
        data: { user: { id: "new-p-1" } },
        error: null,
      });

      const res = await request(app)
        .post(endpoint)
        .set("Authorization", "Bearer token")
        .send({
          email: "new@patient.com",
          patientPhone: "0712345678",
          templateId: 7,
        });

      expect(res.status).toBe(409);
      expect(res.body.error).toBe("numarul de telefon este deja folosit");
    });

    it("should reuse Supabase user if they exist in Auth but not in our DB", async () => {
      setupAuth("doc-1");

      (db.query as any).mockImplementation((sql: string) => {
        if (sql.includes("role = 'doctor'"))
          return Promise.resolve({ rows: [{ user_id: "doc-1" }] });
        if (sql.includes("FROM postopcare.questionnaire_templates"))
          return Promise.resolve({ rows: [{ template_id: 7 }] });
        if (sql.includes("FROM postopcare.users WHERE email"))
          return Promise.resolve({ rows: [] });
        return Promise.resolve({ rows: [] });
      });

      (supabaseAdmin.auth.admin.listUsers as any).mockResolvedValue({
        data: { users: [{ id: "supa-id-123", email: "supa@test.com" }] },
      });

      const res = await request(app)
        .post(endpoint)
        .set("Authorization", "Bearer token")
        .send({ email: "supa@test.com", templateId: 7 });

      expect(res.status).toBe(201);
      expect(res.body.patientId).toBe("supa-id-123");
      expect(supabaseAdmin.auth.admin.createUser).not.toHaveBeenCalled();
    });
  });
});
