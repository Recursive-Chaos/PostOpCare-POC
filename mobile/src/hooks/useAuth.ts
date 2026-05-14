import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../utils/constants";
import { t } from "@shared/translations";

export type AuthStep = "email" | "code";

export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [authStep, setAuthStep] = useState<AuthStep>("email");
  const [email, setEmail] = useState("");

  useEffect(() => {
    AsyncStorage.getItem("user")
      .then((data) => {
        if (data) setUser(JSON.parse(data));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const requestCode = async (userEmail: string) => {
    if (!userEmail) {
      setError(t("emptyEmailError"));
      return false;
    }
    setError("");
    setActionLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/patient/request-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail }),
      });
      if (!res.ok) {
        try {
          const errData = await res.json();
          setError(errData.error || t("connError"));
        } catch {
          setError(t("connError"));
        }
        setActionLoading(false);
        return false;
      } else {
        setEmail(userEmail);
        setAuthStep("code");
        setActionLoading(false);
        return true;
      }
    } catch (e) {
      setError(t("connError"));
      setActionLoading(false);
      return false;
    }
  };

  const verifyCode = async (code: string) => {
    if (!code) {
      setError(t("emptyCodeError"));
      return false;
    }
    setError("");
    setActionLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/patient/verify-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
      if (!res.ok) {
        try {
          const errData = await res.json();
          setError(errData.error || t("invalidOrExpiredCode"));
        } catch {
          setError(t("invalidOrExpiredCode"));
        }
        setActionLoading(false);
        return false;
      } else {
        const data = await res.json();
        const fullUser = {
          ...data.user,
          recoveryDay: data.patient?.recoveryDay ?? 0,
          surgeryType: data.patient?.surgeryType ?? "Interventie chirurgicala",
        };
        setUser(fullUser);
        await AsyncStorage.setItem("user", JSON.stringify(fullUser));
        setActionLoading(false);
        return true;
      }
    } catch (e) {
      setError(t("connError"));
      setActionLoading(false);
      return false;
    }
  };

  const logout = async () => {
    setUser(null);
    setAuthStep("email");
    setEmail("");
    await AsyncStorage.removeItem("user");
  };

  const resetStep = () => {
    setAuthStep("email");
    setError("");
  };

  return {
    user,
    loading,
    actionLoading,
    error,
    authStep,
    email,
    requestCode,
    verifyCode,
    logout,
    resetStep,
    setError,
  };
}
