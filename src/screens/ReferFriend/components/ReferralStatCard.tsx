import React from 'react';
import { Text, View } from 'react-native';
import { styles } from './ReferralStatCard.styles';

type Props = {
  value: string;
  label: string;
  tone: 'neutral' | 'pending' | 'success';
};

export default function ReferralStatCard({ value, label, tone }: Props) {
  return (
    <View
      style={[
        styles.card,
        tone === 'pending' && styles.pending,
        tone === 'success' && styles.success,
        tone === 'neutral' && styles.neutral,
      ]}
    >
      <Text
        style={[
          styles.value,
          tone === 'pending' && styles.pendingValue,
          tone === 'success' && styles.successValue,
        ]}
      >
        {value}
      </Text>
      <Text
        style={[
          styles.label,
          tone === 'pending' && styles.pendingLabel,
          tone === 'success' && styles.successLabel,
        ]}
      >
        {label}
      </Text>
    </View>
  );
}