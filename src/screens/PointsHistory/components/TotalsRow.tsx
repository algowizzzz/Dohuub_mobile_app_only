import React from 'react';
import { Text, View } from 'react-native';
import { colors } from '../../../styles';
import { styles } from './TotalsRow.styles';

type Props = {
  earned: number;
  redeemed: number;
  returned: number;
};

export default function TotalsRow({ earned, redeemed, returned }: Props) {
  return (
    <View style={styles.row}>
      <View style={styles.card}>
        <Text style={[styles.value, { color: colors.success }]}>+{earned.toLocaleString()}</Text>
        <Text style={styles.label}>Total earned</Text>
      </View>
      <View style={styles.card}>
        <Text style={[styles.value, { color: colors.primary }]}>-{redeemed.toLocaleString()}</Text>
        <Text style={styles.label}>Total redeemed</Text>
      </View>
      <View style={styles.card}>
        <Text style={[styles.value, { color: colors.danger }]}>+{returned.toLocaleString()}</Text>
        <Text style={styles.label}>Total returned</Text>
      </View>
    </View>
  );
}
