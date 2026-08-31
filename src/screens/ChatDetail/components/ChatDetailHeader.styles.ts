import { Platform, StyleSheet } from 'react-native';
import { colors, fontFamily, radius, spacing } from '../../../styles';

export const styles = StyleSheet.create({
  // PWA .header: --m-glass bg, gap 12, padding 12/16, bottom border rgba(primary,0.08).
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.glass,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(46, 122, 217, 0.08)',
  },
  // PWA .backSquare: 40x40, radius 12, white bg, soft shadow.
  backButton: {
    width: 40,
    height: 40,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md - 4,
    ...Platform.select({
      ios: {
        shadowColor: colors.text,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  // PWA .avatar: 40x40, radius 14, --m-secondary bg.
  avatar: {
    width: 40,
    height: 40,
    borderRadius: radius.xl - 2,
    backgroundColor: colors.secondarySurface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md - 4,
  },
  name: {
    fontFamily: fontFamily.bold,
    fontSize: 17,
    color: colors.text,
  },
  // PWA .subtitle: 13px, textFaint (not accent-colored).
  tagline: {
    fontFamily: fontFamily.regular,
    fontSize: 13,
    color: colors.textFaint,
  },
});
