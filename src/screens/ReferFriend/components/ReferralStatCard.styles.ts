import { StyleSheet } from 'react-native';
import { colors, fontFamily, radius, spacing } from '../../../styles';

export const styles = StyleSheet.create({
  card: {
    flex: 1,
    alignItems: 'center',
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: 4,
  },
  neutral: {
    backgroundColor: colors.secondarySurface,
  },
  pending: {
    backgroundColor: colors.warningLight,
  },
  success: {
    backgroundColor: colors.successLight,
  },
  value: {
    fontFamily: fontFamily.bold,
    fontSize: 22,
    color: colors.text,
  },
  pendingValue: {
    color: 'rgb(217, 119, 6)',
  },
  successValue: {
    color: 'rgb(22, 163, 74)',
  },
  label: {
    fontFamily: fontFamily.regular,
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 4,
    textAlign: 'center',
  },
  pendingLabel: {
    color: 'rgb(217, 119, 6)',
  },
  successLabel: {
    color: 'rgb(22, 163, 74)',
  },
});
