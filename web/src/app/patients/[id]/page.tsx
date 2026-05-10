"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AppLayout from "../../components/AppLayout";
import styles from "../../page.module.css";
import { API_URL } from "../../lib/api";

const MOCK_HISTORY = [
  {
    id: 1,
    title: "Check-in post-operator zilnic",
    frequency: "daily",
    status: "completed",
    submitted_at: "2026-05-09T08:14:00Z",
    answers: [
      { q: "Cum evaluezi durerea pe o scara 1-10?", a: "3" },
      { q: "Ai observat secretii la locul inciziei?", a: "Nu" },
      { q: "Ai febra?", a: "Nu" },
      { q: "Note suplimentare", a: "Ma simt mai bine decat ieri." },
    ],
  },
  {
    id: 2,
    title: "Check-in post-operator zilnic",
    frequency: "daily",
    status: "completed",
    submitted_at: "2026-05-08T09:02:00Z",
    answers: [
      { q: "Cum evaluezi durerea pe o scara 1-10?", a: "5" },
      { q: "Ai observat secretii la locul inciziei?", a: "Da - usoare" },
      { q: "Ai febra?", a: "Nu" },
      { q: "Note suplimentare", a: "" },
    ],
  },
  {
    id: 3,
    title: "Evaluare saptamanala recuperare",
    frequency: "weekly",
    status: "completed",
    submitted_at: "2026-05-06T17:30:00Z",
    answers: [
      { q: "Poti merge fara ajutor?", a: "Da" },
      { q: "Ai urmat schema de medicamente?", a: "Da" },
      { q: "Cum evaluezi starea generala (1-10)?", a: "7" },
    ],
  },
  {
    id: 4,
    title: "Check-in post-operator zilnic",
    frequency: "daily",
    status: "missed",
    submitted_at: "2026-05-07T00:00:00Z",
    answers: [],
  },
];

const STATUS_LABEL: Record<string, string> = {
  completed: "Trimis",
  missed: "Ratat",
  pending: "In asteptare",
};

const fmt = (iso?: string | null, time = false) => {
  if (!iso) return "—";
  const d = new Date(iso);
  const date = d.toLocaleDateString("ro-RO");
  return time ? `${date} ${d.toLocaleTimeString("ro-RO", { hour: "2-digit", minute: "2-digit" })}` : date;
};

export default function PatientDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [patient, setPatient] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<number | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const session = JSON.parse(localStorage.getItem("session") ?? "{}");
        const res = await fetch(`${API_URL}/doctor/patients`, {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });
        if (res.ok) {
          const list: any[] = await res.json();
          setPatient(list.find((p) => p.user_id === id) ?? null);
        }
      } catch (err) {
        console.error("Failed to fetch patient:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  return (
    <AppLayout>
      <div className={styles.topBar}>
        <button className={styles.backBtn} onClick={() => router.push("/")}>← Inapoi</button>
        {patient && <h2 className={styles.patientName}>{patient.first_name} {patient.last_name}</h2>}
      </div>

      {loading ? (
        <p className={styles.hint}>Se incarca...</p>
      ) : !patient ? (
        <p className={styles.hint}>Pacientul nu a fost gasit.</p>
      ) : (
        <>
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Date medicale</h3>
            <div className={styles.infoGrid}>
              <Field label="Email" value={patient.email} />
              <Field label="Telefon" value={patient.phone} />
              <Field label="Data nasterii" value={fmt(patient.date_of_birth)} />
              <Field label="Tip interventie" value={patient.surgery_type} />
              <Field label="Data interventiei" value={fmt(patient.surgery_date)} />
              <Field label="Data externarii" value={fmt(patient.discharge_date)} />
              <Field label="Sfarsit monitorizare" value={fmt(patient.monitoring_end_date)} />
              {patient.notes && <Field label="Note" value={patient.notes} wide />}
            </div>
          </section>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>
              Istoric chestionare
              <span className={styles.mockedBadge}>date demo</span>
            </h3>
            <ul className={styles.historyList}>
              {MOCK_HISTORY.map((entry) => {
                const open = expanded === entry.id;
                return (
                  <li key={entry.id} className={styles.historyItem}>
                    <button className={styles.historyRow} onClick={() => setExpanded(open ? null : entry.id)}>
                      <div className={styles.historyLeft}>
                        <span className={`${styles.statusDot} ${styles[entry.status]}`} />
                        <div>
                          <span className={styles.historyTitle}>{entry.title}</span>
                          <span className={styles.historyMeta}>
                            {fmt(entry.submitted_at, true)} · {entry.frequency === "daily" ? "zilnic" : "saptamanal"}
                          </span>
                        </div>
                      </div>
                      <div className={styles.historyRight}>
                        <span className={`${styles.statusPill} ${styles[entry.status]}`}>{STATUS_LABEL[entry.status]}</span>
                        <span className={styles.chevron}>{open ? "▲" : "▼"}</span>
                      </div>
                    </button>

                    {open && (
                      <div className={styles.answers}>
                        {entry.answers.length === 0 ? (
                          <p className={styles.hint}>Chestionarul nu a fost completat.</p>
                        ) : (
                          entry.answers.map((a, i) => (
                            <div key={i} className={styles.answerRow}>
                              <span className={styles.answerQ}>{a.q}</span>
                              <span className={styles.answerA}>{a.a || "—"}</span>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
        </>
      )}
    </AppLayout>
  );
}

function Field({ label, value, wide }: { label: string; value?: string | null; wide?: boolean }) {
  return (
    <div className={`${styles.field} ${wide ? styles.wide : ""}`}>
      <span className={styles.fieldLabel}>{label}</span>
      <span className={styles.fieldValue}>{value ?? "—"}</span>
    </div>
  );
}
