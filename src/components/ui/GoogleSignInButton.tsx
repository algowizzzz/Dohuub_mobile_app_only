import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity } from 'react-native';
import GoogleIcon from './GoogleIcon';
import { colors, fontFamily } from '../../styles';

type Props = {
  onPress: () => void;
  busy?: boolean;
  label?: string;
};

export default function GoogleSignInButton({ onPress, busy, label = 'Continue with Google' }: Props) {
  return (
    <TouchableOpacity
      style={[styles.button, busy && styles.buttonDisabled]}
      onPress={onPress}
      disabled={busy}
      activeOpacity={0.85}
    >
      {busy ? <ActivityIndicator size="small" color={colors.text} /> : <GoogleIcon size={18} />}
      <Text style={styles.label}>{busy ? 'Signing in…' : label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    minHeight: 52,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(46,122,217,0.2)',
    backgroundColor: colors.white,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  label: {
    fontFamily: fontFamily.semiBold,
    fontSize: 15,
    color: colors.text,
  },
});
