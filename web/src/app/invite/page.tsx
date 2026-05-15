"use client";

import { useState } from "react";
import AppLayout from "../components/AppLayout";
import styles from "./invitatie.module.css";
import { t } from "@shared/translations";
import { API_URL, authFetch } from "../lib/api";

const emptyForm = {
  patient_email: "",
  first_name: "",
  last_name: "",
  patient_phone: "",
  date_of_birth: "",
  notes: "",
  surgery_type: "",
  surgery_date: "",
  discharge_date: "",
  monitoring_end_date: "",
};

export default function InvitePage() {
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await authFetch(`${API_URL}/doctor/patients/invite`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: form.patient_email,
          firstName: form.first_name,
          lastName: form.last_name,
          patientPhone: form.patient_phone,
          dateOfBirth: form.date_of_birth,
          notes: form.notes,
          surgeryType: form.surgery_type,
          surgeryDate: form.surgery_date,
          dischargeDate: form.discharge_date,
          monitoringEndDate: form.monitoring_end_date,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage({ type: "error", text: data.error || t("inviteError") });
        return;
      }

      setMessage({ type: "success", text: data.existed ? t("inviteExisted") : t("inviteSuccess") });
      setForm(emptyForm);
    } catch {
      setMessage({ type: "error", text: t("inviteConnError") });
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppLayout>
      <div className={styles.card}>
        <h1 className={styles.cardTitle}>{t("inviteTitle")}</h1>

        {message && (
          <div className={`${styles.toast} ${message.type === "success" ? styles.toastSuccess : styles.toastError}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className={styles.formGrid}>
            <div className={`${styles.formGroup} ${styles.full}`}>
              <label>{t("fieldEmail")}</label>
              <input type="email" name="patient_email" value={form.patient_email} onChange={handleChange} placeholder={t("fieldEmailPlaceholder")} required />
            </div>

            <div className={styles.formGroup}>
              <label>{t("fieldFirstName")}</label>
              <input type="text" name="first_name" value={form.first_name} onChange={handleChange} placeholder={t("fieldFirstNamePlaceholder")} required />
            </div>

            <div className={styles.formGroup}>
              <label>{t("fieldLastName")}</label>
              <input type="text" name="last_name" value={form.last_name} onChange={handleChange} placeholder={t("fieldLastNamePlaceholder")} required />
            </div>

            <div className={styles.formGroup}>
              <label>{t("fieldPhone")}</label>
              <input type="tel" name="patient_phone" value={form.patient_phone} onChange={handleChange} placeholder={t("fieldPhonePlaceholder")} required />
            </div>

            <div className={styles.formGroup}>
              <label>{t("fieldDob")}</label>
              <input type="date" name="date_of_birth" value={form.date_of_birth} onChange={handleChange} />
            </div>

            <div className={`${styles.formGroup} ${styles.full}`}>
              <label>{t("fieldSurgeryType")}</label>
              <input type="text" name="surgery_type" value={form.surgery_type} onChange={handleChange} placeholder={t("fieldSurgeryTypePlaceholder")} />
            </div>

            <div className={`${styles.formGroup} ${styles.full}`}>
              <label>{t("fieldNotes")}</label>
              <input type="text" name="notes" value={form.notes} onChange={handleChange} placeholder={t("fieldNotesPlaceholder")} />
            </div>

            <hr className={styles.divider} />

            <div className={styles.formGroup}>
              <label>{t("fieldSurgeryDate")}</label>
              <input type="date" name="surgery_date" value={form.surgery_date} onChange={handleChange} />
            </div>

            <div className={styles.formGroup}>
              <label>{t("fieldDischargeDate")}</label>
              <input type="date" name="discharge_date" value={form.discharge_date} onChange={handleChange} />
            </div>

            <div className={styles.formGroup}>
              <label>{t("fieldMonitoringEnd")}</label>
              <input type="date" name="monitoring_end_date" value={form.monitoring_end_date} onChange={handleChange} />
            </div>

            <button type="submit" className={styles.submitButton} disabled={loading}>
              {loading ? t("inviteSubmitting") : t("inviteSubmitBtn")}
            </button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
