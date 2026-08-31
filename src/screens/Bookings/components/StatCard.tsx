import React from 'react';
import { Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { styles } from './StatCard.styles';

type Props = {
  icon: string;
  value: string;
  label: string;
  tint: string;
  tintSoft: string;
};

export default function StatCard({ icon, value, label, tint, tintSoft }: Props) {
  return (
    <View style={styles.card}>
      <View style={[styles.accent, { backgroundColor: tint }]} />

      <View style={[styles.iconWrap, { backgroundColor: tintSoft }]}>
        <Icon name={icon} size={17} color={tint} />
      </View>
      <Text style={[styles.value, { color: tint }]}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}
