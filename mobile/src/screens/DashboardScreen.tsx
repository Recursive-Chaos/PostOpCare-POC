import { useMemo, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { styles } from '../../App.styles';
import { mockHistory, dailyQuestionnaire } from '../utils/constants';
import { t } from '@shared/translations';
// componente
import { Header } from '../components/Header';
import { RecoveryStatus } from '../components/RecoveryStatus';
import { QuestionnaireCard } from '../components/QuestionnaireCard';
import { SearchBar } from '../components/SearchBar';
import { HistoryCard } from '../components/HistoryCard';

type Props = {
  user: any;
  onLogout: () => void;
};

export default function DashboardScreen({ user, onLogout }: Props) {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return mockHistory;
    return mockHistory.filter(
      (e) =>
        e.weekday.toLowerCase().includes(q) ||
        `${e.day} ${e.month.toLowerCase()}`.includes(q) ||
        e.month.toLowerCase().includes(q),
    );
  }, [search]);

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      testID="dashboard-container"
    >
      <Header user={user} patient={user} onLogout={onLogout} />

      <RecoveryStatus patient={user} />

      <QuestionnaireCard status={dailyQuestionnaire.status} />

      <SearchBar search={search} onSearchChange={setSearch} />

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{t('monitoringHistory')}</Text>
      </View>

      {filtered.map((entry) => (
        <HistoryCard key={entry.id} entry={entry} />
      ))}
    </ScrollView>
  );
}
