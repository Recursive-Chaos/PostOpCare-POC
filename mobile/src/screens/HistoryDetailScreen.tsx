import { View, Text, ScrollView } from "react-native";
import { styles } from "../../App.styles";
import { HistoryEntry } from "../types";
import { BackButton } from "../components/BackButton";
import { DetailSection, DetailItem } from "../components/DetailSection";
import { PhotoGallery, Photo } from "../components/PhotoGallery";

type Props = {
  entry: HistoryEntry;
  onBack: () => void;
};

export default function HistoryDetailScreen({ entry, onBack }: Props) {
  const responses = entry.responses ?? [];
  const note = entry.notes;
  const photos: Photo[] = entry.photos ?? [];

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      testID="history-detail-container"
    >
      <View style={styles.detailHeaderRow}>
        <BackButton onPress={onBack} />
        <Text style={styles.detailTitle}>Detalii chestionar</Text>
      </View>

      <View style={styles.detailDateCard}>
        <View style={styles.historyDateBox}>
          <Text style={styles.historyDay}>{entry.day}</Text>
          <Text style={styles.historyMonth}>{entry.month}</Text>
        </View>
        <View style={styles.detailDateInfo}>
          <Text style={styles.detailDateWeekday}>{entry.weekday}</Text>
        </View>
      </View>

      {responses.length > 0 && (
        <DetailSection title="RASPUNSURI CHESTIONAR">
          {responses.map((r, i) => (
            <DetailItem
              key={`${r.question}-${i}`}
              label={r.question}
              value={r.answer}
              isLast={i === responses.length - 1}
            />
          ))}
        </DetailSection>
      )}

      {photos.length > 0 && <PhotoGallery photos={photos} />}

      {note && note.trim().length > 0 && (
        <DetailSection title="NOTE">
          <Text style={styles.detailNote}>{note}</Text>
        </DetailSection>
      )}
    </ScrollView>
  );
}
