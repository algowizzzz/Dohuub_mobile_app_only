import { StyleSheet } from 'react-native';
import { colors, fontFamily, radius, spacing } from '../../../styles';

export const styles = StyleSheet.create({
  wrap: {
    marginBottom: spacing.lg,
    borderRadius: radius.lg,
    overflow: 'hidden',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },
  map: {
    width: '100%',
    height: 168,
    backgroundColor: colors.muted,
  },
  fallback: {
    height: 168,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.muted,
    gap: spacing.xs,
  },
  fallbackTitle: {
    fontFamily: fontFamily.medium,
    fontSize: 14,
    color: colors.text,
  },
  fallbackMeta: {
    fontFamily: fontFamily.regular,
    fontSize: 12,
    color: colors.textMuted,
  },
  caption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    gap: spacing.sm,
  },
  captionText: {
    flex: 1,
    fontFamily: fontFamily.medium,
    fontSize: 13,
    color: colors.text,
  },
  openLabel: {
    fontFamily: fontFamily.medium,
    fontSize: 12,
    color: colors.primary,
  },
});
