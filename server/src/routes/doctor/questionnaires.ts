import { Router } from "express";
import type { Request, Response, NextFunction } from "express";
import { supabase } from "../../lib/supabase.js";
import db from "../../db/index.js";

const router = Router();

// GET /doctor/questionnaires
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
        `SELECT * FROM postopcare.questionnaire_templates 
         WHERE doctor_id = $1 
         ORDER BY created_at DESC`,
        [doctorId]
      );

      res.json(result.rows);
    } catch (err) {
      next(err);
    }
  }
);

export default router;
