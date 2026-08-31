import React from 'react';
import { Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { styles } from './InfoStatCard.styles';

type Props = {
  icon: string;
  label: string;
  value: string;
  suffix: string;
  tone: 'neutral' | 'danger';
};

export default function InfoStatCard({ icon, label, value, suffix, tone }: Props) {
  const danger = tone === 'danger';

  return (
    <View style={[styles.card, danger && styles.cardDanger]}>
      <View style={styles.labelRow}>
        <Icon name={icon} size={16} color={danger ? '#DC2626' : '#64748B'} />
        <Text style={[styles.label, danger && styles.labelDanger]}>{label}</Text>
      </View>
      <Text style={[styles.value, danger && styles.valueDanger]}>{value}</Text>
      <Text style={[styles.suffix, danger && styles.suffixDanger]}>{suffix}</Text>
    </View>
  );
}