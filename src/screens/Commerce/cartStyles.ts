import { Platform, StyleSheet } from 'react-native';
import { colors, fontFamily } from '../../styles';

const shadow = Platform.select({
  ios: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  android: { elevation: 2 },
});

/** Multi-store cart, checkout summary and success state. */
export const cartStyles = StyleSheet.create({
  flex: { flex: 1 },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 32,
  },
  sectionTitle: {
    fontFamily: fontFamily.medium,
    fontSize: 16,
    color: colors.text,
    marginBottom: 10,
    marginTop: 4,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow,
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  link: {
    fontFamily: fontFamily.regular,
    fontSize: 14,
    color: colors.primary,
  },
  linkDanger: {
    fontFamily: fontFamily.regular,
    fontSize: 13,
    color: colors.danger,
  },

  // Delivery address
  addressRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginTop: 10,
  },
  addressText: { flex: 1 },
  addressType: {
    fontFamily: fontFamily.medium,
    fontSize: 14,
    color: colors.text,
    marginBottom: 2,
  },
  addressLine: {
    fontFamily: fontFamily.regular,
    fontSize: 13,
    color: colors.textMuted,
    lineHeight: 18,
  },
  addressChoice: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 8,
  },

  // Store group
  storeHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingBottom: 12,
    marginBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: colors.dividerSoft,
  },
  storeLogo: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.iconBg,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  storeLogoImg: { width: 40, height: 40 },
  storeInfo: { flex: 1, minWidth: 0 },
  storeName: {
    fontFamily: fontFamily.medium,
    fontSize: 15,
    color: colors.text,
  },
  storeMeta: {
    fontFamily: fontFamily.regular,
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  poweredPill: {
    alignSelf: 'flex-start',
    marginTop: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    backgroundColor: colors.warningLight,
  },
  poweredPillText: {
    fontFamily: fontFamily.regular,
    fontSize: 11,
    color: '#B45309',
  },

  // Item row
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
  },
  itemRowDivider: {
    borderTopWidth: 1,
    borderTopColor: colors.dividerFaint,
  },
  itemImage: { width: 56, height: 56, borderRadius: 12 },
  itemImageFallback: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: colors.iconBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemInfo: { flex: 1, minWidth: 0 },
  itemName: {
    fontFamily: fontFamily.medium,
    fontSize: 14,
    color: colors.text,
  },
  itemUnit: {
    fontFamily: fontFamily.regular,
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 2,
  },
  qty: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginTop: 6,
    borderRadius: 10,
    backgroundColor: colors.muted,
    padding: 2,
  },
  qtyBtn: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyNum: {
    minWidth: 26,
    textAlign: 'center',
    fontFamily: fontFamily.medium,
    fontSize: 14,
    color: colors.text,
  },
  itemSide: { alignItems: 'flex-end', gap: 8 },
  itemTotal: {
    fontFamily: fontFamily.medium,
    fontSize: 14,
    color: colors.primary,
  },

  // Totals
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  summaryLabel: {
    fontFamily: fontFamily.regular,
    fontSize: 14,
    color: colors.textMuted,
  },
  summaryValue: {
    fontFamily: fontFamily.regular,
    fontSize: 14,
    color: colors.text,
  },
  summaryDiscount: {
    fontFamily: fontFamily.regular,
    fontSize: 14,
    color: colors.success,
  },
  storeTotals: {
    marginTop: 6,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.dividerSoft,
  },
  totalRow: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.dividerSoft,
  },
  totalLabel: {
    fontFamily: fontFamily.medium,
    fontSize: 16,
    color: colors.text,
  },
  totalValue: {
    fontFamily: fontFamily.medium,
    fontSize: 16,
    color: colors.primary,
  },
  storeSubtotalLabel: {
    fontFamily: fontFamily.medium,
    fontSize: 14,
    color: colors.text,
  },
  storeSubtotalValue: {
    fontFamily: fontFamily.medium,
    fontSize: 14,
    color: colors.text,
  },
  note: {
    fontFamily: fontFamily.regular,
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 8,
  },
  pointsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  pointsText: {
    flex: 1,
    fontFamily: fontFamily.regular,
    fontSize: 14,
    color: colors.text,
  },

  // Empty
  emptyWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emptyIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.iconBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontFamily: fontFamily.medium,
    fontSize: 18,
    color: colors.text,
    textAlign: 'center',
  },
  emptyText: {
    fontFamily: fontFamily.regular,
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 6,
  },

  // Success
  successHero: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  successIcon: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: colors.successLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  successTitle: {
    fontFamily: fontFamily.medium,
    fontSize: 20,
    color: colors.text,
    textAlign: 'center',
  },
  successText: {
    fontFamily: fontFamily.regular,
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 20,
  },
  orderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
  },
  orderRef: {
    fontFamily: fontFamily.regular,
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  buttonGap: { marginTop: 10 },
  emptyCta: { alignSelf: 'stretch', marginTop: 20 },
  continueBtn: { marginTop: 4 },
  payBtn: { marginTop: 8 },
});
