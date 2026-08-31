import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../../styles';
import { styles } from './ChatDetailHeader.styles';

type Props = {
  onBack: () => void;
};

export default function ChatDetailHeader({ onBack }: Props) {
  return (
    <View style={styles.wrap}>
      <TouchableOpacity style={styles.backButton} onPress={onBack} hitSlop={8}>
        <Icon name="arrow-back" size={20} color={colors.text} />
      </TouchableOpacity>

      <View style={styles.avatar}>
        <Icon name="hardware-chip-outline" size={18} color={colors.primary} />
      </View>

      <View>
        <Text style={styles.name}>DoHuub AI</Text>
        <Text style={styles.tagline}>Ask me anything</Text>
      </View>
    </View>
  );
}
