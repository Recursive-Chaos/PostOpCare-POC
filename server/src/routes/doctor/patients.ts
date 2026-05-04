import { Router } from "express";
import type { Request, Response, NextFunction } from "express";
import { supabase, supabaseAdmin } from "../../lib/supabase.js";
import db from "../../db/index.js";

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

      const doctorResult = await db.query<{ user_id: string }>(
        `SELECT user_id FROM postopcare.users
         WHERE user_id = $1 AND role = 'doctor' AND is_active = true`,
        [doctorId]
      );

      if (doctorResult.rows.length === 0) {
        res.status(403).json({ error: "doctor not found" });
        return;
      }

      const existingUser = await db.query<{
        user_id: string;
        role: string;
      }>(
        `SELECT user_id, role
         FROM postopcare.users WHERE email = $1`,
        [normalizedEmail]
      );

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
        const existing = userList?.users.find(u => u.email === normalizedEmail);

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
               const { data: retryList } = await supabaseAdmin.auth.admin.listUsers();
               supabaseUserId = retryList?.users.find(u => u.email === normalizedEmail)?.id;
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
          res.status(502).json({ error: "could not identify or create patient" });
          return;
        }

        patientId = supabaseUserId;

        await db.query(
          `INSERT INTO postopcare.users
           (user_id, email, password_hash, role, first_name, last_name, phone, is_active)
           VALUES ($1, $2, $3, 'patient', $4, $5, $6, true)`,
          [patientId, normalizedEmail, "managed_by_supabase", patientFirstName, patientLastName, phone]
        );
      }

      await db.query(
        `INSERT INTO postopcare.patients (user_id, doctor_id, date_of_birth, notes)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (user_id)
         DO UPDATE SET doctor_id = EXCLUDED.doctor_id,
                       date_of_birth = EXCLUDED.date_of_birth,
                       notes = EXCLUDED.notes`,
        [patientId, doctorId, valueOrNull(dateOfBirth), valueOrNull(notes)]
      );

      await db.query(
        `INSERT INTO postopcare.procedures
         (patient_id, surgery_type, surgery_date, discharge_date, monitoring_end_date)
         VALUES ($1, $2, $3, $4, $5)`,
        [
          patientId,
          valueOrNull(surgeryType),
          valueOrNull(surgeryDate),
          valueOrNull(dischargeDate),
          valueOrNull(monitoringEndDate),
        ]
      );

      res.status(user ? 200 : 201).json({ success: true, patientId, existed: !!user });
    } catch (err) {
      next(err);
    }
  }
);

// GET /doctor/patients/
router.get(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization?.replace("Bearer ", "");
      if (!token) {
        res.status(401).json({ error: "doctor login is required" });
        return;
      }

      const { data: authData, error: authError } = await supabase.auth.getUser(token);
      if (authError || !authData.user) {
        res.status(401).json({ error: "doctor login is required" });
        return;
      }

      const doctorId = authData.user.id;

      const result = await db.query(
        `SELECT 
          u.user_id, u.email, u.first_name, u.last_name, u.phone,
          p.date_of_birth, p.notes,
          proc.surgery_type, proc.surgery_date, proc.discharge_date, proc.monitoring_end_date
         FROM postopcare.users u
         JOIN postopcare.patients p ON u.user_id = p.user_id
         LEFT JOIN postopcare.procedures proc ON u.user_id = proc.patient_id
         WHERE p.doctor_id = $1
         ORDER BY proc.surgery_date DESC NULLS LAST`,
        [doctorId]
      );

      res.json(result.rows);
    } catch (err) {
      next(err);
    }
  }
);

export default router;
