import React from 'react';
import { Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../../styles';
import type { ApiRewardHistoryEntry } from '../../../services/engagementApi';
import { styles } from './HistoryEntryRow.styles';

const KIND_META: Record<string, { sign: string; color: string }> = {
  earned: { sign: '+', color: colors.success },
  redeemed: { sign: '-', color: colors.primary },
  returned: { sign: '+', color: colors.danger },
};

const DEFAULT_KIND_META = { sign: '', color: colors.text };

type Props = {
  transaction: ApiRewardHistoryEntry;
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function HistoryEntryRow({ transaction }: Props) {
  const meta = KIND_META[transaction.kind] ?? DEFAULT_KIND_META;

  return (
    <View style={styles.card}>
      <View style={styles.iconWrap}>
        <Icon name="gift" size={16} color={colors.secondary} />
      </View>

      <View style={styles.info}>
        <View style={styles.topRow}>
          <Text style={styles.label} numberOfLines={1}>
            {transaction.label}
          </Text>
          <Text style={[styles.points, { color: meta.color }]}>
            {meta.sign}
            {transaction.points} pts
          </Text>
        </View>

        <View style={styles.bottomRow}>
          <View style={styles.balanceBadge}>
            <Text style={styles.balanceBadgeText}>Balance {transaction.balanceAfter}</Text>
          </View>
          <Text style={styles.date}>{formatDate(transaction.createdAt)}</Text>
        </View>
      </View>
    </View>
  );
}
