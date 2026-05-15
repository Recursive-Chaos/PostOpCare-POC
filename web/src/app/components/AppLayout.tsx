"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./AppLayout.module.css";
import { t } from "@shared/translations";
import { hasStoredSession, logout } from "../lib/api";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const parsed = JSON.parse(localStorage.getItem("user") ?? "");
      // daca e doctor cu sesiune valida 
      if (parsed.role === "doctor" && hasStoredSession()) {
        setUser(parsed);
        setLoading(false);
      } else {
        throw new Error(); // nu e doctor cu sesiune valida
      }
    } catch {
      logout();
    }
  }, [router]);

  function signOut() {
    localStorage.removeItem("user");
    localStorage.removeItem("session");
    router.push("/login");
  }

  if (loading) return <div className={styles.loading}>{t("loading")}</div>;

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.logo}>PostOpCare</div>
          <div className={styles.doctor}>
            <span className={styles.doctorName}>{user.firstName} {user.lastName}</span>
            <span className={styles.doctorSpec}>{user.specialization}</span>
          </div>
        </div>

        <nav className={styles.nav}>
          <Link href="/" className={styles.navLink}>{t("patientsTitle")}</Link>
          <Link href="/questionnaires" className={styles.navLink}>{t("questionnairesTitle")}</Link>
          <Link href="/invite" className={styles.navLink}>{t("inviteTitle")}</Link>
        </nav>

        <button className={styles.signOutBtn} onClick={signOut}>
          {t("signOutBtn")}
        </button>
      </header>

      <main className={styles.main}>{children}</main>
    </div>
  );
}
