import { StyleSheet } from 'react-native';
import { colors, fontFamily, radius, spacing } from '../../styles';

export const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    marginBottom: spacing.lg,
  },
  // PWA .label: 13px/400, color var(--m-text)
  label: {
    fontFamily: fontFamily.regular,
    fontSize: 13,
    color: colors.text,
    marginBottom: spacing.sm - 2,
  },
  // PWA .box: white surface, 2px solid var(--m-border), radius 12
  input: {
    width: '100%',
    height: 52,
    borderRadius: radius.lg,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md - 2,
    fontFamily: fontFamily.regular,
    fontSize: 16,
    color: colors.text,
  },
  inputFocused: {
    borderColor: colors.primary,
  },
  inputRow: {
    position: 'relative',
    justifyContent: 'center',
  },
  inputWithIcon: {
    paddingRight: spacing.xl + spacing.md,
  },
  iconButton: {
    position: 'absolute',
    right: spacing.md,
    height: 52,
    justifyContent: 'center',
  },
  // Left icon slot, matching the PWA Input's iconLeft (mail-outline,
  // lock-closed-outline on EmailSigninScreen).
  iconLeft: {
    position: 'absolute',
    left: spacing.md,
    height: 52,
    justifyContent: 'center',
    zIndex: 1,
  },
  inputWithIconLeft: {
    paddingLeft: spacing.xl + spacing.sm,
  },
});
