import { StyleSheet } from 'react-native';
import { colors, fontFamily, spacing } from '../../../../styles';

// PWA .switchLine: 15px, centered, margin-top 24; .switchLink: 15px/600
export const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    paddingBottom: spacing.lg,
    paddingTop: spacing.lg,
  },
  row: {
    flexDirection: 'row',
  },
  muted: {
    fontFamily: fontFamily.regular,
    fontSize: 14,
    color: colors.textMuted,
  },
  link: {
    fontFamily: fontFamily.semiBold,
    fontSize: 14,
    color: colors.primary,
  },
});
