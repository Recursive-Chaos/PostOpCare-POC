import { Image, ScrollView, Text, View } from "react-native";
import { t } from "@shared/translations";
import { styles } from "../../App.styles";
import { BackButton } from "../components/BackButton";
import { CheckinPayload, Questionnaire } from "../types";

type Props = {
  questionnaire?: Questionnaire | null;
  payload: CheckinPayload | null;
  onBack: () => void;
};

export default function CheckinSubmittedScreen({
  questionnaire,
  payload,
  onBack,
}: Props) {
  const rows = buildRows(questionnaire, payload);
  const sentAt = new Date(
    payload?.submitted_at ?? Date.now(),
  ).toLocaleTimeString("ro-RO", { hour: "2-digit", minute: "2-digit" });

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
              {t("checkinSentAtLabel")} {sentAt}
            </Text>
          </View>
        </View>

        <View style={styles.checkinDoneSection}>
          <Text style={styles.checkinDoneLabel}>
            {t("checkinSentPreviewLabel")}
          </Text>

          {rows.map((row) => (
            <PreviewRow key={row.label} label={row.label} value={row.value} />
          ))}

          {payload?.general_notes ? (
            <PreviewRow
              label={t("checkinSentNotesLabel")}
              value={payload.general_notes}
            />
          ) : null}

          {payload?.photos.length ? (
            <View style={styles.checkinDonePhotos}>
              {payload.photos.map((photo, index) =>
                photo.uri ? (
                  <Image
                    key={`${photo.uri}-${index}`}
                    source={{ uri: photo.uri }}
                    style={styles.checkinDonePhoto}
                  />
                ) : null,
              )}
            </View>
          ) : null}
        </View>

        <Text style={styles.checkinDoneHint}>{t("checkinSentHint")}</Text>
      </View>
    </ScrollView>
  );
}

function buildRows(
  questionnaire?: Questionnaire | null,
  payload?: CheckinPayload | null,
) {
  if (!payload) return [];

  const byQuestionId = new Map(
    questionnaire?.questions.map((question) => [
      question.questionId,
      question.text,
    ]) ?? [],
  );

  return [
    ...payload.measurements.map((measurement) => ({
      label: measurement.metric_name,
      value: `${measurement.metric_value}${measurement.unit ? ` ${measurement.unit}` : ""}`,
    })),
    ...payload.responses.map((response) => ({
      label: byQuestionId.get(response.question_id) ?? "Raspuns",
      value: response.answer_value,
    })),
  ];
}

function PreviewRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.checkinDonePreviewRow}>
      <Text style={styles.checkinDonePreviewLabel}>{label}</Text>
      <Text style={styles.checkinDonePreviewValue}>{value}</Text>
    </View>
  );
}
