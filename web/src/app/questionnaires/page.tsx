"use client";

import { FormEvent, useEffect, useState } from "react";
import AppLayout from "../components/AppLayout";
import styles from "../page.module.css";
import { t } from "@shared/translations";
import { API_URL, authFetch } from "../lib/api";

type Question = {
  question_id?: number;
  question_text: string;
  answer_type: string;
  choice_text: string;
  scale_min: string;
  scale_max: string;
  unit: string;
  normal_min: string;
  normal_max: string;
  options_json?: any;
};

type Template = {
  template_id: number;
  title: string;
  description: string | null;
  questions: Question[];
};

const emptyQuestion = (): Question => ({
  question_text: "",
  answer_type: "text",
  choice_text: "",
  scale_min: "1",
  scale_max: "10",
  unit: "",
  normal_min: "",
  normal_max: "",
});

function optionsFor(question: Question) {
  if (question.answer_type === "choice") {
    return question.choice_text
      .split(",")
      .map((option) => option.trim())
      .filter(Boolean);
  }

  if (question.answer_type === "scale") {
    return {
      min: Number(question.scale_min),
      max: Number(question.scale_max),
      unit: question.unit.trim(),
      normal_min:
        question.normal_min === "" ? null : Number(question.normal_min),
      normal_max:
        question.normal_max === "" ? null : Number(question.normal_max),
    };
  }

  return null;
}

function scaleNormalText(options: any) {
  const normalMin = options.normal_min ?? options.thresholds?.[0]?.min;
  const normalMax = options.normal_max ?? options.thresholds?.[0]?.max;

  if (normalMin === undefined && normalMax === undefined) return "";

  return `${t("normalLabel")}: ${normalMin ?? "-∞"}-${normalMax ?? "+∞"}`;
}

function showOptions(question: Question) {
  const options = question.options_json;

  if (question.answer_type === "choice" && Array.isArray(options)) {
    return options.join(", ");
  }

  if (question.answer_type === "scale" && options) {
    const range = `${options.min ?? ""}-${options.max ?? ""}${options.unit ? ` ${options.unit}` : ""}`;
    const normal = scaleNormalText(options);

    return normal ? `${range} | ${normal}` : range;
  }

  return "";
}

function questionFromTemplate(question: Question): Question {
  const options = question.options_json;

  if (question.answer_type === "choice" && Array.isArray(options)) {
    return {
      ...emptyQuestion(),
      ...question,
      choice_text: options.join(", "),
    };
  }

  if (question.answer_type === "scale" && options) {
    const legacyThreshold = Array.isArray(options.thresholds)
      ? options.thresholds[0]
      : null;

    return {
      ...emptyQuestion(),
      ...question,
      scale_min: String(options.min ?? "1"),
      scale_max: String(options.max ?? "10"),
      unit: options.unit ?? "",
      normal_min:
        options.normal_min === null
          ? ""
          : String(options.normal_min ?? legacyThreshold?.min ?? ""),
      normal_max:
        options.normal_max === null
          ? ""
          : String(options.normal_max ?? legacyThreshold?.max ?? ""),
    };
  }

  return { ...emptyQuestion(), ...question };
}

