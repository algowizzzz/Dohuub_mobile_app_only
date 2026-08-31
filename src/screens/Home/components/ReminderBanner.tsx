import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../../styles';
import { styles } from './ReminderBanner.styles';

type Props = {
  icon: string;
  message: string;
  onPress: () => void;
};

export default function ReminderBanner({ icon, message, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.wrap} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.iconWrap}>
        <Icon name={icon} size={18} color={colors.warning} />
      </View>
      <Text style={styles.message}>{message}</Text>
      <Icon name="chevron-forward" size={18} color={colors.textMuted} />
    </TouchableOpacity>
  );
}
