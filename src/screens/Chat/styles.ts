import { StyleSheet } from 'react-native';
import { colors, fontFamily, spacing } from '../../styles';

export const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xs,
  },
  ctaBlock: {
    width: '100%',
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  hint: {
    fontFamily: fontFamily.medium,
    fontSize: 13,
    color: colors.textFaint,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  orStartTitle: {
    fontFamily: fontFamily.bold,
    fontSize: 14,
    color: colors.text,
    marginBottom: spacing.sm,
  },
});
