import { Platform, StyleSheet } from 'react-native';
import { colors, fontFamily, spacing } from '../../styles';

// White header, plain chevron (no button box), title left-aligned next to
// the arrow, rounded bottom corners with a subtle shadow floating it above
// the scrollable content below.
export const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: spacing.lg,
    paddingVertical: 8,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(46, 122, 217, 0.08)',
    ...Platform.select({
      ios: {
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 15,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  backButton: {
    paddingRight: spacing.md,
    paddingVertical: spacing.xs,
  },
  title: {
    fontFamily: fontFamily.semiBold,
    fontSize: 16,
    color: colors.text,
  },
});
