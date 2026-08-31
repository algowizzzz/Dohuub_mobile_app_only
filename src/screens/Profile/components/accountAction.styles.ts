import { Platform, StyleSheet } from 'react-native';
import { colors, fontFamily, radius, spacing } from '../../../styles';

export const actionStyles = StyleSheet.create({
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
    borderRadius: 20,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.18,
        shadowRadius: 24,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
  },
  headerPrimary: {
    borderBottomColor: colors.divider,
  },
  headerDanger: {
    borderBottomColor: 'rgba(239, 68, 68, 0.2)',
  },
  title: {
    fontFamily: fontFamily.semiBold,
    fontSize: 18,
    color: colors.textHeading,
  },
  closeButton: {
    padding: 4,
    marginRight: -4,
  },
  body: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: spacing.lg,
  },
  iconWrapPrimary: {
    backgroundColor: colors.secondarySurface,
  },
  iconWrapDanger: {
    backgroundColor: colors.errorLight,
  },
  headline: {
    fontFamily: fontFamily.semiBold,
    fontSize: 17,
    color: colors.textHeading,
    textAlign: 'center',
    marginBottom: 12,
  },
  message: {
    fontFamily: fontFamily.regular,
    fontSize: 14,
    color: colors.textMuted,
    lineHeight: 21,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  messageBeforeWarning: {
    marginBottom: spacing.md,
  },
  errorText: {
    fontFamily: fontFamily.regular,
    fontSize: 13,
    color: colors.danger,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(254, 226, 226, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
    gap: 12,
  },
  warningCopy: {
    flex: 1,
  },
  warningTitle: {
    fontFamily: fontFamily.semiBold,
    fontSize: 14,
    color: colors.errorDeep,
    marginBottom: 8,
  },
  warningItem: {
    fontFamily: fontFamily.regular,
    fontSize: 13,
    color: '#B91C1C',
    lineHeight: 20,
  },
  confirmButton: {
    borderRadius: radius.lg,
    overflow: 'hidden',
    marginBottom: 12,
  },
  confirmButtonDisabled: {
    opacity: 0.55,
  },
  confirmButtonFill: {
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
  },
  confirmButtonDanger: {
    backgroundColor: colors.danger,
  },
  confirmLabel: {
    fontFamily: fontFamily.semiBold,
    fontSize: 15,
    color: colors.white,
  },
  cancelButton: {
    minHeight: 48,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelLabel: {
    fontFamily: fontFamily.medium,
    fontSize: 15,
    color: colors.text,
  },
});
