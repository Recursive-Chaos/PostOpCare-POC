import { Image, ScrollView, Text, View } from "react-native";
import { t } from "@shared/translations";
import { styles } from "../../App.styles";
import { BackButton } from "../components/BackButton";

type Props = {
  onBack: () => void;
};

const TODAY_CHECKIN = {
  sentAt: "09:24",
  measurements: [
    ["Durere", "4"],
    ["Temperatura", "36.9 C"],
  ],
  responses: [
    ["Ai avut febra?", "Nu"],
    ["Aspect plaga", "Normal"],
  ],
  notes: "Ma simt mai bine decat ieri.",
  photos: [
    "https://images.unsplash.com/photo-1584362917165-526a968579e8?auto=format&fit=crop&w=900&q=70",
  ],
};

export default function CheckinSubmittedScreen({ onBack }: Props) {
  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.detailHeaderRow}>
        <BackButton onPress={onBack} />
        <Text style={styles.detailTitle}>{t("checkinSentTitle")}</Text>
      </View>

      <View style={styles.checkinDonePanel}>
        <View style={styles.checkinDoneHeader}>
          <View style={styles.checkinDoneDot} />
          <View style={styles.checkinDoneBody}>
            <Text style={styles.checkinDoneTitle}>
              {t("checkinSentSubtitle")}
            </Text>
            <Text style={styles.checkinDoneMeta}>
              {t("checkinSentAtLabel")} {TODAY_CHECKIN.sentAt}
            </Text>
          </View>
        </View>

        <View style={styles.checkinDoneSection}>
          <Text style={styles.checkinDoneLabel}>
            {t("checkinSentPreviewLabel")}
          </Text>

          {TODAY_CHECKIN.measurements.map(([label, value]) => (
            <PreviewRow key={label} label={label} value={value} />
          ))}

          {TODAY_CHECKIN.responses.map(([label, value]) => (
            <PreviewRow key={label} label={label} value={value} />
          ))}

          <PreviewRow
            label={t("checkinSentNotesLabel")}
            value={TODAY_CHECKIN.notes}
          />

          <View style={styles.checkinDonePhotos}>
            {TODAY_CHECKIN.photos.map((uri) => (
              <Image
                key={uri}
                source={{ uri }}
                style={styles.checkinDonePhoto}
              />
            ))}
          </View>
        </View>

        <Text style={styles.checkinDoneHint}>{t("checkinSentHint")}</Text>
      </View>
    </ScrollView>
  );
}

function PreviewRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.checkinDonePreviewRow}>
      <Text style={styles.checkinDonePreviewLabel}>{label}</Text>
      <Text style={styles.checkinDonePreviewValue}>{value}</Text>
    </View>
  );
}
