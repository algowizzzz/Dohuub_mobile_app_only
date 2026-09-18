import { Platform, StyleSheet } from 'react-native';
import { colors, fontFamily, radius, spacing } from '../../../styles';

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  body: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  preview: {
    borderRadius: radius.xl,
    marginBottom: spacing.lg,
    overflow: 'hidden',
    minHeight: 188,
    backgroundColor: colors.primary,
  },
  previewFill: {
    ...StyleSheet.absoluteFillObject,
  },
  previewContent: {
    padding: spacing.lg,
    minHeight: 188,
    justifyContent: 'space-between',
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
  label: {
    fontFamily: fontFamily.medium,
    fontSize: 14,
    color: colors.text,
    marginBottom: 8,
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
    marginBottom: spacing.md,
  },
  cardFieldWrap: {
    width: '100%',
    alignSelf: 'stretch',
    overflow: 'visible',
  },
  cardField: {
    width: '100%',
    height: Platform.OS === 'android' ? 56 : 52,
  },
  helper: {
    fontFamily: fontFamily.regular,
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 8,
    marginBottom: spacing.md,
    lineHeight: 16,
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
  },
  secureBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.lg,
    minHeight: 48,
    paddingVertical: 14,
    marginBottom: spacing.md,
    gap: 8,
    backgroundColor: colors.primary,
  },
  secureBarLabel: {
    fontFamily: fontFamily.medium,
    fontSize: 15,
    color: colors.white,
  },
});
