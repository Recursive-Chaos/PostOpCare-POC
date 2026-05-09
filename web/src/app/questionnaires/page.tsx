"use client";

import { useEffect, useState } from "react";
import AppLayout from "../components/AppLayout";
import styles from "../page.module.css";
import { t } from "@shared/translations";
import { API_URL } from "../lib/api";

export default function QuestionnairesPage() {
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // fetch la lista de chestionare (templates)
  useEffect(() => {
    async function fetchTemplates() {
      try {
        const session = JSON.parse(localStorage.getItem("session") ?? "{}");
        const res = await fetch(`${API_URL}/doctor/questionnaires`, {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          setTemplates(data);
        }
      } catch (err) {
        console.error("Failed to fetch questionnaire templates:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchTemplates();
  }, []);

  return (
    <AppLayout>
      <section className={styles.section}>
        <div>
          <h2>{t("questionnairesTitle")}</h2>
          {loading ? (
            <p>{t("loading")}</p>
          ) : (
            <pre style={{ background: "#f5f5f5", padding: "12px", borderRadius: "8px", overflow: "auto", fontSize: "12px" }}>
              {JSON.stringify(templates, null, 2)}
            </pre>
          )}
        </div>
      </section>
    </AppLayout>
  );
}
