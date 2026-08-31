import React from 'react';
import { Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../../styles';
import { styles } from './DetailInfoRow.styles';

type Props = {
  icon: string;
  label: string;
  value: string;
  secondaryValue?: string;
  valueColor?: string;
  isLast?: boolean;
};

export default function DetailInfoRow({
  icon,
  label,
  value,
  secondaryValue,
  valueColor,
  isLast,
}: Props) {
  return (
    <View style={[styles.row, !isLast && styles.rowSpaced]}>
      <View style={styles.iconWrap}>
        <Icon name={icon} size={16} color={colors.primary} />
      </View>
      <View style={styles.textCol}>
        <Text style={styles.label}>{label}</Text>
        <Text style={[styles.value, valueColor ? { color: valueColor } : null]}>{value}</Text>
        {secondaryValue ? <Text style={styles.secondaryValue}>{secondaryValue}</Text> : null}
      </View>
    </View>
  );
}
