import { Router } from "express";
import type { Request, Response, NextFunction } from "express";
import { supabase } from "../../lib/supabase.js";
import db from "../../db/index.js";
import {
  getUserProfile,
  getDoctorProfile,
  getPatientProfile,
} from "../../db/queries.js";

const router = Router();

// GET /auth/me
// trimite Authorization: Bearer <access_token>
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ error: "header invalid" });
      return;
    }

    const token = authHeader.slice(7); // scoate "Bearer "

    // valideaza token-ul cu Supabase
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      res.status(401).json({ error: "invalid or expired token" });
      return;
    }

    const userId = data.user.id;

    // preia profilul din DB
    const userResult = await getUserProfile(db, userId);

    const user = userResult.rows[0];

    if (!user || !user.is_active) {
      res.status(401).json({ error: "access denied" });
      return;
    }

    // datele de baza, comune tuturor rolurilor
    const userPayload = {
      userId: user.user_id,
      email: user.email,
      role: user.role,
      firstName: user.first_name,
      lastName: user.last_name,
    };

    if (user.role === "doctor") {
      const doctorResult = await getDoctorProfile(db, userId);

      const doctor = doctorResult.rows[0];

      res.json({
        user: userPayload,
        doctor: {
          specialization: doctor?.specialization ?? null,
          hospitalName: doctor?.hospital_name ?? null,
          notificationPref: doctor?.notification_pref ?? null,
        },
      });
      return;
    }

    if (user.role === "patient") {
      const patientResult = await getPatientProfile(db, userId);

      const patient = patientResult.rows[0];

      res.json({
        user: userPayload,
        patient: {
          doctorId: patient?.doctor_id ?? null,
          dateOfBirth: patient?.date_of_birth ?? null,
        },
      });
      return;
    }

    // returneaza doar datele de user
    res.json({ user: userPayload });
  } catch (err) {
    next(err);
  }
});

export default router;
