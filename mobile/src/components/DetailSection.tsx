import { ReactNode } from "react";
import { View, Text } from "react-native";
import { styles } from "../../App.styles";

type Props = {
  title: string;
  children: ReactNode;
};

export function DetailSection({ title, children }: Props) {
  return (
    <View style={styles.detailSection}>
      <Text style={styles.detailSectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

type ItemProps = {
  label: string;
  value: string;
  isLast?: boolean;
};

// pentru perechile de date intrebare-raspuns din chestionar
// si verifica sa fie ultimul in lista
export function DetailItem({ label, value, isLast }: ItemProps) {
  return (
    <View style={[styles.detailItem, isLast && styles.detailItemLast]}>
      <Text style={styles.detailItemLabel}>{label}</Text>
      <Text style={styles.detailItemValue}>{value}</Text>
    </View>
  );
}

type MetricProps = {
  label: string;
  value: string;
  isLast?: boolean;
};

export function DetailMetric({ label, value, isLast }: MetricProps) {
  return (
    <View style={[styles.detailMetricRow, isLast && styles.detailItemLast]}>
      <Text style={styles.detailMetricLabel}>{label}</Text>
      <Text style={styles.detailMetricValue}>{value}</Text>
    </View>
  );
}
