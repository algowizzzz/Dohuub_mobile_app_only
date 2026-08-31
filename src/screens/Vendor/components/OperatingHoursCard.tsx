import React from 'react';
import { Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../../styles';
import type { HoursRow } from '../../../utils/hours';
import { styles } from './OperatingHoursCard.styles';

type Props = {
  rows: HoursRow[];
};

export default function OperatingHoursCard({ rows }: Props) {
  if (rows.length === 0) return null;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.iconWrap}>
          <Icon name="time-outline" size={20} color={colors.primary} />
        </View>
        <Text style={styles.title}>Operating Hours</Text>
      </View>
      <View style={styles.rows}>
        {rows.map(row => (
          <View key={row.label} style={styles.row}>
            <Text style={styles.day}>{row.label}</Text>
            <Text style={styles.time}>{row.time}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}