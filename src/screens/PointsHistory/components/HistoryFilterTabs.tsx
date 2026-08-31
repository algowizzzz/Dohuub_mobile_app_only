import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import type { ApiRewardHistoryEntry } from '../../../services/engagementApi';
import { styles } from './HistoryFilterTabs.styles';

export type HistoryFilter = 'all' | ApiRewardHistoryEntry['kind'];

const FILTERS: { key: HistoryFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'earned', label: 'Earned' },
  { key: 'redeemed', label: 'Redeemed' },
  { key: 'returned', label: 'Returned' },
];

type Props = {
  active: HistoryFilter;
  onChange: (key: HistoryFilter) => void;
};

export default function HistoryFilterTabs({ active, onChange }: Props) {
  return (
    <View style={styles.row}>
      {FILTERS.map(filter => {
        const isActive = filter.key === active;
        return (
          <TouchableOpacity
            key={filter.key}
            style={[styles.tab, isActive && styles.tabActive]}
            onPress={() => onChange(filter.key)}
            activeOpacity={0.85}
          >
            <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>{filter.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
