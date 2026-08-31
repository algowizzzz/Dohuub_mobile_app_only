import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../../styles';
import { styles } from './PickerRow.styles';

type Props = {
  icon: string;
  value: string;
  placeholder: string;
  subtitle?: string;
  disabled?: boolean;
  onPress: () => void;
};

export default function PickerRow({ icon, value, placeholder, subtitle, disabled, onPress }: Props) {
  const hasValue = value.length > 0;

  return (
    <TouchableOpacity
      style={[styles.row, disabled && styles.rowDisabled]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <View style={styles.iconWrap}>
        <Icon name={icon} size={16} color={colors.primary} />
      </View>

      <View style={styles.textCol}>
        <Text style={[styles.value, !hasValue && styles.placeholder]}>
          {hasValue ? value : placeholder}
        </Text>
        {subtitle ? (
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>

      <Icon name="chevron-down" size={16} color={colors.textMuted} />
    </TouchableOpacity>
  );
}
