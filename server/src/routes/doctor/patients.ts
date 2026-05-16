import { Router } from "express";
import type { Request, Response, NextFunction } from "express";
import { supabase, supabaseAdmin } from "../../lib/supabase.js";
import db from "../../db/index.js";
import {
  getDoctorPatients,
  checkDoctorExists,
  checkPatientBelongsToDoctor,
  insertProcedure,
  upsertPatient,
  insertQuestionnaireAssignmentWithDates,
  getPatientCheckins,
  getUserByEmail,
  insertUser,
  checkTemplateExists,
} from "../../db/queries.js";

const router = Router();

const valueOrNull = (value?: string) => value?.trim() || null;

// POST /doctor/patients/invite
router.post(
  "/invite",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        email,
        firstName,
        lastName,
        patientPhone,
        dateOfBirth,
        notes,
        surgeryType,
        surgeryDate,
        dischargeDate,
        monitoringEndDate,
        templateId,
      } = req.body as {
        email?: string;
        firstName?: string;
        lastName?: string;
        patientPhone?: string;
        dateOfBirth?: string;
        notes?: string;
        surgeryType?: string;
        surgeryDate?: string;
        dischargeDate?: string;
        monitoringEndDate?: string;
        templateId?: number;
      };

      const normalizedEmail = email?.trim().toLowerCase();
      const token = req.headers.authorization?.replace("Bearer ", "");

      if (!normalizedEmail) {
        res.status(400).json({ error: "email is required" });
        return;
      }

      if (!token) {
        res.status(401).json({ error: "doctor login is required" });
        return;
      }

      const { data: authData, error: authError } =
        await supabase.auth.getUser(token);

      if (authError || !authData.user) {
        res.status(401).json({ error: "doctor login is required" });
        return;
      }

      // doctorul se ia din token, nu din frontend
      const doctorId = authData.user.id;

      const patientFirstName = firstName?.trim() || "Pacient";
      const patientLastName = lastName?.trim() || "Invitat";

      // telefonul este acum optional (poate fi NULL in baza de date)
      const phone = patientPhone?.trim() || null;

      // Date validations
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Set to start of day for comparison

      // Date of birth should not be in the future
      if (dateOfBirth) {
        const dob = new Date(dateOfBirth);
        if (dob > today) {
          res.status(409).json({ error: "invalidDateOfBirth" });
          return;
        }
      }

      // Surgery date must be in the past
      if (surgeryDate) {
        const surgery = new Date(surgeryDate);
        if (surgery > today) {
          res.status(409).json({ error: "invalidSurgeryDate" });
          return;
        }
      }

      // Discharge date: must be after surgery and not in the future
      if (dischargeDate) {
        const discharge = new Date(dischargeDate);
        if (discharge > today) {
          res.status(409).json({ error: "invalidDischargeDate" });
          return;
        }
        if (surgeryDate) {
          const surgery = new Date(surgeryDate);
          if (discharge < surgery) {
            res.status(409).json({ error: "invalidDischargeDate" });
            return;
          }
        }
      }

      // Monitoring end date: must be after discharge date
      if (monitoringEndDate && dischargeDate) {
        const monitoringEnd = new Date(monitoringEndDate);
        const discharge = new Date(dischargeDate);
        if (monitoringEnd < discharge) {
          res.status(409).json({ error: "invalidMonitoringEndDate" });
          return;
        }
      }

      const doctorResult = await checkDoctorExists(db, doctorId);

      if (doctorResult.rows.length === 0) {
        res.status(403).json({ error: "doctor not found" });
        return;
      }

      if (!templateId) {
        res.status(400).json({ error: "questionnaire is required" });
        return;
      }

      const templateExists = await checkTemplateExists(
        db,
        templateId,
        doctorId,
      );

      if (!templateExists) {
        res.status(400).json({ error: "invalid questionnaire" });
        return;
      }

      const existingUser = await getUserByEmail(db, normalizedEmail);

      const user = existingUser.rows[0];

      if (user && user.role !== "patient") {
        res.status(409).json({ error: "email is already used" });
        return;
      }

      let patientId = user?.user_id;

      if (!patientId) {
        let supabaseUserId: string | undefined;

        // In Supabase v2, admin.listUsers() is the way to find users by email (or just try create and catch)
        // Since we want to link existing ones, we try to find first.
        const { data: userList } = await supabaseAdmin.auth.admin.listUsers();
        const existing = userList?.users.find(
          (u) => u.email === normalizedEmail,
        );

        if (existing) {
          supabaseUserId = existing.id;
        } else {
          const { data, error } = await supabaseAdmin.auth.admin.createUser({
            email: normalizedEmail,
            email_confirm: true,
          });

          if (error) {
            // Daca s-a creat intre timp de catre altcineva
            if (error.message.includes("already registered")) {
              const { data: retryList } =
                await supabaseAdmin.auth.admin.listUsers();
              supabaseUserId = retryList?.users.find(
                (u) => u.email === normalizedEmail,
              )?.id;
            } else {
              console.error("supabase createUser failed:", error.message);
              res.status(502).json({ error: error.message });
              return;
            }
          } else if (data.user) {
            supabaseUserId = data.user.id;
          }
        }

        if (!supabaseUserId) {
          res
            .status(502)
            .json({ error: "could not identify or create patient" });
          return;
        }

        patientId = supabaseUserId;

        try {
          await insertUser(
            db,
            patientId,
            normalizedEmail,
            patientFirstName,
            patientLastName,
            phone,
          );
        } catch (err) {
          if (
            typeof err === "object" &&
            err !== null &&
            "code" in err &&
            err.code === "23505" &&
            "constraint" in err &&
            err.constraint === "users_phone_key"
          ) {
            res
              .status(409)
              .json({ error: "numarul de telefon este deja folosit" });
            return;
          }

          throw err;
        }
      }

      await upsertPatient(
        db,
        patientId,
        doctorId,
        valueOrNull(dateOfBirth),
        valueOrNull(notes),
      );

      await insertProcedure(
        db,
        patientId,
        valueOrNull(surgeryType) || "N/A",
        valueOrNull(surgeryDate),
        valueOrNull(dischargeDate),
        valueOrNull(monitoringEndDate),
      );

      await insertQuestionnaireAssignmentWithDates(
        db,
        patientId,
        templateId,
        valueOrNull(monitoringEndDate),
      );

      res
        .status(user ? 200 : 201)
        .json({ success: true, patientId, existed: !!user });
    } catch (err) {
      next(err);
    }
  },
);

