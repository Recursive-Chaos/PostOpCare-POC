import { useState } from "react";
import {
  Image,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { t } from "@shared/translations";
import { styles } from "../../App.styles";
import { Question } from "../types";
import {
  numberRange,
  photoPreviewUri,
  questionOptions,
  questionRange,
  questionType,
  shouldUseStepper,
} from "../utils/checkin";

type Props = {
  question: Question;
  value: string;
  onChange: (value: string) => void;
  onPickPhoto: () => void;
  onTakePhoto: () => void;
};

type FieldProps = Pick<Props, "question" | "value" | "onChange">;

export function CheckinQuestionField(props: Props) {
  const { question } = props;
  return (
    <View style={styles.checkinQuestion}>
      <Text style={styles.checkinLabel}>
        {question.text}
        {question.required ? " *" : ""}
      </Text>
      {renderControl(props)}
    </View>
  );
}

function renderControl(props: Props) {
  switch (questionType(props.question)) {
    case "number":
      return <NumberField {...props} />;
    case "scale":
      return <ScaleField {...props} />;
    case "boolean":
      return <Options options={["Da", "Nu"]} {...props} />;
    case "choice":
      return <Options options={questionOptions(props.question)} {...props} />;
    case "photo":
      return <PhotoField {...props} />;
    default:
      return <TextField {...props} />;
  }
}

function TextField({ value, onChange }: FieldProps) {
  return (
    <TextInput
      style={[styles.checkinInput, styles.checkinTextarea]}
      value={value}
      onChangeText={onChange}
      placeholder={t("checkinTextPlaceholder")}
      multiline
    />
  );
}

function NumberField({ question, value, onChange }: FieldProps) {
  const { unit } = questionRange(question);

  return (
    <View style={styles.checkinNumberRow}>
      <TouchableOpacity
        style={styles.checkinNumberButton}
        onPress={() => changeNumber(value, question, -1, onChange)}
      >
        <Text style={styles.checkinNumberButtonText}>-</Text>
      </TouchableOpacity>
      <TextInput
        style={[styles.checkinInput, styles.checkinNumberInput]}
        value={value}
        onChangeText={onChange}
        keyboardType="decimal-pad"
        placeholder={t("checkinNumberPlaceholder")}
      />
      <TouchableOpacity
        style={styles.checkinNumberButton}
        onPress={() => changeNumber(value, question, 1, onChange)}
      >
        <Text style={styles.checkinNumberButtonText}>+</Text>
      </TouchableOpacity>
      {unit ? <Text style={styles.checkinUnit}>{unit}</Text> : null}
    </View>
  );
}

function Options({
  options,
  value,
  onChange,
}: FieldProps & { options: string[] }) {
  return (
    <View style={styles.checkinOptions}>
      {options.map((option) => (
        <Option
          key={option}
          option={option}
          value={value}
          onChange={onChange}
        />
      ))}
    </View>
  );
}

function ActionButton({
  label,
  onPress,
}: {
  label: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.checkinPhotoButton} onPress={onPress}>
      <Text style={styles.checkinPhotoButtonText}>{label}</Text>
    </TouchableOpacity>
  );
}

function PhotoField({ value, onPickPhoto, onTakePhoto }: Props) {
  const [previewOpen, setPreviewOpen] = useState(false);
  const uri = photoPreviewUri(value);

  return (
    <>
      {uri ? (
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => setPreviewOpen(true)}
        >
          <Image source={{ uri }} style={styles.checkinPhoto} />
          <Text style={styles.checkinPhotoHint}>
            {t("checkinPhotoPreview")}
          </Text>
        </TouchableOpacity>
      ) : null}
      <View style={styles.checkinPhotoActions}>
        <ActionButton label={t("checkinCameraBtn")} onPress={onTakePhoto} />
        <ActionButton label={t("checkinGalleryBtn")} onPress={onPickPhoto} />
      </View>
      <Modal
        visible={previewOpen}
        transparent={false}
        animationType="fade"
        onRequestClose={() => setPreviewOpen(false)}
      >
        <View style={styles.photoModal}>
          <TouchableOpacity
            style={styles.photoCloseBtn}
            onPress={() => setPreviewOpen(false)}
            activeOpacity={0.7}
          >
            <Text style={styles.photoCloseBtnText}>x</Text>
          </TouchableOpacity>
          <ScrollView
            style={styles.photoModalScroll}
            contentContainerStyle={styles.photoModalContent}
            maximumZoomScale={3}
            minimumZoomScale={1}
            centerContent
          >
            <Image
              source={{ uri }}
              style={styles.photoFullImage}
              resizeMode="contain"
            />
          </ScrollView>
        </View>
      </Modal>
    </>
  );
}

function ScaleField({ question, value, onChange }: FieldProps) {
  if (shouldUseStepper(question)) {
    return (
      <NumberField question={question} value={value} onChange={onChange} />
    );
  }

  const { min, max } = questionRange(question);
  const count = max - min + 1;

  if (count > 12) {
    return (
      <TextInput
        style={styles.checkinInput}
        value={value}
        onChangeText={onChange}
        keyboardType="numeric"
        placeholder={`${min}-${max}`}
      />
    );
  }

  return (
    <View style={styles.checkinOptions}>
      {numberRange(min, max).map((number) => (
        <Option
          key={number}
          option={String(number)}
          value={value}
          onChange={onChange}
        />
      ))}
    </View>
  );
}

function changeNumber(
  value: string,
  question: Question,
  direction: -1 | 1,
  onChange: (value: string) => void,
) {
  const { min, max, step } = questionRange(question);
  const fallback = min;
  const parsed = Number(value.replace(",", "."));
  const current = Number.isNaN(parsed) ? fallback : parsed;
  const next = Math.min(max, Math.max(min, current + step * direction));

  onChange(formatNumber(next, step));
}

function formatNumber(value: number, step: number) {
  return Number.isInteger(step) ? String(value) : value.toFixed(1);
}

function Option({
  option,
  value,
  onChange,
}: {
  option: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const active = value === option;

  return (
    <TouchableOpacity
      style={[styles.checkinOption, active && styles.checkinOptionActive]}
      onPress={() => onChange(option)}
    >
      <Text
        style={[
          styles.checkinOptionText,
          active && styles.checkinOptionTextActive,
        ]}
      >
        {option}
      </Text>
    </TouchableOpacity>
  );
}
