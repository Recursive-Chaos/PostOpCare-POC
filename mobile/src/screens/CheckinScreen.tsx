import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { t } from "@shared/translations";
import { styles } from "../../App.styles";
import { BackButton } from "../components/BackButton";
import { CheckinQuestionField } from "../components/CheckinQuestionField";
import { CheckinPayload, Questionnaire } from "../types";
import {
  Answers,
  buildCheckinPayload,
  hasMissingRequired,
  setCheckinAnswer,
} from "../utils/checkin";

type Props = {
  questionnaire: Questionnaire;
  onBack: () => void;
  onDone: (payload: CheckinPayload) => void;
};

export default function CheckinScreen({
  questionnaire,
  onBack,
  onDone,
}: Props) {
  const [answers, setAnswers] = useState<Answers>({});
  const [error, setError] = useState("");

  function setAnswer(id: string, value: string) {
    setAnswers((old) => setCheckinAnswer(old, id, value));
  }

  async function addPhoto(id: string, source: "camera" | "gallery") {
    if (source === "camera") {
      const permission = await ImagePicker.requestCameraPermissionsAsync(); // cerem permisiune
      if (!permission.granted) {
        // nu ne da voie :(
        setError(t("checkinCameraError"));
        return;
      }
    }

    const picker =
      source === "camera"
        ? ImagePicker.launchCameraAsync
        : ImagePicker.launchImageLibraryAsync;

    const result = await picker({
      mediaTypes: ["images"],
      quality: 0.7, // 70% calitate, o sa fie mai mic fisieru
    });

    if (!result.canceled) {
      setAnswer(id, result.assets[0].uri); // punem uri in answers
    }
  }

  function submit() {
    if (hasMissingRequired(questionnaire.questions, answers)) {
      setError(t("checkinRequiredError"));
      return;
    }

    setError("");
    onDone(buildCheckinPayload(questionnaire, answers));
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.safeArea}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.detailHeaderRow}>
          <BackButton onPress={onBack} />
          <Text style={styles.detailTitle}>{questionnaire.title}</Text>
        </View>

        <View style={styles.checkinCard}>
          {questionnaire.questions.map((question) => (
            <CheckinQuestionField
              key={question.id}
              question={question}
              value={answers[question.id] ?? ""}
              onChange={(value) => setAnswer(question.id, value)}
              onPickPhoto={() => addPhoto(question.id, "gallery")}
              onTakePhoto={() => addPhoto(question.id, "camera")}
            />
          ))}

          {error ? <Text style={styles.authError}>{error}</Text> : null}
        </View>

        <TouchableOpacity style={styles.checkinSubmitButton} onPress={submit}>
          <Text style={styles.authButtonText}>{t("checkinSubmitBtn")}</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
