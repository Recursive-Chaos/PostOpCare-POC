"use client";

import { FormEvent, useEffect, useState } from "react";
import AppLayout from "../components/AppLayout";
import styles from "../page.module.css";
import { t } from "@shared/translations";
import { API_URL, authFetch } from "../lib/api";

type Question = {
  question_text: string;
  answer_type: string;
  choice_text: string;
  scale_min: string;
  scale_max: string;
  unit: string;
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
    };
  }

  return null;
}

function showOptions(question: Question) {
  const options = question.options_json;

  if (question.answer_type === "choice" && Array.isArray(options)) {
    return options.join(", ");
  }

  if (question.answer_type === "scale" && options) {
    return `${options.min ?? ""}-${options.max ?? ""}${options.unit ? ` ${options.unit}` : ""}`;
  }

  return "";
}

export default function QuestionnairesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState<Question[]>([emptyQuestion()]);
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
      question_text: question.question_text.trim(),
      answer_type: question.answer_type,
      options_json: optionsFor(question),
    }));

    try {
      const res = await authFetch(`${API_URL}/doctor/questionnaires`, {
        method: "POST",
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
        setError("Nu s-a putut salva chestionarul");
        return;
      }

      setTitle("");
      setDescription("");
      setQuestions([emptyQuestion()]);
      await loadTemplates();
    } finally {
      setSaving(false);
    }
  }

  return (
    <AppLayout>
      <section className={styles.section}>
        <div className={styles.pageHeader}>
          <h2>{t("questionnairesTitle")}</h2>
          <span className={styles.count}>{templates.length}</span>
        </div>

        <form className={styles.form} onSubmit={submitForm}>
          <input
            className={styles.input}
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Titlu chestionar"
          />
          <textarea
            className={styles.textarea}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Descriere"
          />

          {questions.map((question, index) => (
            <div className={styles.questionBox} key={index}>
              <input
                className={styles.input}
                value={question.question_text}
                onChange={(event) =>
                  updateQuestion(index, { question_text: event.target.value })
                }
                placeholder={`Intrebarea ${index + 1}`}
              />
              <select
                className={styles.input}
                value={question.answer_type}
                onChange={(event) =>
                  updateQuestion(index, { answer_type: event.target.value })
                }
              >
                <option value="text">Text</option>
                <option value="scale">Scala</option>
                <option value="boolean">Da/Nu</option>
                <option value="choice">Alegere</option>
                <option value="photo">Poza</option>
              </select>

              {question.answer_type === "choice" && (
                <input
                  className={styles.input}
                  value={question.choice_text}
                  onChange={(event) =>
                    updateQuestion(index, { choice_text: event.target.value })
                  }
                  placeholder="ex: putin, mediu, mult"
                />
              )}

              {question.answer_type === "scale" && (
                <div className={styles.inlineFields}>
                  <input
                    className={styles.input}
                    type="number"
                    value={question.scale_min}
                    onChange={(event) =>
                      updateQuestion(index, { scale_min: event.target.value })
                    }
                    placeholder="Min"
                  />
                  <input
                    className={styles.input}
                    type="number"
                    value={question.scale_max}
                    onChange={(event) =>
                      updateQuestion(index, { scale_max: event.target.value })
                    }
                    placeholder="Max"
                  />
                  <input
                    className={styles.input}
                    value={question.unit}
                    onChange={(event) =>
                      updateQuestion(index, { unit: event.target.value })
                    }
                    placeholder="Unitate"
                  />
                </div>
              )}

              {questions.length > 1 && (
                <button
                  className={styles.secondaryButton}
                  type="button"
                  onClick={() =>
                    setQuestions((oldQuestions) =>
                      oldQuestions.filter((_, i) => i !== index),
                    )
                  }
                >
                  Sterge
                </button>
              )}
            </div>
          ))}

          {error && <p className={styles.error}>{error}</p>}

          <div className={styles.actions}>
            <button
              className={styles.secondaryButton}
              type="button"
              onClick={() =>
                setQuestions((oldQuestions) => [
                  ...oldQuestions,
                  emptyQuestion(),
                ])
              }
            >
              Adauga intrebare
            </button>
            <button
              className={styles.primaryButton}
              disabled={saving}
              type="submit"
            >
              {saving ? "Se salveaza" : "Salveaza chestionar"}
            </button>
          </div>
        </form>
      </section>

      <section className={styles.section}>
        <h2>Chestionarele mele</h2>
        {loading ? (
          <p>{t("loading")}</p>
        ) : templates.length === 0 ? (
          <p>Nu exista chestionare.</p>
        ) : (
          <ul className={styles.list}>
            {templates.map((template) => (
              <li className={styles.templateCard} key={template.template_id}>
                <div>
                  <strong>{template.title}</strong>
                  {template.description && <p>{template.description}</p>}
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
