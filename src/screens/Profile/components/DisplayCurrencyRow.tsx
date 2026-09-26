import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MenuRow from './MenuRow';
import { useDisplayCurrency } from '../../../store/currencyStore';
import { colors, fontFamily } from '../../../styles';

/** Profile → Display currency: shows the current code, opens the picker. */
export default function DisplayCurrencyRow({ onPress }: { onPress: () => void }) {
  const code = useDisplayCurrency();
  return (
    <MenuRow
      testID="profile-display-currency"
      icon="cash-outline"
      label="Display currency"
      onPress={onPress}
      rightElement={
        <View style={styles.right}>
          <Text style={styles.code}>{code}</Text>
          <Icon name="chevron-forward" size={18} color={colors.textMuted} />
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  code: {
    fontFamily: fontFamily.regular,
    fontSize: 13,
    color: colors.textMuted,
  },
});
