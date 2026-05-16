import { View, Text, TouchableOpacity } from "react-native";
import { palette, styles } from "../../App.styles";
import { HistoryEntry } from "../types";
import { t } from "@shared/translations";

function painColor(severity: HistoryEntry["painSeverity"]) {
  if (severity === "high") return palette.danger;
  if (severity === "moderate") return palette.warning;
  return palette.low;
}

type Props = {
  entry: HistoryEntry;
  onPress?: (entry: HistoryEntry) => void;
};

export function HistoryCard({ entry, onPress }: Props) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      style={styles.historyCard}
      onPress={onPress ? () => onPress(entry) : undefined}
    >
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
            <Text style={styles.historyMetricText}>
              {entry.responses?.length ?? 0} raspunsuri
            </Text>
          </View>
        </View>
      </View>
      <Text style={styles.historyChevron}>›</Text>
    </TouchableOpacity>
  );
}
