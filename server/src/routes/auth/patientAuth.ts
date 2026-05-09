import { Router } from "express";
import type { Request, Response, NextFunction } from "express";
import { supabase } from "../../lib/supabase.js";
import db from "../../db/index.js";

const router = Router();

// mesaj generic, nu vrem sa afisam daca mailul exista sau nu
const GENERIC_RESPONSE = {
  message: "if the email is valid, a login code was sent",
};

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
        [normalizedEmail]
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
        console.error(`OTP send failed for ${normalizedEmail}: ${error.message}`);
        const status = error.message.toLowerCase().includes("rate limit") ? 429 : 502;
        res.status(status).json({ error: error.message });
        return;
      }

      // ascundem rezultatul operatiunii pt ca 
      res.json(GENERIC_RESPONSE);
    } catch (err) {
      next(err);
    }
  }
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
        console.error(`Verify OTP Error for ${normalizedEmail}:`, error?.message || 'No session/user');
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
        [userId]
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
        [userId]
      );

      const patient = patientResult.rows[0];

      // procedura medicala
      const procedureResult = await db.query<{
        surgery_type: string;
        surgery_date: string;
      }>(
        `SELECT surgery_type, surgery_date FROM postopcare.procedures WHERE patient_id = $1 ORDER BY surgery_date DESC LIMIT 1`,
        [userId]
      );
      const procedure = procedureResult.rows[0];

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
      });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
