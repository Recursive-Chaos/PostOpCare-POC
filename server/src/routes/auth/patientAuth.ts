import { Router } from "express";
import type { Request, Response, NextFunction } from "express";
import { randomUUID } from "crypto";
import { supabase, supabaseAdmin } from "../../lib/supabase.js";
import db from "../../db/index.js";
import {
  getPatientActiveQuestionnaire,
  checkCheckinExistsToday,
  insertCheckin,
  insertQuestionnaireResponses,
  insertCheckinPhoto,
  getPatientCheckins,
} from "../../db/queries.js";

const router = Router();

// mesaj generic, nu vrem sa afisam daca mailul exista sau nu
const GENERIC_RESPONSE = {
  message: "if the email is valid, a login code was sent",
};

import jwt from "jsonwebtoken";

const PHOTOS_BUCKET = "photos";

function extensionFromMime(mimeType?: string) {
  if (mimeType === "image/png") return "png";
  if (mimeType === "image/webp") return "webp";
  return "jpg";
}

async function getPatientId(req: Request, res: Response) {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) {
    res.status(401).json({ error: "patient login is required" });
    return null;
  }

  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) {
    // POC workaround: if token is expired, we just decode it to keep the session alive
    // In production, this should either verify against SUPABASE_JWT_SECRET or use a refresh token flow
    const decoded = jwt.decode(token) as { sub?: string } | null;
    if (decoded?.sub) {
      return decoded.sub;
    }

    res.status(401).json({ error: "patient login is required" });
    return null;
  }

  return data.user.id;
}

// endpoint pt cererea codului
router.post(
  "/request-code",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = req.body as { email?: string };
      const normalizedEmail = email?.trim().toLowerCase();

      if (!normalizedEmail) {
        // returnam ok si la eroare ca sa nu dam indicii
        res.json(GENERIC_RESPONSE);
        return;
      }

      // verifica daca e pacient activ
      const userResult = await db.query<{ user_id: string }>(
        `SELECT user_id FROM postopcare.users
         WHERE email = $1 AND role = 'patient' AND is_active = true`,
        [normalizedEmail],
      );

      if (userResult.rows.length === 0) {
        // nu exista, dam mesaj generic oricum
        res.json(GENERIC_RESPONSE);
        return;
      }

      // trimite codul prin supabase
      const { error } = await supabase.auth.signInWithOtp({
        email: normalizedEmail,
        options: { shouldCreateUser: false },
      });

      if (error) {
        console.error(
          `OTP send failed for ${normalizedEmail}: ${error.message}`,
        );
        const status = error.message.toLowerCase().includes("rate limit")
          ? 429
          : 502;
        res.status(status).json({ error: error.message });
        return;
      }

      // ascundem rezultatul operatiunii pt ca
      res.json(GENERIC_RESPONSE);
    } catch (err) {
      next(err);
    }
  },
);

// endpoint pentru verificarea codului
router.post(
  "/verify-code",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, code } = req.body as { email?: string; code?: string };
      const normalizedEmail = email?.trim().toLowerCase();

      if (!normalizedEmail || !code) {
        res.status(400).json({ error: "email and code are required" });
        return;
      }

      // valideaza codul primit
      const { data, error } = await supabase.auth.verifyOtp({
        email: normalizedEmail,
        token: code.trim(),
        type: "email",
      });

      if (error || !data.session || !data.user) {
        console.error(
          `Verify OTP Error for ${normalizedEmail}:`,
          error?.message || "No session/user",
        );
        res.status(401).json({ error: "invalid or expired code" });
        return;
      }

      const userId = data.user.id;

      // datele generale din baza noastra
      const userResult = await db.query<{
        user_id: string;
        email: string;
        role: string;
        first_name: string;
        last_name: string;
        is_active: boolean;
      }>(
        `SELECT user_id, email, role, first_name, last_name, is_active
         FROM postopcare.users WHERE user_id = $1`,
        [userId],
      );

      const user = userResult.rows[0];

      // verificam rolul si statusul
      if (!user || user.role !== "patient" || !user.is_active) {
        res.status(401).json({ error: "access denied" });
        return;
      }

      // detaliile specifice pacientului
      const patientResult = await db.query<{
        doctor_id: string;
        date_of_birth: string | null;
      }>(
        `SELECT doctor_id, date_of_birth
         FROM postopcare.patients WHERE user_id = $1`,
        [userId],
      );

      const patient = patientResult.rows[0];

      // procedura medicala
      const procedureResult = await db.query<{
        surgery_type: string;
        surgery_date: string;
      }>(
        `SELECT surgery_type, surgery_date FROM postopcare.procedures WHERE patient_id = $1 ORDER BY surgery_date DESC LIMIT 1`,
        [userId],
      );
      const procedure = procedureResult.rows[0];

      const questionnaireResult = await getPatientActiveQuestionnaire(
        db,
        userId,
      );
      const questionnaire = questionnaireResult.rows[0] ?? null;

      if (questionnaire) {
        const existingCheckin = await checkCheckinExistsToday(db, userId);
        if (existingCheckin.rows.length > 0) {
          questionnaire.status = "Completat";
        }
      }

      // calculeaza ziua de recuperare
      let recoveryDay = null;
      if (procedure?.surgery_date) {
        const today = new Date();
        const surgeryDate = new Date(procedure.surgery_date);
        const diffTime = Math.abs(today.getTime() - surgeryDate.getTime());
        recoveryDay = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      }

      res.json({
        session: data.session,
        user: {
          userId: user.user_id,
          email: user.email,
          role: user.role,
          firstName: user.first_name,
          lastName: user.last_name,
        },
        patient: {
          doctorId: patient?.doctor_id ?? null,
          dateOfBirth: patient?.date_of_birth ?? null,
          surgeryType: procedure?.surgery_type ?? null,
          recoveryDay: recoveryDay,
        },
        questionnaire,
      });
    } catch (err) {
      next(err);
    }
  },
);

