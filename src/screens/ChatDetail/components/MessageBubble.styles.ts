import { StyleSheet } from 'react-native';
import { colors, fontFamily, radius, spacing } from '../../../styles';

export const styles = StyleSheet.create({
  // PWA .bubble: max-width 82%.
  row: {
    flexDirection: 'row',
    marginBottom: spacing.md,
    maxWidth: '82%',
  },
  rowUser: {
    alignSelf: 'flex-end',
  },
  rowAssistant: {
    alignSelf: 'flex-start',
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: radius.sm,
    backgroundColor: colors.secondarySurface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.xs,
    marginTop: 2,
  },
  column: {
    flexShrink: 1,
  },
  // PWA .bubble: radius 16, padding 10px 14px, flat (no shadow).
  bubble: {
    borderRadius: radius.xl,
    paddingHorizontal: spacing.md - 2,
    paddingVertical: spacing.sm + 2,
  },
  // PWA .bubbleUser: --m-primary bg, border-bottom-right-radius 6.
  bubbleUser: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 6,
  },
  // PWA .bubbleBot: --m-muted bg, text color, border-bottom-left-radius 6.
  bubbleAssistant: {
    backgroundColor: colors.muted,
    borderBottomLeftRadius: 6,
  },
  text: {
    fontFamily: fontFamily.regular,
    fontSize: 14,
    lineHeight: 20,
  },
  textUser: {
    color: colors.white,
  },
  textAssistant: {
    color: colors.text,
  },
  time: {
    fontFamily: fontFamily.regular,
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 4,
  },
  timeUser: {
    textAlign: 'right',
  },
  timeAssistant: {
    textAlign: 'left',
    marginLeft: spacing.xs,
  },
});
