import { View, Text, ScrollView } from "react-native";
import { styles } from "../../App.styles";
import { HistoryEntry } from "../types";
import { BackButton } from "../components/BackButton";
import {
  DetailSection,
  DetailItem,
  DetailMetric,
} from "../components/DetailSection";
import { PhotoGallery, Photo } from "../components/PhotoGallery";

type Props = {
  entry: HistoryEntry;
  onBack: () => void;
};

export default function HistoryDetailScreen({ entry, onBack }: Props) {
  // consantele astea 4 sunt de test si o sa trebuiasca inlocuite cu backend
  const responses = [
    {
      id: 1,
      question: "Cum ai descrie durerea?",
      answer: "Durere moderata, ma doare au nu mai duc.",
    },
    { id: 2, question: "Cum te simti astazi?", answer: "Nu mai duc" },
    {
      id: 3,
      question: "Cum ai dormit noaptea trecuta?",
      answer: "As mai fi dormit.",
    },
    {
      id: 4,
      question: "Ai luat medicatia prescrisa?",
      answer: "Da, m-am imbatat.",
    },
  ];

  const measurements = {
    temperature: entry.temperatureC,
    painLevel: entry.pain,
    sleepHours: 7,
  };

  const note = "Am baut 3 litrii de vin alb";

  const photos: Photo[] = [
    { id: 1, uri: "https://picsum.photos/690/420" },
    { id: 2, uri: "https://picsum.photos/830/660" },
    { id: 3, uri: "https://picsum.photos/912/765" },
  ];

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

      <DetailSection title="MASURATORI">
        <DetailMetric
          label="Temperatura"
          value={`${measurements.temperature.toFixed(1)} °C`}
        />
        <DetailMetric
          label="Nivel durere"
          value={`${measurements.painLevel}/10`}
        />
        <DetailMetric
          label="Ore de somn"
          value={`${measurements.sleepHours} h`}
          isLast
        />
      </DetailSection>

      {responses.length > 0 && (
        <DetailSection title="RASPUNSURI CHESTIONAR">
          {responses.map((r, i) => (
            <DetailItem
              key={r.id}
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
