import { StyleSheet } from 'react-native';
import { colors, fontFamily, radius, spacing } from '../../../styles';

export const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    backgroundColor: colors.border,
    borderRadius: radius.full,
    padding: 4,
    marginBottom: spacing.lg,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
  },
  tabActive: {
    backgroundColor: colors.primary,
  },
  tabLabel: {
    fontFamily: fontFamily.semiBold,
    fontSize: 13,
    color: colors.textMuted,
  },
  tabLabelActive: {
    fontFamily: fontFamily.bold,
    color: colors.white,
  },
});
