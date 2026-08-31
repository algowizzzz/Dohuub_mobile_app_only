import { Platform, StyleSheet } from 'react-native';
import { colors, fontFamily, radius, spacing } from '../../../styles';

const inputShadow = Platform.select({
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
  screen: {
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
  preview: {
    borderRadius: radius.xl,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    overflow: 'hidden',
    minHeight: 188,
  },
  previewTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 28,
  },
  chip: {
    width: 40,
    height: 28,
    borderRadius: 6,
    backgroundColor: 'rgba(255,255,255,0.85)',
  },
  previewBrand: {
    fontFamily: fontFamily.medium,
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
  },
  previewNumber: {
    fontFamily: fontFamily.medium,
    fontSize: 18,
    color: colors.white,
    letterSpacing: 3,
    marginBottom: 28,
  },
  previewBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  previewExpiryCol: {
    alignItems: 'flex-end',
  },
  previewLabel: {
    fontFamily: fontFamily.regular,
    fontSize: 11,
    color: 'rgba(255,255,255,0.65)',
    marginBottom: 4,
  },
  previewValue: {
    fontFamily: fontFamily.medium,
    fontSize: 14,
    color: colors.white,
  },
  field: {
    marginBottom: spacing.md,
  },
  label: {
    fontFamily: fontFamily.medium,
    fontSize: 14,
    color: colors.text,
    marginBottom: 8,
  },
  asterisk: {
    color: colors.danger,
  },
  input: {
    height: 52,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    paddingHorizontal: spacing.md,
    fontFamily: fontFamily.regular,
    fontSize: 16,
    color: colors.text,
    ...inputShadow,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  rowHalf: {
    flex: 1,
  },
  expiryInputs: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  expiryInput: {
    flex: 1,
  },
  expirySlash: {
    fontFamily: fontFamily.medium,
    fontSize: 18,
    color: colors.textMuted,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkboxLabel: {
    fontFamily: fontFamily.regular,
    fontSize: 14,
    color: colors.text,
    flex: 1,
  },
  errorText: {
    fontFamily: fontFamily.regular,
    fontSize: 13,
    color: colors.danger,
    marginBottom: spacing.md,
  },
  secureBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.lg,
    paddingVertical: 14,
    marginBottom: spacing.md,
    gap: 8,
    overflow: 'hidden',
  },
  secureBarLabel: {
    fontFamily: fontFamily.medium,
    fontSize: 15,
    color: colors.white,
  },
  saveButtonWrap: {
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButton: {
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonLabel: {
    fontFamily: fontFamily.semiBold,
    fontSize: 16,
    color: colors.white,
  },
});
