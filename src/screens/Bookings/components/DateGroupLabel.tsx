import React from 'react';
import { Text, View } from 'react-native';
import { styles } from './DateGroupLabel.styles';

type Props = {
  label: string;
  count: number;
};

export default function DateGroupLabel({ label, count }: Props) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label.toUpperCase()}</Text>
      <Text style={styles.count}>{count}</Text>
    </View>
  );
}
