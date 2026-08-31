import { StyleSheet } from 'react-native';
import { colors, fontFamily, radius, spacing, typography } from '../../../styles';

// Ported from the PWA's MVerifyOtpScreen.module.css — --m-glass header with
// bare back arrow, centered body: 80px #EEF2FF shield-circle, centered
// 24px title, 16px subtitle with the email inlined in bold, OTP row, resend
// row (countdown text or link), CTA at the bottom.
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginLeft: spacing.md,
    marginTop: spacing.sm,
    padding: spacing.xs,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  // PWA .circle: 80x80, radius 50%, #EEF2FF bg, centered icon
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
  },
  // PWA .title: 24px/500, centered
  title: {
    ...typography.h1,
    fontFamily: fontFamily.medium,
    color: colors.text,
    textAlign: 'center',
  },
  // PWA .subtitle: 16px, centered, "sent to <strong email>"
  subtitle: {
    ...typography.subtitle,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.sm - 2,
    marginBottom: spacing.xl - 4,
  },
  email: {
    fontFamily: fontFamily.semiBold,
    color: colors.text,
  },
  otpWrap: {
    marginBottom: spacing.lg,
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
  // PWA .resendRow: margin below OTP/error, above CTA
  resendRow: {
    marginBottom: spacing.lg,
  },
  resendWait: {
    fontFamily: fontFamily.regular,
    fontSize: 14,
    color: colors.textMuted,
  },
  // PWA .resend: 16px/500, var(--m-primary)
  resendText: {
    fontFamily: fontFamily.medium,
    fontSize: 16,
    color: colors.primary,
  },
  cta: {
    width: '100%',
    maxWidth: 340,
  },
  verifyButton: {
    marginBottom: spacing.lg,
  },
});
