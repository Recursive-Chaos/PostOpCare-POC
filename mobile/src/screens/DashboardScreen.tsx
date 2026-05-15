import { useMemo, useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { styles } from "../../App.styles";
import { historyEntries, dailyQuestionnaire } from "../utils/constants";
import { t } from "@shared/translations";
import { HistoryEntry } from "../types";
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
  const [selectedEntry, setSelectedEntry] = useState<HistoryEntry | null>(null);
  const [showCheckin, setShowCheckin] = useState(false);
  const [checkinDone, setCheckinDone] = useState(false);
  const [showSentCheckin, setShowSentCheckin] = useState(false);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return historyEntries;
    return historyEntries.filter(
      (e) =>
        e.weekday.toLowerCase().includes(q) ||
        `${e.day} ${e.month.toLowerCase()}`.includes(q) ||
        e.month.toLowerCase().includes(q),
    );
  }, [search]);

  if (selectedEntry) {
    return (
      <HistoryDetailScreen
        entry={selectedEntry}
        onBack={() => setSelectedEntry(null)}
      />
    );
  }

  if (showCheckin) {
    return (
      <CheckinScreen
        questionnaire={dailyQuestionnaire}
        onBack={() => setShowCheckin(false)}
        onDone={() => {
          setCheckinDone(true);
          setShowCheckin(false);
          setShowSentCheckin(true);
        }}
      />
    );
  }

  if (showSentCheckin) {
    return <CheckinSubmittedScreen onBack={() => setShowSentCheckin(false)} />;
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
      <QuestionnaireCard
        status={checkinDone ? "Completat" : dailyQuestionnaire.status}
        onPress={() =>
          checkinDone ? setShowSentCheckin(true) : setShowCheckin(true)
        }
      />
      <SearchBar search={search} onSearchChange={setSearch} />

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{t("monitoringHistory")}</Text>
      </View>

      {filtered.map((entry) => (
        <HistoryCard key={entry.id} entry={entry} onPress={setSelectedEntry} />
      ))}
    </ScrollView>
  );
}
