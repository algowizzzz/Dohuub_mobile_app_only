import React from 'react';
import { Text, View } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';
import { styles } from './EarnPointsCard.styles';

type Props = {
  pointsPerDollar?: number | null;
  /** The listing's currency; points accrue per 1 unit of it. */
  currency?: string | null;
  title?: string;
  note?: string;
};

/** "1 point per $1" for USD, "2 points per 1 JMD" otherwise; rate falls back to 1. */
export function pointsRateText(pointsPerDollar?: number | null, currency?: string | null): string {
  const rate = pointsPerDollar && pointsPerDollar > 0 ? pointsPerDollar : 1;
  const unit = rate === 1 ? 'point' : 'points';
  const code = (currency || 'USD').toUpperCase();
  return code === 'USD' ? `${rate} ${unit} per $1 spent` : `${rate} ${unit} per 1 ${code} spent`;
}

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

/** Only render for Powered by DoHuub vendors — other purchases don't earn points. */
export default function EarnPointsCard({
  pointsPerDollar,
  currency,
  title = 'Earn points on this service',
  note = 'Points added after service completion',
}: Props) {

  return (
    <View style={styles.card}>
      <View style={styles.iconWrap}>
        <GiftOutline />
      </View>
      <View style={styles.textCol}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>
          {pointsRateText(pointsPerDollar, currency)} • {note}
        </Text>
      </View>
    </View>
  );
}
