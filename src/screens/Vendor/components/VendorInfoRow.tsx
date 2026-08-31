import React from 'react';
import { Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../../styles';
import { styles } from './VendorInfoRow.styles';

type Props = {
  icon: string;
  label: string;
  value: string;
};

export default function VendorInfoRow({ icon, label, value }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.iconWrap}>
        <Icon name={icon} size={20} color={colors.primary} />
      </View>
      <View style={styles.textCol}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value}</Text>
      </View>
    </View>
  );
}