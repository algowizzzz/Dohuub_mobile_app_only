import { StyleSheet } from 'react-native';
import { colors, fontFamily, radius, spacing, typography } from '../../../styles';

// Styled with the same card language as the PWA's EmailSigninScreen — --m-bg
// background, left-aligned title/subtitle, error pill on --m-error-light,
// success state uses a --m-secondary icon circle in var(--m-primary).
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: spacing.lg,
    paddingTop: spacing.xl,
  },
  title: {
    ...typography.h1,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.subtitle,
    color: colors.textMuted,
    marginBottom: spacing.xl,
    lineHeight: 22,
  },
  errorText: {
    fontFamily: fontFamily.regular,
    fontSize: 14,
    color: colors.danger,
    backgroundColor: colors.errorLight,
    borderRadius: radius.md + 2,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md - 2,
    marginBottom: spacing.md,
  },
  submitButton: {
    marginTop: spacing.sm,
  },
  successWrap: {
    alignItems: 'center',
    paddingTop: spacing.xl,
  },
  successIconWrap: {
    width: 64,
    height: 64,
    borderRadius: radius.full,
    backgroundColor: colors.secondarySurface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  successTitle: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  successBody: {
    ...typography.subtitle,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.xl,
  },
  backButton: {
    width: '100%',
  },
});
