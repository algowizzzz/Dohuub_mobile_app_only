import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../../../styles';
import { styles } from './FilterTabs.styles';

export type FilterKey = 'all' | 'upcoming' | 'in_progress' | 'completed';

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'in_progress', label: 'In Progress' },
  { key: 'completed', label: 'Completed' },
];

type Props = {
  active: FilterKey;
  onChange: (key: FilterKey) => void;
};

export default function FilterTabs({ active, onChange }: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {FILTERS.map(filter => {
        const isActive = filter.key === active;
        return (
          <TouchableOpacity
            key={filter.key}
            onPress={() => onChange(filter.key)}
            activeOpacity={0.85}
            style={[styles.tab, isActive ? { backgroundColor: colors.primary } : styles.tabInactive]}
          >
            <Text style={isActive ? styles.tabLabelActive : styles.tabLabel}>{filter.label}</Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}
