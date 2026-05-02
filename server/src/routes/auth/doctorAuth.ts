import { Router } from "express";
import type { Request, Response, NextFunction } from "express";
import { supabase } from "../../lib/supabase.js";
import db from "../../db/index.js";

const router = Router();

const GENERIC_RESPONSE = {
  message: "if the email is valid, a login code was sent",
};

// endpoint pentru cererea codului
router.post(
  "/request-code",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = req.body as { email?: string };
      const normalizedEmail = email?.trim().toLowerCase();

      if (!normalizedEmail) {
        res.json(GENERIC_RESPONSE);
        return;
      }

      // verifica daca medicul e activ in bd
      const result = await db.query<{ user_id: string }>(
        `SELECT user_id FROM postopcare.users
         WHERE email = $1 AND role = 'doctor' AND is_active = true`,
        [normalizedEmail]
      );

      if (result.rows.length === 0) {
        res.json(GENERIC_RESPONSE);
        return;
      }

      // trimite emailul cu codul
      const { error } = await supabase.auth.signInWithOtp({
        email: normalizedEmail,
        options: { shouldCreateUser: false },
      });

      if (error) {
        console.error(`OTP send failed: ${error.message}`);
        const status = error.message.includes("rate limit") ? 429 : 502;
        res.status(status).json({ error: error.message });
        return;
      }

      console.log(`OTP send accepted for ${normalizedEmail}`);

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
        token: code,
        type: "email",
      });

      if (error || !data.session || !data.user) {
        res.status(401).json({ error: "invalid or expired code" });
        return;
      }

      const userId = data.user.id;

      // ia datele generale ale userului
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

      if (!user || user.role !== "doctor" || !user.is_active) {
        res.status(401).json({ error: "access denied" });
        return;
      }

      // ia datele de medic si spital
      const doctorResult = await db.query<{
        specialization: string;
        notification_pref: string;
        hospital_name: string | null;
      }>(
        `SELECT d.specialization, d.notification_pref, h.hospital_name
         FROM postopcare.doctors d
         LEFT JOIN postopcare.hospitals h ON h.hospital_id = d.hospital_id
         WHERE d.user_id = $1`,
        [userId]
      );

      const doctor = doctorResult.rows[0];

      res.json({
        session: data.session,
        user: {
          userId: user.user_id,
          email: user.email,
          role: user.role,
          firstName: user.first_name,
          lastName: user.last_name,
        },
        doctor: {
          specialization: doctor?.specialization ?? null,
          hospitalName: doctor?.hospital_name ?? null,
          notificationPref: doctor?.notification_pref ?? null,
        },
      });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
