import React from 'react';
import { Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { colors } from '../../../styles';
import { styles } from './RatingBar.styles';

type Props = {
  stars: number;
  count: number;
  total: number;
};

export default function RatingBar({ stars, count, total }: Props) {
  const percent = total > 0 ? (count / total) * 100 : 0;

  return (
    <View style={styles.row}>
      <Text style={styles.starsLabel}>{stars}</Text>
      <View style={styles.track}>
        {percent > 0 ? (
          <LinearGradient
            colors={[colors.gradientStart, colors.gradientEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.fill, { width: `${Math.max(percent, 8)}%` }]}
          />
        ) : (
          <View style={styles.emptyDot} />
        )}
      </View>
    </View>
  );
}