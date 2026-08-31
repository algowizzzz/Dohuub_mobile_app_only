import React from 'react';
import { Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Path, Rect } from 'react-native-svg';
import { styles } from './EarnPointsCard.styles';

type Props = {
  pointsPerDollar?: number | null;
};

function GiftOutline({ size = 20, color = '#B45309' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="3" y="8" width="18" height="4" rx="1" stroke={color} strokeWidth={2} />
      <Path d="M12 8v13" stroke={color} strokeWidth={2} strokeLinecap="round" />
      <Path
        d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default function EarnPointsCard({ pointsPerDollar }: Props) {
  const rate = pointsPerDollar && pointsPerDollar > 0 ? pointsPerDollar : 1;
  const unit = rate === 1 ? 'point' : 'points';

  return (
    <LinearGradient
      colors={['rgba(245, 158, 11, 0.1)', 'rgba(249, 115, 22, 0.1)']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.card}
    >
      <View style={styles.iconWrap}>
        <GiftOutline />
      </View>
      <View style={styles.textCol}>
        <Text style={styles.title}>Earn points on this service</Text>
        <Text style={styles.subtitle}>
          {rate} {unit} per $1 spent • Points added after service completion
        </Text>
      </View>
    </LinearGradient>
  );
}
