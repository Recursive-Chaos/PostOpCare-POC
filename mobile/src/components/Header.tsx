import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { styles } from "../../App.styles";
import { t } from "@shared/translations";
import { Patient } from "../types";

type Props = {
  user: any;
  patient: Patient;
  onLogout: () => void;
};

export function Header({ user, patient, onLogout }: Props) {
  return (
    <View style={styles.headerRow}>
      <View>
        <Text style={styles.greetingHello}>{t("greetingPatient")}</Text>
        <Text style={styles.greetingName}>
          {user ? user.firstName : patient.firstName}.
        </Text>
      </View>
      <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
        <Text style={styles.logoutText}>{t("signOutBtn")}</Text>
      </TouchableOpacity>
    </View>
  );
}
