"use client";

import { useEffect, useState } from "react";
import AppLayout from "./components/AppLayout";
import styles from "./page.module.css";
import { t } from "@shared/translations";
import { API_URL } from "./lib/api";

export default function HomePage() {
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPatients() {
      try {
        const session = JSON.parse(localStorage.getItem("session") ?? "{}");
        const res = await fetch(`${API_URL}/doctor/patients`, {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          setPatients(data);
        }
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
      <section className={styles.section}>
        <div>
          <h2>{t("patientsTitle")}</h2>
          {loading ? (
            <p>{t("loading")}</p>
          ) : (
            <pre style={{ background: "#f5f5f5", padding: "12px", borderRadius: "8px", overflow: "auto", fontSize: "12px" }}>
              {JSON.stringify(patients, null, 2)}
            </pre>
          )}
        </div>
      </section>
    </AppLayout>
  );
}
