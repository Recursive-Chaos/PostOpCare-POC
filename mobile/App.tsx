import { useMemo, useState } from 'react';
import {
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { palette, styles } from './App.styles';

type Patient = {
  firstName: string;
  recoveryDay: number;
  surgeryType: string;
};

type HistoryEntry = {
  id: string;
  day: string;
  month: string;
  weekday: string;
  pain: number;
  // aici in loc de painSeverity ales am putea face de ex un check pt pain > 7 = high  >4 = moderate si rest low
  painSeverity: 'low' | 'moderate' | 'high';
  temperatureC: number;
};

// TODO: constantele patient, dailyQuestionnaire si history sunt hardcodate pt teste
// o sa trebuiasca sa vina din backend dar am facut asa ca sa testez
const patient: Patient = {
  firstName: 'Milici',
  recoveryDay: 3,
  surgeryType: 'Transplant de ficat',
};

const dailyQuestionnaire = {
  status: 'Necompletat' as 'Necompletat' | 'Completat',
};

const history: HistoryEntry[] = [
  { id: '1', day: '3', month: 'MAI', weekday: 'Duminică', pain: 4, painSeverity: 'low', temperatureC: 36.8 },
  { id: '2', day: '2', month: 'MAI', weekday: 'Sâmbătă', pain: 5, painSeverity: 'moderate', temperatureC: 37.0 },
  { id: '3', day: '1', month: 'MAI', weekday: 'Vineri', pain: 9, painSeverity: 'high', temperatureC: 36.9 },

];

function painColor(severity: HistoryEntry['painSeverity']) {
  if (severity === 'high') return palette.danger;
  if (severity === 'moderate') return palette.warning;
  return palette.low;
}

// ai-ul a sugerat cacomponenta App o sa fie destul de mare, ar trebui impartita in componente mai mici
// (ex. Greeting, RecoveryInfo, QuestionnaireCard, SearchBar, HistoryCard etc.)
// will look into it
export default function App() {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return history;
    return history.filter(
      (e) =>
        e.weekday.toLowerCase().includes(q) ||
        `${e.day} ${e.month.toLowerCase()}`.includes(q) ||
        e.month.toLowerCase().includes(q),
    );
  }, [search]);

  // StatusBar pe Android se suprapune peste continut si trebuie adaugat un padding egal cu inaltimea lui.
  // Pe iOS nu e nevoie de asta pt ca safezone-ul se ocupa deja sa nu lase continutul sub status bar.
  const topInset = Platform.OS === 'android' ? StatusBar.currentHeight ?? 0 : 0;
 

  // ai-ul a sugerat flatlist ca sa nu incarce toate cardurile din prima,
  //  will look into it, dar nu stiu cat e de necesar daca nu consuma foarte multa memorie
  return (
    <View style={[styles.safeArea, { paddingTop: topInset }]}>
      <ExpoStatusBar style="dark" backgroundColor={palette.background} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.greetingHello}>Bună ziua,</Text>
        <Text style={styles.greetingName}>{patient.firstName}.</Text>

        <View style={styles.recoveryRow}>
          <View style={styles.recoveryDot} />
          <Text style={styles.recoveryText}>
            Ziua <Text style={styles.recoveryDayNumber}>{patient.recoveryDay}</Text> de recuperare
          </Text>
          <View style={styles.recoverySeparator} />
          <Text style={styles.recoverySurgery}>{patient.surgeryType}</Text>
        </View>

        <TouchableOpacity activeOpacity={0.9} style={styles.questionnaireCard}>
          <View style={styles.questionnaireHeaderRow}>
            <Text style={styles.questionnaireLabel}>CHESTIONAR ZILNIC</Text>
            <View style={styles.questionnaireBadge}>
              <Text style={styles.questionnaireBadgeText}>{dailyQuestionnaire.status}</Text>
            </View>
          </View>
          <View style={styles.questionnaireTitleRow}>
            <Text style={styles.questionnaireTitle}>Completează chestionar</Text>
            <View style={styles.questionnaireChevron}>
              <Text style={styles.questionnaireChevronText}>›</Text>
            </View>
          </View>
        </TouchableOpacity>

        <View style={styles.searchBar}>
          <TextInput
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
            placeholder='Caută după dată — ex. "4 mai" sau "luni"'
            placeholderTextColor={palette.textTertiary}
          />
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>ISTORIC MONITORIZARE</Text>
        </View>
        
        {filtered.map((entry) => (
          <View key={entry.id} style={styles.historyCard}>
            <View style={styles.historyDateBox}>
              <Text style={styles.historyDay}>{entry.day}</Text>
              <Text style={styles.historyMonth}>{entry.month}</Text>
            </View>
            <View style={styles.historyBody}>
              <View style={styles.historyWeekdayRow}>
                <Text style={styles.historyWeekday}>{entry.weekday}</Text>
              </View>
              <View style={styles.historyMetricsRow}>
                <View style={styles.historyMetric}>
                  <View
                    style={[styles.historyMetricDot, { backgroundColor: painColor(entry.painSeverity) }]}
                  />
                  <Text style={styles.historyMetricText}>Durere {entry.pain}/10</Text>
                </View>
                <View style={styles.historyMetric}>
                  <Text style={styles.historyMetricText}>Temperatura {entry.temperatureC.toFixed(1)}°</Text>
                </View>
              </View>
            </View>
            <Text style={styles.historyChevron}>›</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}