import { StyleSheet } from 'react-native';
import { colors, fontFamily, radius, spacing } from '../../../styles';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
    alignItems: 'center',
  },
  kicker: {
    alignSelf: 'flex-start',
    fontFamily: fontFamily.semiBold,
    fontSize: 16,
    color: colors.primary,
    marginBottom: spacing.xl,
  },
  giftCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    fontFamily: fontFamily.bold,
    fontSize: 22,
    color: colors.text,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: fontFamily.regular,
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
    lineHeight: 20,
  },
  codeInput: {
    width: '100%',
    height: 52,
    borderRadius: radius.lg,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    fontFamily: fontFamily.semiBold,
    fontSize: 16,
    color: colors.text,
    textAlign: 'center',
    letterSpacing: 1,
  },
  codeInputError: {
    borderColor: colors.danger,
  },
  errorText: {
    width: '100%',
    fontFamily: fontFamily.regular,
    fontSize: 13,
    color: colors.danger,
    marginTop: 8,
    textAlign: 'center',
  },
  bonusBox: {
    width: '100%',
    marginTop: spacing.lg,
    backgroundColor: '#FFF7ED',
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  bonusText: {
    fontFamily: fontFamily.regular,
    fontSize: 13,
    color: '#B45309',
    lineHeight: 20,
  },
  bonusStrong: {
    fontFamily: fontFamily.bold,
    color: '#EA580C',
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    paddingTop: spacing.sm,
    gap: 12,
  },
  skip: {
    fontFamily: fontFamily.medium,
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
    paddingVertical: 8,
  },
});
