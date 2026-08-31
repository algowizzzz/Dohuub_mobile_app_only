import { StyleSheet } from 'react-native';
import { colors, radius, spacing } from '../../../styles';

export const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: radius.sm,
    backgroundColor: colors.secondarySurface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.xs,
  },
  // PWA .typing: same bubbleBot treatment (--m-muted, radius 16/6, flat), padding 14px.
  bubble: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.muted,
    borderRadius: radius.xl,
    borderBottomLeftRadius: 6,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md - 2,
  },
  // PWA .typing span: 7x7, --m-text-faint.
  dot: {
    width: 7,
    height: 7,
    borderRadius: radius.full,
    backgroundColor: colors.textFaint,
    marginHorizontal: 3,
  },
});
