import React from 'react';
import { ActivityIndicator, Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { colors } from '../../styles';
import { styles } from './PrimaryButton.styles';

type Props = TouchableOpacityProps & {
  label: string;
  loading?: boolean;
};

export default function PrimaryButton({ label, loading, disabled, style, ...rest }: Props) {
  return (
    <TouchableOpacity
      style={[styles.button, (disabled || loading) && styles.buttonDisabled, style]}
      activeOpacity={0.85}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={disabled ? colors.textMuted : colors.white} />
      ) : (
        <Text style={[styles.label, disabled && styles.labelDisabled]}>{label}</Text>
      )}
    </TouchableOpacity>
  );
}
