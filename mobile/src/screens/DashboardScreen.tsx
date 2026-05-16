import { useEffect, useMemo, useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { styles } from "../../App.styles";
import { API_URL } from "../utils/constants";
import { t } from "@shared/translations";
import { CheckinPayload, HistoryEntry } from "../types";
import { normalizeHistoryEntry } from "../utils/checkin";
// componente
import { Header } from "../components/Header";
import { RecoveryStatus } from "../components/RecoveryStatus";
import { QuestionnaireCard } from "../components/QuestionnaireCard";
import { SearchBar } from "../components/SearchBar";
import { HistoryCard } from "../components/HistoryCard";
import HistoryDetailScreen from "./HistoryDetailScreen";
import CheckinScreen from "./CheckinScreen";
import CheckinSubmittedScreen from "./CheckinSubmittedScreen";

type Props = {
  user: any;
  onLogout: () => void;
};

export default function DashboardScreen({ user, onLogout }: Props) {
  const [search, setSearch] = useState("");
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [selectedEntry, setSelectedEntry] = useState<HistoryEntry | null>(null);
  const [showCheckin, setShowCheckin] = useState(false);
  const [checkinDone, setCheckinDone] = useState(false);
  const [showSentCheckin, setShowSentCheckin] = useState(false);
  const [sentPayload, setSentPayload] = useState<CheckinPayload | null>(null);
  const questionnaire = user.questionnaire;

  async function loadHistory() {
    if (!user.token) return;
    setHistoryLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/patient/checkins`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setHistory(data.map(normalizeHistoryEntry));
      }
    } finally {
      setHistoryLoading(false);
    }
  }

  useEffect(() => {
    if (!user.token) {
      onLogout();
      return;
    }

    loadHistory();
  }, [user.token]);

  async function submitCheckin(payload: CheckinPayload) {
    if (!user.token) throw new Error(t("checkinSessionError"));

    const res = await fetch(`${API_URL}/auth/patient/checkins`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${user.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      throw new Error(data?.error ?? t("checkinSubmitError"));
    }

    await loadHistory();
    setSentPayload(payload);
    setCheckinDone(true);
    setShowCheckin(false);
    setShowSentCheckin(true);
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return history;
    return history.filter(
      (e) =>
        e.weekday.toLowerCase().includes(q) ||
        `${e.day} ${e.month.toLowerCase()}`.includes(q) ||
        e.month.toLowerCase().includes(q),
    );
  }, [search, history]);

  const isCompletedToday = useMemo(() => {
    if (history.length === 0) return false;
    const dateStr = history[0].submittedAt || "";
    const latest = new Date(dateStr.replace(" ", "T"));
    if (isNaN(latest.getTime())) return false;
    const today = new Date();
    return (
      latest.getDate() === today.getDate() &&
      latest.getMonth() === today.getMonth() &&
      latest.getFullYear() === today.getFullYear()
    );
  }, [history]);

  if (selectedEntry) {
    return (
      <HistoryDetailScreen
        entry={selectedEntry}
        onBack={() => setSelectedEntry(null)}
      />
    );
  }

  if (showCheckin && questionnaire) {
    return (
      <CheckinScreen
        questionnaire={questionnaire}
        onBack={() => setShowCheckin(false)}
        onDone={submitCheckin}
      />
    );
  }

  if (showSentCheckin) {
    return (
      <CheckinSubmittedScreen
        questionnaire={questionnaire}
        payload={sentPayload}
        onBack={() => setShowSentCheckin(false)}
      />
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      testID="dashboard-container"
    >
      <Header user={user} patient={user} onLogout={onLogout} />
      <RecoveryStatus patient={user} />
      {questionnaire ? (
        <QuestionnaireCard
          status={
            historyLoading
              ? "Se incarca..."
              : checkinDone ||
                  isCompletedToday ||
                  questionnaire.status === "Completat"
                ? "Completat"
                : questionnaire.status
          }
          onPress={() => {
            if (historyLoading) return; // asteapta incarcarea istoricului pentru a decide starea

            if (checkinDone) {
              setShowSentCheckin(true);
            } else if (
              (isCompletedToday || questionnaire.status === "Completat") &&
              history.length > 0
            ) {
              setSelectedEntry(history[0]);
            } else {
              setShowCheckin(true);
            }
          }}
        />
      ) : null}
      <SearchBar search={search} onSearchChange={setSearch} />

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{t("monitoringHistory")}</Text>
      </View>

      {historyLoading ? (
        <Text style={styles.hint}>Se incarca...</Text>
      ) : filtered.length === 0 ? (
        <Text style={styles.hint}>Niciun check-in inca.</Text>
      ) : (
        filtered.map((entry) => (
          <HistoryCard
            key={entry.id}
            entry={entry}
            onPress={setSelectedEntry}
          />
        ))
      )}
    </ScrollView>
  );
}
