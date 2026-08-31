import React, { useState } from 'react';
import { Text, TextInput, TextInputProps, View } from 'react-native';
import { colors } from '../../styles';
import { styles } from './TextField.styles';

type Props = TextInputProps & {
  label: string;
  // Optional left-aligned icon, matching the PWA Input's iconLeft slot
  // (e.g. EmailSigninScreen's mail-outline / lock-closed-outline). Existing
  // call sites that don't pass it render exactly as before.
  iconLeft?: React.ReactNode;
};

export default function TextField({ label, style, iconLeft, onFocus, onBlur, ...inputProps }: Props) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputRow}>
        {iconLeft ? <View style={styles.iconLeft}>{iconLeft}</View> : null}
        <TextInput
          style={[
            styles.input,
            iconLeft ? styles.inputWithIconLeft : undefined,
            focused ? styles.inputFocused : undefined,
            style,
          ]}
          placeholderTextColor={colors.textFaint}
          autoCapitalize="none"
          autoCorrect={false}
          onFocus={e => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={e => {
            setFocused(false);
            onBlur?.(e);
          }}
          {...inputProps}
        />
      </View>
    </View>
  );
}
