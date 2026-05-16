import { View, Text, TouchableOpacity } from "react-native";
import { styles } from "../../App.styles";
import { t } from "@shared/translations";

type Props = {
  status: string;
  onPress?: () => void;
};

export function QuestionnaireCard({ status, onPress }: Props) {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={styles.questionnaireCard}
      onPress={onPress}
    >
      <View style={styles.questionnaireHeaderRow}>
        <Text style={styles.questionnaireLabel}>
          {t("dailyQuestionnaireLabel")}
        </Text>
        <View style={styles.questionnaireBadge}>
          <Text style={styles.questionnaireBadgeText}>{status}</Text>
        </View>
      </View>
      <View style={styles.questionnaireTitleRow}>
        <Text style={styles.questionnaireTitle}>
          {status === "Completat"
            ? t("viewSubmittedQuestionnaire")
            : t("fillQuestionnaire")}
        </Text>
        <View style={styles.questionnaireChevron}>
          <Text style={styles.questionnaireChevronText}>›</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
