"use client";

import { useState, useEffect } from "react";
import styles from "./page.module.css";
import { t } from "@shared/translations";
import { useRouter } from "next/navigation";
import { API_URL, hasStoredSession } from "../lib/api";

type Step = "email" | "code" | "success";

export default function LoginPage() {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (localStorage.getItem("user") && hasStoredSession()) {
      router.push("/");
    }
  }, [router]);

  async function handleSubmit(e?: any) {
    if (e?.key && e.key !== "Enter") return;
    if (e?.preventDefault) e.preventDefault();

    setError("");

    if (step === "email") {
      if (!email) return setError(t("emptyEmailError"));
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/auth/doctor/request-code`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        if (!res.ok) {
          setError(t("connError"));
        } else {
          setStep("code");
        }
      } catch {
        setError(t("connError"));
      }
      setLoading(false);
    } else if (step === "code") {
      if (!code) return setError(t("emptyCodeError"));
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/auth/doctor/verify-code`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, code }),
        });

        if (!res.ok) {
          setError(t("invalidCode"));
          setLoading(false);
          return;
        }

        const data = await res.json();
        localStorage.setItem("session", JSON.stringify(data.session));
        localStorage.setItem(
          "user",
          JSON.stringify({ ...data.user, ...data.doctor }),
        );
        router.push("/");
      } catch {
        setError(t("connError"));
        setLoading(false);
      }
    }
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <div className={styles.logo}>{t("appName")}</div>
        <h1 className={styles.title}>
          {step === "email" ? t("loginTitle") : t("enterCodeTitle")}
        </h1>
        <p className={styles.subtitle}>
          {step === "email"
            ? t("loginSubtitle")
            : `${t("enterCodeSubtitle")} ${email}`}
        </p>

        <div className={styles.form} onKeyDown={handleSubmit}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="auth-input">
              {step === "email" ? t("emailLabel") : t("codeLabel")}
            </label>
            <input
              id="auth-input"
              className={styles.input}
              type={step === "email" ? "email" : "text"}
              value={step === "email" ? email : code}
              onChange={(e) =>
                step === "email"
                  ? setEmail(e.target.value)
                  : setCode(e.target.value)
              }
              maxLength={step === "code" ? 8 : undefined}
              autoFocus
            />
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <button
            className={styles.button}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading
              ? step === "email"
                ? t("sendingBtn")
                : t("verifyingBtn")
              : step === "email"
                ? t("sendCodeBtn")
                : t("verifyBtn")}
          </button>

          {step === "code" && (
            <button
              type="button"
              className={styles.back}
              onClick={() => setStep("email")}
            >
              {t("goBack")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
