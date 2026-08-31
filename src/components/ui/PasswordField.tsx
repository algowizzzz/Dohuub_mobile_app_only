import React, { useState } from 'react';
import { Text, TextInput, TextInputProps, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../styles';
import { styles } from './TextField.styles';

type Props = TextInputProps & {
  label: string;
  // Optional left-aligned icon, matching the PWA Input's iconLeft slot
  // (e.g. EmailSigninScreen's lock-closed-outline). Existing call sites
  // that don't pass it render exactly as before.
  iconLeft?: React.ReactNode;
};

export default function PasswordField({ label, style, iconLeft, onFocus, onBlur, ...inputProps }: Props) {
  const [visible, setVisible] = useState(false);
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputRow}>
        {iconLeft ? <View style={styles.iconLeft}>{iconLeft}</View> : null}
        <TextInput
          style={[
            styles.input,
            styles.inputWithIcon,
            iconLeft ? styles.inputWithIconLeft : undefined,
            focused ? styles.inputFocused : undefined,
            style,
          ]}
          placeholderTextColor={colors.textFaint}
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry={!visible}
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
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => setVisible(prev => !prev)}
          hitSlop={8}
        >
          <Icon
            name={visible ? 'eye-off-outline' : 'eye-outline'}
            size={20}
            color={colors.textMuted}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}
