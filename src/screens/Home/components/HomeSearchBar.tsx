import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../../styles';
import { styles } from './HomeSearchBar.styles';

type Props = {
  onPress: () => void;
};

export default function HomeSearchBar({ onPress }: Props) {
  return (
    <TouchableOpacity style={styles.wrap} onPress={onPress} activeOpacity={0.85}>
      <Icon name="search" size={20} color={colors.textMuted} />
      <Text style={styles.placeholder}>What service do you need?</Text>
    </TouchableOpacity>
  );
}
