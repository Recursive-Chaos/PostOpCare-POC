import { Router } from "express";
import type { Request, Response, NextFunction } from "express";
import { supabase } from "../../lib/supabase.js";
import db from "../../db/index.js";

const router = Router();

const questionTypes = ["text", "scale", "boolean", "choice", "photo"];

async function getDoctorId(req: Request, res: Response) {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) {
    res.status(401).json({ error: "doctor login is required" });
    return null;
  }

  const { data: authData, error: authError } =
    await supabase.auth.getUser(token);
  if (authError || !authData.user) {
    res.status(401).json({ error: "doctor login is required" });
    return null;
  }

  return authData.user.id;
}

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const doctorId = await getDoctorId(req, res);
    if (!doctorId) return;

    const result = await db.query(
      `SELECT
          qt.template_id,
          qt.title,
          qt.description,
          qt.created_at,
          COALESCE(
            json_agg(
              json_build_object(
                'question_id', q.question_id,
                'question_text', q.question_text,
                'answer_type', q.answer_type,
                'options_json', q.options_json,
                'order_index', q.order_index
              )
              ORDER BY q.order_index
            ) FILTER (WHERE q.question_id IS NOT NULL),
            '[]'
          ) AS questions
         FROM postopcare.questionnaire_templates qt
         LEFT JOIN postopcare.questions q ON q.template_id = qt.template_id
         WHERE qt.doctor_id = $1
         GROUP BY qt.template_id
         ORDER BY qt.created_at DESC`,
      [doctorId],
    );

    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  const client = await db.connect();

  try {
    const doctorId = await getDoctorId(req, res);
    if (!doctorId) return;

    const body = req.body as {
      title?: string;
      description?: string;
      questions?: {
        question_text?: string;
        answer_type?: string;
        options_json?: unknown;
      }[];
    };

    const title = body.title?.trim();
    const description = body.description?.trim() || null;
    const questions = body.questions ?? [];

    if (!title) {
      res.status(400).json({ error: "title is required" });
      return;
    }

    if (questions.length === 0) {
      res.status(400).json({ error: "questions are required" });
      return;
    }

    await client.query("BEGIN");

    const templateResult = await client.query<{ template_id: number }>(
      `INSERT INTO postopcare.questionnaire_templates (doctor_id, title, description)
         VALUES ($1, $2, $3)
         RETURNING template_id`,
      [doctorId, title, description],
    );

    const templateId = templateResult.rows[0].template_id;

    for (let i = 0; i < questions.length; i += 1) {
      const question = questions[i];
      const text = question.question_text?.trim();
      const type = question.answer_type || "text";

      if (!text || !questionTypes.includes(type)) {
        await client.query("ROLLBACK");
        res.status(400).json({ error: "invalid question" });
        return;
      }

      let options: unknown = null;

      if (type === "choice") {
        options = Array.isArray(question.options_json)
          ? question.options_json
              .map((option) => String(option).trim())
              .filter(Boolean)
          : [];
      }

      if (type === "scale" && typeof question.options_json === "object") {
        options = question.options_json;
      }

      if (type === "photo") {
        await client.query(
          `ALTER TABLE postopcare.questions
             DROP CONSTRAINT IF EXISTS questions_answer_type_check`,
        );
        await client.query(
          `ALTER TABLE postopcare.questions
             ADD CONSTRAINT questions_answer_type_check
             CHECK (answer_type IN ('scale', 'boolean', 'text', 'choice', 'photo'))`,
        );
      }

      await client.query(
        `INSERT INTO postopcare.questions
           (template_id, question_text, answer_type, options_json, order_index)
           VALUES ($1, $2, $3, $4, $5)`,
        [templateId, text, type, options ? JSON.stringify(options) : null, i],
      );
    }

    await client.query("COMMIT");

    res.status(201).json({ success: true, template_id: templateId });
  } catch (err) {
    await client.query("ROLLBACK");
    next(err);
  } finally {
    client.release();
  }
});

export default router;
