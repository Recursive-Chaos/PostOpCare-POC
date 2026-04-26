import { Router } from "express";
import type { Request, Response, NextFunction } from "express";
import { supabase } from "../../lib/supabase.js";
import db from "../../db/index.js";

const router = Router();

// mesaj generic, nu vrem sa aflam daca mailul exista sau nu
const GENERIC_RESPONSE = {
  message: "if the email is valid, a login code was sent",
};

// POST /auth/patient/request-code
router.post(
  "/request-code",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = req.body as { email?: string };

      if (!email) {
        // returnam ok si la eroare ca sa nu dam indicii
        res.json(GENERIC_RESPONSE);
        return;
      }

      // verifica daca e pacient activ
      const userResult = await db.query<{ user_id: string }>(
        `SELECT user_id FROM postopcare.users
         WHERE email = $1 AND role = 'patient' AND is_active = true`,
        [email]
      );

      if (userResult.rows.length === 0) {
        // nu exista, dam mesaj generic oricum
        res.json(GENERIC_RESPONSE);
        return;
      }

      // trimite OTP via supabase, doar daca userul exista in auth.users
      await supabase.auth.signInWithOtp({
        email,
        options: { shouldCreateUser: false },
      });

      // ascundem mereu rezultatul operatiunii
      res.json(GENERIC_RESPONSE);
    } catch (err) {
      next(err);
    }
  }
);

// POST /auth/patient/verify-code
router.post(
  "/verify-code",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, code } = req.body as { email?: string; code?: string };

      if (!email || !code) {
        res.status(400).json({ error: "email and code are required" });
        return;
      }

      // valideaza codul primit
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: code,
        type: "magiclink",
      });

      if (error || !data.session || !data.user) {
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
        },
      });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