// GET /doctor/patients/
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) {
      res.status(401).json({ error: "doctor login is required" });
      return;
    }

    const { data: authData, error: authError } =
      await supabase.auth.getUser(token);
    if (authError || !authData.user) {
      res.status(401).json({ error: "doctor login is required" });
      return;
    }

    const doctorId = authData.user.id;

    const result = await getDoctorPatients(db, doctorId);

    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

// GET /doctor/patients/:id/checkins
router.get(
  "/:id/checkins",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization?.replace("Bearer ", "");
      if (!token) {
        res.status(401).json({ error: "doctor login is required" });
        return;
      }

      const { data: authData, error: authError } =
        await supabase.auth.getUser(token);
      if (authError || !authData.user) {
        res.status(401).json({ error: "doctor login is required" });
        return;
      }

      const patientId = req.params.id as string;
      const doctorId = authData.user.id;

      const belongs = await checkPatientBelongsToDoctor(
        db,
        patientId,
        doctorId,
      );
      if (belongs.rows.length === 0) {
        res.status(403).json({ error: "patient not found or access denied" });
        return;
      }

      const result = await getPatientCheckins(db, patientId);

      const rows = await Promise.all(
        result.rows.map(async (row) => {
          const photos = await Promise.all(
            (row.photos ?? []).map(
              async (photo: { id: number; uri: string }) => {
                const { data } = await supabaseAdmin.storage
                  .from("photos")
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
