"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import { t } from "@shared/translations";

export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      router.push("/login");
    } else {
      try {
        const parsed = JSON.parse(userData);
        if (parsed.role !== "doctor") {
          localStorage.removeItem("user");
          localStorage.removeItem("session");
          router.push("/login");
        } else {
          setUser(parsed);
          setLoading(false);
        }
      } catch {
        localStorage.removeItem("user");
        localStorage.removeItem("session");
        router.push("/login");
      }
    }
  }, [router]);

  function handleSignOut() {
    localStorage.removeItem("user");
    localStorage.removeItem("session");
    router.push("/login");
  }

  if (loading) return <div>{t("loading")}</div>;

  return (
    <div className={styles.wrapper}>
      <div className={styles.logo}>PostOpCare - Doctor</div>
      <h1 className={styles.title}>{t("greeting")} {user?.firstName} {user?.lastName}</h1>
      
      <div className={styles.metaRow}>
        <span>{t("nameLabel")}</span>
        <strong>{user?.firstName} {user?.lastName}</strong>
      </div>
      <div className={styles.metaRow}>
        <span>{t("emailMetaLabel")}</span>
        <strong>{user?.email}</strong>
      </div>
      <div className={styles.metaRow}>
        <span>{t("specLabel")}</span>
        <strong>{user?.specialization}</strong>
      </div>

      <button className={styles.button} onClick={handleSignOut}>
        {t("signOutBtn")}
      </button>
    </div>
  );
}
