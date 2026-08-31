import React from 'react';
import { Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../../styles';
import type { ApiReferralInvite } from '../../../services/engagementApi';
import { abbreviateName } from '../../../utils/relativeTime';
import { styles } from './ReferralHistoryRow.styles';

type Props = {
  entry: ApiReferralInvite;
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function ReferralHistoryRow({ entry }: Props) {
  const isQualified = entry.status === 'qualified';
  const name = entry.referee.fullName || 'Friend';
  const initial = name.trim().charAt(0).toUpperCase() || '?';

  return (
    <View style={styles.card}>
      <View style={styles.avatar}>
        <Text style={styles.avatarInitial}>{initial}</Text>
      </View>

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {abbreviateName(name)}
        </Text>
        <Text style={styles.date}>{formatDate(entry.createdAt)}</Text>
      </View>

      {isQualified ? (
        <View style={styles.status}>
          <Icon name="checkmark-circle-outline" size={18} color={colors.text} />
          <Text style={styles.points}>+{entry.referrerPoints} pts</Text>
        </View>
      ) : (
        <View style={styles.status}>
          <Icon name="time-outline" size={16} color="rgb(245, 158, 11)" />
          <Text style={styles.pending}>Pending</Text>
        </View>
      )}
    </View>
  );
}