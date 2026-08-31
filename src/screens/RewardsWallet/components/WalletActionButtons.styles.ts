import { StyleSheet } from 'react-native';
import { colors, fontFamily, radius, spacing } from '../../../styles';

export const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  referButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
    borderRadius: radius.lg,
    backgroundColor: colors.purpleLight,
    gap: 8,
    paddingHorizontal: spacing.sm,
  },
  referLabel: {
    fontFamily: fontFamily.medium,
    fontSize: 14,
    color: colors.purple,
  },
  historyButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
    borderRadius: radius.lg,
    backgroundColor: colors.secondarySurface,
    gap: 8,
    paddingHorizontal: spacing.sm,
  },
  historyLabel: {
    fontFamily: fontFamily.medium,
    fontSize: 14,
    color: colors.text,
  },
});