export default function QuestionnairesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState<Question[]>([emptyQuestion()]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState("");

  async function loadTemplates() {
    setLoading(true);
    try {
      const res = await authFetch(`${API_URL}/doctor/questionnaires`);

      if (res.ok) {
        setTemplates(await res.json());
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTemplates();
  }, []);

  function updateQuestion(index: number, value: Partial<Question>) {
    setQuestions((oldQuestions) =>
      oldQuestions.map((question, i) =>
        i === index ? { ...question, ...value } : question,
      ),
    );
  }

  async function submitForm(event: FormEvent) {
    event.preventDefault();
    setError("");
    setSaving(true);

    const cleanQuestions = questions.map((question) => ({
      question_id: question.question_id,
      question_text: question.question_text.trim(),
      answer_type: question.answer_type,
      options_json: optionsFor(question),
    }));

    try {
      const url = editingId
        ? `${API_URL}/doctor/questionnaires/${editingId}`
        : `${API_URL}/doctor/questionnaires`;
      const res = await authFetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          questions: cleanQuestions,
        }),
      });

      if (!res.ok) {
        setError(t("questionnaireSaveError"));
        return;
      }

      resetForm();
      await loadTemplates();
    } finally {
      setSaving(false);
    }
  }

  function editTemplate(template: Template) {
    setEditingId(template.template_id);
    setTitle(template.title);
    setDescription(template.description ?? "");
    setQuestions(template.questions.map(questionFromTemplate));
    setError("");
  }

  function resetForm() {
    setEditingId(null);
    setTitle("");
    setDescription("");
    setQuestions([emptyQuestion()]);
    setError("");
  }

  function addQuestion() {
    setQuestions((oldQuestions) => [...oldQuestions, emptyQuestion()]);
  }

  function removeQuestion(index: number) {
    setQuestions((oldQuestions) => oldQuestions.filter((_, i) => i !== index));
  }

  async function deleteTemplate(templateId: number) {
    setError("");

    const res = await authFetch(
      `${API_URL}/doctor/questionnaires/${templateId}`,
      { method: "DELETE" },
    );

    if (!res.ok) {
      setError(t("questionnaireDeleteError"));
      return;
    }

    if (editingId === templateId) {
      resetForm();
    }

    await loadTemplates();
  }

  return (
    <AppLayout>
      <section className={styles.section}>
        <div className={styles.pageHeader}>
          <h2>{t("questionnairesTitle")}</h2>
          <span className={styles.count}>{templates.length}</span>
        </div>

        <form className={styles.form} onSubmit={submitForm}>
          {editingId && (
            <div className={styles.editingNotice}>
              {t("editingQuestionnaireNotice")}
              <button
                className={styles.secondaryButton}
                type="button"
                onClick={resetForm}
              >
                {t("cancelEdit")}
              </button>
            </div>
          )}
          <input
            className={styles.input}
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder={t("questionnaireTitlePlaceholder")}
          />
          <textarea
            className={styles.textarea}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder={t("questionnaireDescriptionPlaceholder")}
          />

          {questions.map((question, index) => (
            <div className={styles.questionBox} key={index}>
              <input
                className={styles.input}
                value={question.question_text}
                onChange={(event) =>
                  updateQuestion(index, { question_text: event.target.value })
                }
                placeholder={`${t("questionPlaceholderPrefix")} ${index + 1}`}
              />
              <select
                className={styles.input}
                value={question.answer_type}
                onChange={(event) =>
                  updateQuestion(index, { answer_type: event.target.value })
                }
              >
                <option value="text">{t("questionTypeText")}</option>
                <option value="scale">{t("questionTypeScale")}</option>
                <option value="boolean">{t("questionTypeBoolean")}</option>
                <option value="choice">{t("questionTypeChoice")}</option>
                <option value="photo">{t("questionTypePhoto")}</option>
              </select>

              {question.answer_type === "choice" && (
                <input
                  className={styles.input}
                  value={question.choice_text}
                  onChange={(event) =>
                    updateQuestion(index, { choice_text: event.target.value })
                  }
                  placeholder={t("choicePlaceholder")}
                />
              )}

              {question.answer_type === "scale" && (
                <div className={styles.scaleSettings}>
                  <div className={styles.inlineFields}>
                    <input
                      className={styles.input}
                      type="number"
                      value={question.scale_min}
                      onChange={(event) =>
                        updateQuestion(index, { scale_min: event.target.value })
                      }
                      placeholder={t("scaleMinPlaceholder")}
                    />
                    <input
                      className={styles.input}
                      type="number"
                      value={question.scale_max}
                      onChange={(event) =>
                        updateQuestion(index, { scale_max: event.target.value })
                      }
                      placeholder={t("scaleMaxPlaceholder")}
                    />
                    <input
                      className={styles.input}
                      value={question.unit}
                      onChange={(event) =>
                        updateQuestion(index, { unit: event.target.value })
                      }
                      placeholder={t("unitOptionalPlaceholder")}
                    />
                  </div>

                  <div className={styles.thresholds}>
                    <div className={styles.thresholdHeader}>
                      <span>{t("normalIntervalLabel")}</span>
                      <p>{t("normalIntervalHelp")}</p>
                    </div>
                    <div className={styles.thresholdRow}>
                      <input
                        className={styles.input}
                        type="number"
                        value={question.normal_min}
                        onChange={(event) =>
                          updateQuestion(index, {
                            normal_min: event.target.value,
                          })
                        }
                        placeholder={t("normalMinOptionalPlaceholder")}
                      />
                      <input
                        className={styles.input}
                        type="number"
                        value={question.normal_max}
                        onChange={(event) =>
                          updateQuestion(index, {
                            normal_max: event.target.value,
                          })
                        }
                        placeholder={t("normalMaxOptionalPlaceholder")}
                      />
                    </div>
                  </div>
                </div>
              )}

              {questions.length > 1 && (
                <button
                  className={styles.secondaryButton}
                  type="button"
                  onClick={() => removeQuestion(index)}
                >
                  {t("deleteBtn")}
                </button>
              )}
            </div>
          ))}

          {error && <p className={styles.error}>{error}</p>}

          <div className={styles.actions}>
            <button
              className={styles.secondaryButton}
              type="button"
              onClick={addQuestion}
            >
              {t("addQuestionBtn")}
            </button>
            <button
              className={styles.primaryButton}
              disabled={saving}
              type="submit"
            >
              {saving
                ? t("savingQuestionnaireBtn")
                : editingId
                  ? t("saveChangesBtn")
                  : t("saveQuestionnaireBtn")}
            </button>
          </div>
        </form>
      </section>

      <section className={styles.section}>
        <h2>{t("myQuestionnairesTitle")}</h2>
        {loading ? (
          <p>{t("loading")}</p>
        ) : templates.length === 0 ? (
          <p>{t("noQuestionnaires")}</p>
        ) : (
          <ul className={styles.list}>
            {templates.map((template) => (
              <li className={styles.templateCard} key={template.template_id}>
                <div>
                  <strong>{template.title}</strong>
                  {template.description && <p>{template.description}</p>}
                </div>
                <div className={styles.templateActions}>
                  <button
                    className={styles.secondaryButton}
                    type="button"
                    onClick={() => editTemplate(template)}
                  >
                    {t("editBtn")}
                  </button>
                  <button
                    className={styles.secondaryButton}
                    type="button"
                    onClick={() => deleteTemplate(template.template_id)}
                  >
                    {t("deleteBtn")}
                  </button>
                </div>
                <ol className={styles.questionList}>
                  {template.questions.map((question, index) => {
                    const options = showOptions(question);

                    return (
                      <li key={index}>
                        {question.question_text} ({question.answer_type})
                        {options && ` - ${options}`}
                      </li>
                    );
                  })}
                </ol>
              </li>
            ))}
          </ul>
        )}
      </section>
    </AppLayout>
  );
}
