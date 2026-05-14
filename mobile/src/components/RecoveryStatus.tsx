import { View, Text } from "react-native";
import { styles } from "../../App.styles";
import { t } from "@shared/translations";
import { Patient } from "../types";

type Props = {
  patient: Patient;
};

export function RecoveryStatus({ patient }: Props) {
  return (
    <View style={styles.recoveryRow}>
      <View style={styles.recoveryDot} />
      <Text style={styles.recoveryText}>
        {t("dayWord")}{" "}
        <Text style={styles.recoveryDayNumber}>{patient.recoveryDay}</Text>{" "}
        {t("recoverySuffix")}
      </Text>
      <View style={styles.recoverySeparator} />
      <Text style={styles.recoverySurgery}>{patient.surgeryType}</Text>
    </View>
  );
}
