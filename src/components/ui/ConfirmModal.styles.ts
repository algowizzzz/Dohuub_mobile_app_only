import { StyleSheet } from 'react-native';
import { colors, fontFamily, radius, spacing } from '../../styles';

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  sheet: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
  title: {
    fontFamily: fontFamily.bold,
    fontSize: 18,
    color: colors.text,
  },
  body: {
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  iconWrapWarning: {
    backgroundColor: '#FFE8D6',
  },
  iconWrapDanger: {
    backgroundColor: '#FEE2E2',
  },
  iconWrapPrimary: {
    backgroundColor: '#E0EDFB',
  },
  message: {
    fontFamily: fontFamily.regular,
    fontSize: 14,
    color: colors.textMuted,
    lineHeight: 20,
    textAlign: 'center',
  },
  errorText: {
    fontFamily: fontFamily.regular,
    fontSize: 13,
    color: colors.danger,
    lineHeight: 18,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  actions: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    gap: spacing.sm,
  },
  cancelButton: {
    flex: 1,
    height: 50,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelLabel: {
    fontFamily: fontFamily.semiBold,
    fontSize: 14,
    color: colors.text,
  },
  confirmButton: {
    flex: 1,
    height: 50,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmButtonWarning: {
    backgroundColor: colors.secondary,
  },
  confirmButtonDanger: {
    backgroundColor: colors.danger,
  },
  confirmButtonPrimary: {
    backgroundColor: colors.primary,
  },
  confirmLabel: {
    fontFamily: fontFamily.semiBold,
    fontSize: 14,
    color: colors.white,
  },
});
