import { StyleSheet } from 'react-native';
import { colors, fontFamily, radius, spacing } from '../../../styles';

export const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginHorizontal: -4,
    marginBottom: spacing.lg,
  },
  card: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    marginHorizontal: 4,
  },
  value: {
    fontFamily: fontFamily.bold,
    fontSize: 18,
  },
  label: {
    fontFamily: fontFamily.regular,
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
});
