"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AppLayout from "./components/AppLayout";
import styles from "./page.module.css";
import { t } from "@shared/translations";
import { API_URL, authFetch } from "./lib/api";

export default function HomePage() {
  const router = useRouter();
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPatients() {
      try {
        const res = await authFetch(`${API_URL}/doctor/patients`);
        if (res.ok) setPatients(await res.json());
      } catch (err) {
        console.error("Failed to fetch patients:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPatients();
  }, []);

  return (
    <AppLayout>
      <div className={styles.pageHeader}>
        <h2 className={styles.pageTitle}>{t("patientsTitle")}</h2>
        {!loading && (
          <span className={styles.count}>{patients.length} pacienti</span>
        )}
      </div>

      {loading ? (
        <p className={styles.hint}>{t("loading")}</p>
      ) : patients.length === 0 ? (
        <p className={styles.hint}>Niciun pacient inregistrat.</p>
      ) : (
        <ul className={styles.list}>
          {patients.map((p) => (
            <li
              key={p.user_id}
              className={styles.card}
              onClick={() => router.push(`/patients/${p.user_id}`)}
            >
              <div className={styles.cardAvatar}>
                {(p.first_name?.[0] ?? "?").toUpperCase()}
              </div>
              <div className={styles.cardBody}>
                <span className={styles.cardName}>
                  {p.first_name} {p.last_name}
                </span>
                <span className={styles.cardMeta}>
                  {p.surgery_type ?? "—"} &middot;{" "}
                  {p.surgery_date
                    ? new Date(p.surgery_date).toLocaleDateString("ro-RO")
                    : "data necunoscuta"}
                </span>
              </div>
              <span className={styles.cardArrow}>›</span>
            </li>
          ))}
        </ul>
      )}
    </AppLayout>
  );
}
