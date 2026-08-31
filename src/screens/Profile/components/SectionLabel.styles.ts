import { StyleSheet } from 'react-native';
import { colors, fontFamily, spacing } from '../../../styles';

export const styles = StyleSheet.create({
  label: {
    fontFamily: fontFamily.bold,
    fontSize: 12,
    color: colors.textMuted,
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
  },
});
