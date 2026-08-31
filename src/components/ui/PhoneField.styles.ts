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
  wrap: {
    width: '100%',
    marginBottom: spacing.lg,
  },
  label: {
    fontFamily: fontFamily.medium,
    fontSize: 14,
    color: colors.text,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  codeButton: {
    height: 52,
    minWidth: 88,
    paddingHorizontal: 12,
    borderRadius: radius.lg,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    ...cardShadow,
  },
  codeLabel: {
    fontFamily: fontFamily.medium,
    fontSize: 15,
    color: colors.text,
  },
  input: {
    flex: 1,
    height: 52,
    borderRadius: radius.lg,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    fontFamily: fontFamily.regular,
    fontSize: 15,
    color: colors.text,
    ...cardShadow,
  },
  error: {
    fontFamily: fontFamily.regular,
    fontSize: 13,
    color: colors.danger,
    marginTop: 6,
  },
  overlay: {
    flex: 1,
    backgroundColor: colors.overlayLight,
    justifyContent: 'flex-end',
  },
  sheet: {
    maxHeight: '70%',
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
  },
  sheetTitle: {
    fontFamily: fontFamily.semiBold,
    fontSize: 16,
    color: colors.text,
    marginBottom: spacing.md,
  },
  sheetList: {
    maxHeight: 420,
  },
  sheetOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  sheetOptionActive: {
    backgroundColor: colors.background,
    marginHorizontal: -spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  sheetOptionLabel: {
    fontFamily: fontFamily.regular,
    fontSize: 15,
    color: colors.text,
  },
});
