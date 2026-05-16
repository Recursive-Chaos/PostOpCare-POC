import { Router } from "express";
import type { Request, Response, NextFunction } from "express";
import type { PoolClient } from "pg";
import { supabase } from "../../lib/supabase.js";
import db from "../../db/index.js";
import {
  getDoctorQuestionnaireTemplates,
  insertQuestionnaireTemplate,
  updateQuestionnaireTemplate,
  deleteQuestionnaireTemplate,
  deleteUnreferencedTemplateQuestionsExcept,
  dropQuestionPhotoConstraint,
  addQuestionPhotoConstraint,
  insertQuestion,
  updateQuestion,
} from "../../db/queries.js";

const router = Router();

const questionTypes = ["text", "scale", "boolean", "choice", "photo"];

type QuestionnaireQuestionInput = {
  question_id?: number;
  question_text?: string;
  answer_type?: string;
  options_json?: unknown;
};

type QuestionnaireBody = {
  title?: string;
  description?: string;
  questions?: QuestionnaireQuestionInput[];
};

function optionalNumber(value: unknown) {
  return value === undefined || value === null || value === ""
    ? null
    : Number(value);
}

function normalizeScaleOptions(optionsJson: unknown) {
  if (
    !optionsJson ||
    typeof optionsJson !== "object" ||
    Array.isArray(optionsJson)
  ) {
    return null;
  }

  const raw = optionsJson as {
    min?: unknown;
    max?: unknown;
    unit?: unknown;
    normal_min?: unknown;
    normal_max?: unknown;
    thresholds?: unknown;
  };

  const min = Number(raw.min);
  const max = Number(raw.max);
  const normalMin = optionalNumber(raw.normal_min);
  const normalMax = optionalNumber(raw.normal_max);

  if (!validRange(min, max) || !validOptionalRange(normalMin, normalMax)) {
    return null;
  }

  return {
    min,
    max,
    unit: typeof raw.unit === "string" ? raw.unit.trim() : "",
    normal_min: normalMin,
    normal_max: normalMax,
  };
}

function validRange(min: number, max: number) {
  return Number.isFinite(min) && Number.isFinite(max) && min <= max;
}

function validOptionalRange(min: number | null, max: number | null) {
  const minOk = min === null || Number.isFinite(min);
  const maxOk = max === null || Number.isFinite(max);
  return minOk && maxOk && (min === null || max === null || min <= max);
}

function readQuestionnaireBody(body: QuestionnaireBody, res: Response) {
  const title = body.title?.trim();
  const description = body.description?.trim() || null;
  const questions = body.questions ?? [];

  if (!title) {
    res.status(400).json({ error: "title is required" });
    return null;
  }

  if (questions.length === 0) {
    res.status(400).json({ error: "questions are required" });
    return null;
  }

  return { title, description, questions };
}

async function saveQuestions(
  client: PoolClient,
  templateId: number,
  questions: QuestionnaireQuestionInput[],
  res: Response,
) {
  const savedQuestionIds: number[] = [];

  for (let i = 0; i < questions.length; i += 1) {
    const question = questions[i];
    const text = question.question_text?.trim();
    const type = question.answer_type || "text";

    if (!text || !questionTypes.includes(type)) {
      await client.query("ROLLBACK");
      res.status(400).json({ error: "invalid question" });
      return false;
    }

    let options: unknown = null;

    if (type === "choice") {
      options = Array.isArray(question.options_json)
        ? question.options_json
            .map((option) => String(option).trim())
            .filter(Boolean)
        : [];
    }

    if (type === "scale") {
      options = normalizeScaleOptions(question.options_json);

      if (!options) {
        await client.query("ROLLBACK");
        res.status(400).json({ error: "invalid scale options" });
        return false;
      }
    }

    if (type === "photo") {
      await dropQuestionPhotoConstraint(client);
      await addQuestionPhotoConstraint(client);
    }

    if (Number.isInteger(question.question_id)) {
      const updateResult = await updateQuestion(
        client,
        Number(question.question_id),
        templateId,
        text,
        type,
        options,
        i,
      );

      if (updateResult.rows.length > 0) {
        savedQuestionIds.push(updateResult.rows[0].question_id);
        continue;
      }
    }

    const insertResult = await insertQuestion(
      client,
      templateId,
      text,
      type,
      options,
      i,
    );
    const insertedQuestionId = insertResult.rows?.[0]?.question_id;
    if (insertedQuestionId) savedQuestionIds.push(insertedQuestionId);
  }

  return savedQuestionIds;
}

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

    const result = await getDoctorQuestionnaireTemplates(db, doctorId);

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

    const body = readQuestionnaireBody(req.body as QuestionnaireBody, res);
    if (!body) return;

    await client.query("BEGIN");

    const templateResult = await insertQuestionnaireTemplate(
      client,
      doctorId,
      body.title,
      body.description,
    );

    const templateId = templateResult.rows[0].template_id;

    const savedQuestionIds = await saveQuestions(
      client,
      templateId,
      body.questions,
      res,
    );
    if (!savedQuestionIds) return;

    await client.query("COMMIT");

    res.status(201).json({ success: true, template_id: templateId });
  } catch (err) {
    await client.query("ROLLBACK");
    next(err);
  } finally {
    client.release();
  }
});

router.put("/:id", async (req: Request, res: Response, next: NextFunction) => {
  const client = await db.connect();

  try {
    const doctorId = await getDoctorId(req, res);
    if (!doctorId) return;

    const templateId = Number(req.params.id);
    const body = readQuestionnaireBody(req.body as QuestionnaireBody, res);
    if (!body) return;

    if (!Number.isInteger(templateId)) {
      res.status(400).json({ error: "invalid questionnaire" });
      return;
    }

    await client.query("BEGIN");

    const templateResult = await updateQuestionnaireTemplate(
      client,
      templateId,
      doctorId,
      body.title,
      body.description,
    );

    if (templateResult.rows.length === 0) {
      await client.query("ROLLBACK");
      res.status(404).json({ error: "questionnaire not found" });
      return;
    }

    const savedQuestionIds = await saveQuestions(
      client,
      templateId,
      body.questions,
      res,
    );
    if (!savedQuestionIds) return;
    await deleteUnreferencedTemplateQuestionsExcept(
      client,
      templateId,
      savedQuestionIds,
    );

    await client.query("COMMIT");

    res.json({ success: true, template_id: templateId });
  } catch (err) {
    await client.query("ROLLBACK");
    next(err);
  } finally {
    client.release();
  }
});

router.delete(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const doctorId = await getDoctorId(req, res);
      if (!doctorId) return;

      const templateId = Number(req.params.id);

      if (!Number.isInteger(templateId)) {
        res.status(400).json({ error: "invalid questionnaire" });
        return;
      }

      await deleteQuestionnaireTemplate(db, templateId, doctorId);

      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
);

export default router;
