"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./invitatie.module.css";

// Pagina de invitare 
export default function InvitePage() {
  // Formular tipic pentru date
  const [form, setForm] = useState({
    patient_phone: "",
    patient_name: "",
    surgery_type: "",
    surgery_date: "",
    monitoring_days: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Handler pt  schimbarea valorilor
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  // Handler pentru trimiterea formularului
  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      // Trimite cererea POST la backend-ul local 
      const res = await fetch("http://localhost:3001/invites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          monitoring_days: Number(form.monitoring_days),
        }),
      });

      const data = await res.json();

      // Verifica daca invitarea a fost trimisa cu succes
      if (data.success) {
        setMessage({ type: "success", text: "Invitatia a fost trimisa cu succes!" });
        // Reseteaza formularul dupa succes
        setForm({ patient_phone: "", patient_name: "", surgery_type: "", surgery_date: "", monitoring_days: "" });
      } else {
        // Afiseaza mesajul de eroare din raspunsul serverului
        setMessage({ type: "error", text: data.error || "Eroare la trimiterea invitatiei." });
      }
    } catch {
      // Eroare de conexiune cu serverul
      setMessage({ type: "error", text: "Eroare de conexiune cu serverul." });
    } finally {
      // Opreste incarcarea indiferent de rezultat
      setLoading(false);
    }
  }

  return (
    <div className={styles.page}>
      {/* Link pentru intoarcerea la panoul de control */}
      <Link href="/dashboard" className={styles.backLink}>
        ← Inapoi la panou
      </Link>

      <div className={styles.card}>
        <h1 className={styles.cardTitle}>Invita pacient</h1>

        {/* Afiseaza mesajul de succes sau eroare daca exista */}
        {message && (
          <div className={`${styles.toast} ${message.type === "success" ? styles.toastSuccess : styles.toastError}`}>
            {message.text}
          </div>
        )}

        {/* Formularu pentru introducerea datelor pacientului */}
        <form onSubmit={handleSubmit}>
          {/* Camp pentru numaru de telefon */}
          <div className={styles.formGroup}>
            <label>Numar de telefon</label>
            <input
              type="tel"
              name="patient_phone"
              value={form.patient_phone}
              onChange={handleChange}
              placeholder="07xx xxx xxx"
              required
            />
          </div>

          {/* Numele pacientului */}
          <div className={styles.formGroup}>
            <label>Nume pacient</label>
            <input
              type="text"
              name="patient_name"
              value={form.patient_name}
              onChange={handleChange}
              placeholder="Nume si prenume"
              required
            />
          </div>

          {/* Tipul de operatie*/}
          <div className={styles.formGroup}>
            <label>Tip operatie</label>
            <input
              type="text"
              name="surgery_type"
              value={form.surgery_type}
              onChange={handleChange}
              placeholder="ex: Proteza de genunchi"
              required
            />
          </div>

          {/* Data si durata operatiei */}
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Data operatiei</label>
              <input
                type="date"
                name="surgery_date"
                value={form.surgery_date}
                onChange={handleChange}
                required
              />
            </div>

            {/* Camp pentru durata de monitorizare*/}
            <div className={styles.formGroup}>
              <label>Durata monitorizare (zile)</label>
              <input
                type="number"
                name="monitoring_days"
                value={form.monitoring_days}
                onChange={handleChange}
                placeholder="ex: 30"
                min="1"
                required
              />
            </div>
          </div>

          {/* Buton de trimitere - dezactivat in timp ce se proceseza cererea */}
          <button type="submit" className={styles.submitButton} disabled={loading}>
            {loading ? "Se trimite..." : "Invita"}
          </button>
        </form>
      </div>
    </div>
  );
}
