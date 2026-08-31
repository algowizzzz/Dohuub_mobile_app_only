import React from 'react';
import { Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../../styles';
import { styles } from './BalanceCard.styles';

type Props = {
  points: number;
  value: number;
};

export default function BalanceCard({ points, value }: Props) {
  return (
    <LinearGradient
      colors={[colors.gradientStart, colors.gradientEnd]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.card}
    >
      <View style={styles.row}>
        <Icon name="gift-outline" size={22} color="rgba(255,255,255,0.85)" />
        <Text style={styles.label}>Available Points</Text>
      </View>
      <Text style={styles.points}>{points.toLocaleString()}</Text>
      <Text style={styles.value}>≈ ${value.toFixed(2)} value</Text>
    </LinearGradient>
  );
}