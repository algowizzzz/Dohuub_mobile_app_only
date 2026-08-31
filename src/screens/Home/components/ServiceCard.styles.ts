import { Platform, StyleSheet } from 'react-native';
import { colors, fontFamily, radius, spacing } from '../../../styles';

export const styles = StyleSheet.create({
  card: {
    width: '48%',
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    marginBottom: spacing.md,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  imageWrap: {
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm + 4,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontFamily: fontFamily.medium,
    fontSize: 14,
    color: colors.text,
    textAlign: 'center',
  },
});
