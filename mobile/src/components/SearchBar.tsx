import { View, TextInput } from 'react-native';
import { palette, styles } from '../../App.styles';
import { t } from '@shared/translations';

type Props = {
  search: string;
  onSearchChange: (text: string) => void;
};

export function SearchBar({ search, onSearchChange }: Props) {
  return (
    <View style={styles.searchBar}>
      <TextInput
        style={styles.searchInput}
        value={search}
        onChangeText={onSearchChange}
        placeholder={t('searchPlaceholder')}
        placeholderTextColor={palette.textTertiary}
        testID="search-input"
      />
    </View>
  );
}
