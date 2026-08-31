import React from 'react';
import { Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../../styles';
import type { ApiRewardHistoryEntry } from '../../../services/engagementApi';
import { formatActivityDate } from '../mapWallet';
import { styles } from './ActivityRow.styles';

type Props = {
  transaction: ApiRewardHistoryEntry;
};

function iconFor(kind: ApiRewardHistoryEntry['kind'], label: string): string {
  const text = label.toLowerCase();
  if (text.includes('refer')) return 'people-outline';
  if (kind === 'redeemed') return 'trending-down-outline';
  if (kind === 'returned') return 'refresh-outline';
  return 'trending-up-outline';
}

export default function ActivityRow({ transaction }: Props) {
  const signed =
    transaction.kind === 'redeemed'
      ? `-${transaction.points}`
      : `+${transaction.points}`;
  const subtitle = [
    formatActivityDate(transaction.createdAt),
    transaction.booking?.reference,
  ]
    .filter(Boolean)
    .join(' • ');

  return (
    <View style={styles.card}>
      <View style={styles.iconWrap}>
        <Icon name={iconFor(transaction.kind, transaction.label)} size={18} color={colors.primaryDark} />
      </View>
      <View style={styles.info}>
        <Text style={styles.label} numberOfLines={1}>
          {transaction.label}
        </Text>
        {subtitle ? <Text style={styles.date}>{subtitle}</Text> : null}
      </View>
      <Text style={styles.points}>
        {signed} pts
      </Text>
    </View>
  );
}