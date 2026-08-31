import { StyleSheet } from 'react-native';
import { colors, fontFamily, radius, spacing } from '../../../styles';

export const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  // PWA MConversationScreen .prompt: bordered rgba(primary,0.16), --m-bg fill,
  // radius 14, no shadow (flat, like the suggested-prompt list style).
  chip: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: 'rgba(46, 122, 217, 0.16)',
    borderRadius: radius.xl - 2,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  chipLabel: {
    fontFamily: fontFamily.medium,
    fontSize: 14,
    color: colors.text,
  },
});
