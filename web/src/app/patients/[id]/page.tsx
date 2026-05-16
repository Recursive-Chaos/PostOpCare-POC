"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import AppLayout from "../../components/AppLayout";
import styles from "../../page.module.css";
import { API_URL, authFetch } from "../../lib/api";
import { t } from "@shared/translations";

type CheckinResponse = {
  question: string;
  answer: string;
  answer_type?: string;
  options_json?: any;
};

const fmt = (iso?: string | null, time = false) => {
  if (!iso) return t("emptyValue");
  const d = new Date(iso);
  const date = d.toLocaleDateString("ro-RO");
  return time
    ? `${date} ${d.toLocaleTimeString("ro-RO", { hour: "2-digit", minute: "2-digit" })}`
    : date;
};

function isOutsideNormalInterval(response: CheckinResponse) {
  if (response.answer_type !== "scale") return null;

  const value = Number(String(response.answer).replace(",", "."));
  const options = response.options_json ?? {};
  const legacyThreshold = Array.isArray(options.thresholds)
    ? options.thresholds[0]
    : null;
  const min = options.normal_min ?? legacyThreshold?.min ?? null;
  const max = options.normal_max ?? legacyThreshold?.max ?? null;

  if (!Number.isFinite(value) || (min === null && max === null)) return null;

  const belowMin = min !== null && value < Number(min);
  const aboveMax = max !== null && value > Number(max);

  return belowMin || aboveMax;
}

function formatCheckin(checkin: any) {
  const answers = (checkin.responses ?? []).map(
    (response: CheckinResponse) => ({
      q: response.question,
      a: response.answer,
      hasAlert: isOutsideNormalInterval(response),
    }),
  );

  if (checkin.general_notes) {
    answers.push({
      q: t("extraNotes"),
      a: checkin.general_notes,
      hasAlert: null,
    });
  }

  return {
    id: checkin.checkin_id,
    title: t("checkinTitle"),
    frequency: "daily",
    status: "completed",
    submitted_at: checkin.submitted_at,
    hasAlert: answers.some((answer: any) => answer.hasAlert),
    answers,
    photos: checkin.photos ?? [],
  };
}

export default function PatientDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [patient, setPatient] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState<any[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [expanded, setExpanded] = useState<number | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await authFetch(`${API_URL}/doctor/patients`);
        if (res.ok) {
          const list: any[] = await res.json();
          setPatient(list.find((p) => p.user_id === id) ?? null);
        }

        const historyRes = await authFetch(
          `${API_URL}/doctor/patients/${id}/checkins`,
        );
        if (historyRes.ok) {
          setHistory((await historyRes.json()).map(formatCheckin));
        }
      } catch (err) {
        console.error("Failed to fetch data:", err);
      } finally {
        setLoading(false);
        setHistoryLoading(false);
      }
    }
    load();
  }, [id]);

  return (
    <AppLayout>
      <div className={styles.topBar}>
        <button className={styles.backBtn} onClick={() => router.push("/")}>
          ? {t("back")}
        </button>
        {patient && (
          <h2 className={styles.patientName}>
            {patient.first_name} {patient.last_name}
          </h2>
        )}
      </div>

      {loading ? (
        <p className={styles.hint}>{t("loading")}</p>
      ) : !patient ? (
        <p className={styles.hint}>{t("patientNotFound")}</p>
      ) : (
        <>
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>{t("medicalDataTitle")}</h3>
            <div className={styles.infoGrid}>
              <Field label={t("emailField")} value={patient.email} />
              <Field label={t("phoneField")} value={patient.phone} />
              <Field
                label={t("dateOfBirthField")}
                value={fmt(patient.date_of_birth)}
              />
              <Field
                label={t("surgeryTypeField")}
                value={patient.surgery_type}
              />
              <Field
                label={t("surgeryDateField")}
                value={fmt(patient.surgery_date)}
              />
              <Field
                label={t("dischargeDateField")}
                value={fmt(patient.discharge_date)}
              />
              <Field
                label={t("monitoringEndField")}
                value={fmt(patient.monitoring_end_date)}
              />
              {patient.notes && (
                <Field label={t("notesField")} value={patient.notes} wide />
              )}
            </div>
          </section>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>
              {t("questionnaireHistoryTitle")}
            </h3>
            {historyLoading ? (
              <p className={styles.hint}>{t("loadingHistory")}</p>
            ) : history.length === 0 ? (
              <p className={styles.hint}>{t("noCompletedQuestionnaires")}</p>
            ) : (
              <ul className={styles.historyList}>
                {history.map((entry) => {
                  const open = expanded === entry.id;
                  return (
                    <li key={entry.id} className={styles.historyItem}>
                      <button
                        className={styles.historyRow}
                        onClick={() => setExpanded(open ? null : entry.id)}
                      >
                        <div className={styles.historyLeft}>
                          <span
                            className={`${styles.statusDot} ${styles[entry.status]}`}
                          />
                          <div>
                            <span className={styles.historyTitle}>
                              {entry.title}
                            </span>
                            <span className={styles.historyMeta}>
                              {fmt(entry.submitted_at, true)} ·{" "}
                              {entry.frequency === "daily"
                                ? t("dailyFrequency")
                                : t("weeklyFrequency")}
                            </span>
                          </div>
                        </div>
                        <div className={styles.historyRight}>
                          {entry.hasAlert && (
                            <span className={styles.alertPill}>
                              {t("alertLabel")}
                            </span>
                          )}
                          <span className={styles.chevron}>
                            {open ? "▲" : "▼"}
                          </span>
                        </div>
                      </button>

                      {open && (
                        <div className={styles.answers}>
                          {entry.answers.length === 0 ? (
                            <p className={styles.hint}>
                              {t("questionnaireNotCompleted")}
                            </p>
                          ) : (
                            entry.answers.map((a: any, i: number) => (
                              <div key={i} className={styles.answerRow}>
                                <span className={styles.answerQ}>{a.q}</span>
                                <span className={styles.answerA}>
                                  {a.a || t("emptyValue")}
                                </span>
                                {a.hasAlert && (
                                  <span className={styles.alertBadge}>
                                    {t("outsideNormalIntervalAlert")}
                                  </span>
                                )}
                              </div>
                            ))
                          )}
                          {entry.photos && entry.photos.length > 0 && (
                            <div
                              className={styles.answerRow}
                              style={{
                                flexDirection: "column",
                                alignItems: "flex-start",
                                marginTop: "1rem",
                              }}
                            >
                              <span className={styles.answerQ}>
                                {t("attachedPhotos")}
                              </span>
                              <div
                                style={{
                                  display: "flex",
                                  gap: "10px",
                                  marginTop: "10px",
                                  flexWrap: "wrap",
                                }}
                              >
                                {entry.photos.map((p: any) => (
                                  <Image
                                    key={p.id}
                                    src={p.uri}
                                    alt={t("checkinPhotoAlt")}
                                    width={120}
                                    height={120}
                                    unoptimized
                                    style={{
                                      width: "120px",
                                      height: "120px",
                                      objectFit: "cover",
                                      borderRadius: "8px",
                                    }}
                                  />
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        </>
      )}
    </AppLayout>
  );
}

function Field({
  label,
  value,
  wide,
}: {
  label: string;
  value?: string | null;
  wide?: boolean;
}) {
  return (
    <div className={`${styles.field} ${wide ? styles.wide : ""}`}>
      <span className={styles.fieldLabel}>{label}</span>
      <span className={styles.fieldValue}>{value ?? t("emptyValue")}</span>
    </div>
  );
}
