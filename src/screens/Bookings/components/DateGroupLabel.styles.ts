import { StyleSheet } from 'react-native';
import { colors, fontFamily, spacing } from '../../../styles';

export const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: spacing.sm,
    marginTop: spacing.sm,
    gap: 6,
  },
  label: {
    fontFamily: fontFamily.bold,
    fontSize: 12,
    color: colors.textAccent,
    letterSpacing: 0.6,
  },
  count: {
    fontFamily: fontFamily.semiBold,
    fontSize: 12,
    color: colors.primaryLight,
  },
});
