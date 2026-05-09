import { View, Text } from 'react-native';
import { palette, styles } from '../../App.styles';
import { HistoryEntry } from '../types';
import { t } from '@shared/translations';

function painColor(severity: HistoryEntry['painSeverity']) {
  if (severity === 'high') return palette.danger;
  if (severity === 'moderate') return palette.warning;
  return palette.low;
}

type Props = {
  entry: HistoryEntry;
};

export function HistoryCard({ entry }: Props) {
  return (
    <View style={styles.historyCard}>
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
            <Text style={styles.historyMetricText}>{t('painLabel')} {entry.pain}/10</Text>
          </View>
          <View style={styles.historyMetric}>
            <Text style={styles.historyMetricText}>{t('tempLabel')} {entry.temperatureC.toFixed(1)}°</Text>
          </View>
        </View>
      </View>
      <Text style={styles.historyChevron}>›</Text>
    </View>
  );
}
