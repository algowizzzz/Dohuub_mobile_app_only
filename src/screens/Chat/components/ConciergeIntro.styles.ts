import { Platform, StyleSheet } from 'react-native';
import { colors, fontFamily, radius, spacing } from '../../../styles';

export const styles = StyleSheet.create({
  // PWA .center: no card chrome, just centered content on the screen bg.
  card: {
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    marginBottom: spacing.lg,
  },
  cardCompact: {
    marginBottom: spacing.md,
  },
  // PWA .avatarRing: 118x118, radius 36, gradient bg, floats, soft primary shadow.
  avatarRing: {
    width: 118,
    height: 118,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
    ...Platform.select({
      ios: {
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.25,
        shadowRadius: 20,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  avatarRingCompact: {
    width: 72,
    height: 72,
    borderRadius: 22,
    marginBottom: spacing.sm,
  },
  // PWA .avatarInner: 104x104, radius 30, white.
  avatarInner: {
    width: 104,
    height: 104,
    borderRadius: 30,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInnerCompact: {
    width: 60,
    height: 60,
    borderRadius: 18,
  },
  // PWA .headline: 34px/800, textHeading, letterSpacing -0.8, line-height 40.
  title: {
    fontFamily: fontFamily.bold,
    fontSize: Platform.OS === 'ios' ? 30 : 34,
    color: colors.textHeading,
    textAlign: 'center',
    lineHeight: Platform.OS === 'ios' ? 36 : 40,
    letterSpacing: -0.8,
    marginBottom: spacing.md,
  },
  titleCompact: {
    fontSize: 22,
    lineHeight: 28,
    marginBottom: 0,
  },
  // PWA .support: 15px/22, textSecondary, max-width 300.
  description: {
    fontFamily: fontFamily.regular,
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 300,
    marginBottom: spacing.lg,
  },
  pillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  // PWA .pill: white bg, 1px border rgba(primary, 0.14), radius full, 8px/12px pad.
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: 'rgba(46, 122, 217, 0.14)',
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm + 4,
    paddingVertical: spacing.sm,
    marginHorizontal: 4,
    marginBottom: spacing.xs,
  },
  pillLabel: {
    fontFamily: fontFamily.semiBold,
    fontSize: 12,
    color: colors.primaryDark,
    marginLeft: 6,
  },
});
