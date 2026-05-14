import { View, TextInput } from "react-native";
import { palette, styles } from "../../App.styles";
import { t } from "@shared/translations";

type Props = {
  search: string;
  onSearchChange: (text: string) => void;
};

export function SearchBar({ search, onSearchChange }: Props) {
  return (
    <TextInput
      style={[styles.authInput, { marginBottom: 22 }]}
      value={search}
      onChangeText={onSearchChange}
      placeholder={t("searchPlaceholder")}
      placeholderTextColor={palette.textTertiary}
      testID="search-input"
    />
  );
}
