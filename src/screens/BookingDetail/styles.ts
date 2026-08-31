import { Platform, StyleSheet } from 'react-native';
import { colors, fontFamily, radius, spacing } from '../../styles';

const cardShadow = Platform.select({
  ios: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
  },
  android: {
    elevation: 2,
  },
});

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  body: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  serviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: spacing.md,
    marginBottom: spacing.sm,
    ...cardShadow,
  },
  serviceIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    overflow: 'hidden',
  },
  serviceInfo: {
    flex: 1,
    minWidth: 0,
    marginRight: 8,
  },
  serviceName: {
    fontFamily: fontFamily.semiBold,
    fontSize: 16,
    color: colors.textHeading,
  },
  serviceVendor: {
    fontFamily: fontFamily.regular,
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 2,
  },
  pointsPill: {
    alignSelf: 'flex-start',
    backgroundColor: colors.streakFlame,
    borderRadius: radius.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginTop: 8,
  },
  pointsPillText: {
    fontFamily: fontFamily.semiBold,
    fontSize: 12,
    color: colors.white,
  },
  orderRef: {
    fontFamily: fontFamily.regular,
    fontSize: 13,
    color: colors.textMuted,
    marginBottom: spacing.lg,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...cardShadow,
  },
  cardTitle: {
    fontFamily: fontFamily.semiBold,
    fontSize: 16,
    color: colors.textHeading,
    marginBottom: spacing.md,
  },
  cancelledBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.errorLight,
    borderRadius: radius.lg,
    paddingVertical: spacing.sm + 4,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  cancelledBannerText: {
    flex: 1,
    fontFamily: fontFamily.medium,
    fontSize: 13,
    color: colors.danger,
    marginLeft: spacing.sm,
  },
  paymentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  paymentLabel: {
    fontFamily: fontFamily.regular,
    fontSize: 13,
    color: colors.textMuted,
  },
  paymentValue: {
    fontFamily: fontFamily.semiBold,
    fontSize: 14,
    color: colors.text,
  },
  paymentDiscount: {
    fontFamily: fontFamily.semiBold,
    fontSize: 14,
    color: colors.success,
  },
  paymentDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.sm,
  },
  totalLabel: {
    fontFamily: fontFamily.semiBold,
    fontSize: 15,
    color: colors.text,
  },
  totalValue: {
    fontFamily: fontFamily.bold,
    fontSize: 18,
    color: colors.text,
  },
  leaveReviewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 52,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderColor: colors.primary,
    marginBottom: spacing.sm,
  },
  leaveReviewLabel: {
    fontFamily: fontFamily.semiBold,
    fontSize: 15,
    color: colors.primary,
  },
  payButton: {
    marginBottom: spacing.sm,
  },
  cancelButton: {
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  cancelButtonLabel: {
    fontFamily: fontFamily.semiBold,
    fontSize: 14,
    color: colors.danger,
  },
  bookAgainButton: {
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  bookAgainLabel: {
    fontFamily: fontFamily.semiBold,
    fontSize: 15,
    color: colors.text,
  },
});