router.post(
  "/checkins",
  async (req: Request, res: Response, next: NextFunction) => {
    const client = await db.connect();

    try {
      const patientId = await getPatientId(req, res);
      if (!patientId) return;

      const body = req.body as {
        procedure_id?: number;
        general_notes?: string;
        responses?: {
          assignment_id?: number;
          question_id?: number;
          answer_value?: string;
        }[];
        photos?: { base64?: string; mimeType?: string; photo_type?: string }[];
      };

      await client.query("BEGIN");

      const existingCheckin = await checkCheckinExistsToday(client, patientId);

      if (existingCheckin.rows.length > 0) {
        await client.query("ROLLBACK");
        res.status(409).json({ error: "Ai trimis deja un check-in astazi." });
        return;
      }

      const checkinResult = await insertCheckin(
        client,
        patientId,
        body.procedure_id ?? null,
        body.general_notes ?? null,
      );

      const checkinId = checkinResult.rows[0].checkin_id;

      for (const response of body.responses ?? []) {
        if (!response.assignment_id || !response.question_id) continue;

        await insertQuestionnaireResponses(
          client,
          response.assignment_id,
          checkinId,
          response.question_id,
          response.answer_value || "",
          patientId,
        );
      }

      for (const photo of body.photos ?? []) {
        if (!photo.base64) continue;

        const mimeType = photo.mimeType ?? "image/jpeg";
        const extension = extensionFromMime(mimeType);
        const storagePath = `${patientId}/${checkinId}/${Date.now()}-${randomUUID()}.${extension}`;
        const file = Buffer.from(photo.base64, "base64");

        const { error: uploadError } = await supabaseAdmin.storage
          .from(PHOTOS_BUCKET)
          .upload(storagePath, file, {
            contentType: mimeType,
            upsert: false,
          });

        if (uploadError) throw uploadError;

        await insertCheckinPhoto(
          client,
          checkinId,
          storagePath,
          photo.photo_type ?? "wound",
        );
      }

      await client.query("COMMIT");

      res.status(201).json({ success: true, checkinId });
    } catch (err) {
      await client.query("ROLLBACK");
      next(err);
    } finally {
      client.release();
    }
  },
);

router.get(
  "/checkins",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const patientId = await getPatientId(req, res);
      if (!patientId) return;

      const result = await getPatientCheckins(db, patientId);

      const rows = await Promise.all(
        result.rows.map(async (row) => {
          const photos = await Promise.all(
            (row.photos ?? []).map(
              async (photo: { id: number; uri: string }) => {
                const { data } = await supabaseAdmin.storage
                  .from(PHOTOS_BUCKET)
                  .createSignedUrl(photo.uri, 60 * 10);

                return {
                  id: photo.id,
                  uri: data?.signedUrl ?? "",
                };
              },
            ),
          );

          return { ...row, photos: photos.filter((photo) => photo.uri) };
        }),
      );

      res.json(rows);
    } catch (err) {
      next(err);
    }
  },
);

export default router;
