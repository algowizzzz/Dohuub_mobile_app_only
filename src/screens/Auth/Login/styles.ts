import { StyleSheet } from 'react-native';
import { colors, fontFamily, spacing, typography } from '../../../styles';

// Ported from the PWA's EmailSigninScreen.module.css — --m-bg background,
// left-aligned "Back" link with icon+label, left-aligned 24px/700 title,
// 16px subtitle, form gap 18, forgot-password right-aligned, footer pinned
// to bottom with centered sign-up link.
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  // PWA .back: flex row, gap 6, 16px, margin-bottom 28 — no separate label
  // row so it sits directly above the title inside the scroll body.
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    marginLeft: spacing.lg,
    marginTop: spacing.sm,
    padding: spacing.xs,
  },
  backLabel: {
    fontFamily: fontFamily.regular,
    fontSize: 16,
    color: colors.textMuted,
  },
  // PWA .body: padding 24
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  // PWA .title: 24px/700, left-aligned, margin-bottom 6
  title: {
    ...typography.h1,
    color: colors.text,
    textAlign: 'left',
    marginTop: spacing.lg,
  },
  // PWA .subtitle: 16px, margin-bottom 28
  subtitle: {
    ...typography.subtitle,
    color: colors.textMuted,
    textAlign: 'left',
    marginTop: spacing.xs,
    marginBottom: spacing.xl,
  },
  // PWA .form: flex column, gap 18
  form: {
    width: '100%',
  },
  forgotWrap: {
    alignSelf: 'flex-end',
    marginBottom: spacing.lg,
  },
  // PWA .forgot: 16px/500, var(--m-primary)
  forgotText: {
    fontFamily: fontFamily.medium,
    fontSize: 16,
    color: colors.primary,
  },
  signInButton: {
    marginBottom: spacing.md,
  },
  // PWA .error: 14px, var(--m-error) on var(--m-error-light), radius 10
  errorText: {
    fontFamily: fontFamily.regular,
    fontSize: 14,
    color: colors.danger,
    backgroundColor: colors.errorLight,
    borderRadius: 10,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md - 2,
    marginBottom: spacing.md,
    textAlign: 'left',
  },
});
