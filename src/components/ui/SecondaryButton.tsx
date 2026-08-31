import React from 'react';
import { Text, TouchableOpacity, TouchableOpacityProps, View } from 'react-native';
import { styles } from './SecondaryButton.styles';

type Props = TouchableOpacityProps & {
  label: string;
  icon?: React.ReactNode;
};

export default function SecondaryButton({ label, icon, style, ...rest }: Props) {
  return (
    <TouchableOpacity style={[styles.button, style]} activeOpacity={0.8} {...rest}>
      {icon ? <View style={styles.icon}>{icon}</View> : null}
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
}
