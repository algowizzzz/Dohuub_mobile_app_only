import { StyleSheet } from 'react-native';
import { colors, fontFamily, radius, spacing, typography } from '../../../styles';

// Ported from the PWA's RegisterScreen.module.css — --m-glass header with a
// bare back arrow, centered body: 80px #EEF2FF icon circle, centered 24px/500
// title, 16px subtitle, fields column, centered error, cta, "Use Google
// Instead" text link. Signup keeps the RN app's extra fields (full name,
// phone, referral) and inline Google button (no PWA 1:1 exists for that
// combination), styled with the same scale/colors.
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
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    alignItems: 'center',
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
  // PWA .title: 24px/500, centered, margin-bottom 8
  title: {
    ...typography.h1,
    fontFamily: fontFamily.medium,
    color: colors.text,
    textAlign: 'center',
  },
  // PWA .subtitle: 16px, margin-bottom 28
  subtitle: {
    ...typography.subtitle,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.sm - 2,
    marginBottom: spacing.xl - 4,
  },
  // PWA .fields: max-width 340, gap 14 (TextField/PasswordField already
  // carry their own bottom margin, so no extra gap is added here to avoid
  // doubling the spacing).
  form: {
    width: '100%',
    maxWidth: 340,
  },
  submitButton: {
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    ...typography.caption,
    color: colors.textMuted,
    marginHorizontal: spacing.sm,
  },
  // PWA .error: 14px on error-light, radius 10, max-width 340
  errorText: {
    fontFamily: fontFamily.regular,
    fontSize: 14,
    color: colors.danger,
    backgroundColor: colors.errorLight,
    borderRadius: radius.md + 2,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md - 2,
    marginBottom: spacing.md,
    textAlign: 'left',
  },
  passwordHint: {
    fontFamily: fontFamily.regular,
    fontSize: 12,
    color: colors.textMuted,
    marginTop: -8,
    marginBottom: spacing.md,
  },
});
