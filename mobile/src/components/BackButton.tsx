import { Text, TouchableOpacity } from "react-native";
import { styles } from "../../App.styles";

type Props = {
  onPress: () => void;
  label?: string;
};

export function BackButton({ onPress, label = "Inapoi" }: Props) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={styles.backButton}
      onPress={onPress}
    >
      <Text style={styles.backButtonIcon}>‹</Text>
      <Text style={styles.backButtonText}>{label}</Text>
    </TouchableOpacity>
  );
}
