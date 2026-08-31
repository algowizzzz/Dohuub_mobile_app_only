import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../../styles';
import { styles } from './DangerRow.styles';

type Props = {
  icon: string;
  label: string;
  destructive?: boolean;
  onPress: () => void;
};

export default function DangerRow({ icon, label, destructive, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.iconWrap, destructive && styles.iconWrapDestructive]}>
        <Icon name={icon} size={16} color={destructive ? colors.danger : colors.textMuted} />
      </View>

      <Text style={[styles.label, destructive && styles.labelDestructive]}>{label}</Text>
    </TouchableOpacity>
  );
}
