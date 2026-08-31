import { Platform, StyleSheet } from 'react-native';
import { colors, fontFamily, radius, spacing } from '../../../styles';

export const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...Platform.select({
      ios: {
        shadowColor: colors.text,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  title: {
    fontFamily: fontFamily.bold,
    fontSize: 16,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  starsRow: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  comment: {
    fontFamily: fontFamily.regular,
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
});
