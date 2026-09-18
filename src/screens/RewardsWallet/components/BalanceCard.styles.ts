import { Platform, StyleSheet } from 'react-native';
import { colors, fontFamily, radius, spacing } from '../../../styles';

export const styles = StyleSheet.create({
  card: {
    borderRadius: radius.xl,
    marginBottom: spacing.md,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.28,
        shadowRadius: 16,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  inner: {
    paddingVertical: 24,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    gap: 8,
  },
  label: {
    fontFamily: fontFamily.medium,
    fontSize: 15,
    lineHeight: 20,
    color: 'rgba(255,255,255,0.85)',
    includeFontPadding: false,
  },
  points: {
    fontFamily: fontFamily.bold,
    fontSize: 40,
    lineHeight: 48,
    color: colors.white,
    textAlign: 'center',
    includeFontPadding: false,
  },
  value: {
    fontFamily: fontFamily.regular,
    fontSize: 14,
    lineHeight: 20,
    color: 'rgba(255,255,255,0.75)',
    marginTop: 4,
    textAlign: 'center',
    includeFontPadding: false,
  },
});
