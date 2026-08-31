import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../../styles';
import { SORT_LABELS, type SortKey } from '../sorting';
import { styles } from './SortFilterBar.styles';

type Props = {
  sortKey: SortKey;
  onPressSort: () => void;
};

export default function SortFilterBar({ sortKey, onPressSort }: Props) {
  return (
    <View style={styles.row}>
      <TouchableOpacity style={styles.sortButton} onPress={onPressSort} activeOpacity={0.8}>
        <Text style={styles.sortLabel}>Sort by</Text>
        <Text style={styles.sortValue}>{SORT_LABELS[sortKey]}</Text>
        <Icon name="chevron-down" size={14} color={colors.primary} />
      </TouchableOpacity>
    </View>
  );
}
