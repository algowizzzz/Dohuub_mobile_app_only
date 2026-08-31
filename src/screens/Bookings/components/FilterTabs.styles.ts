import { StyleSheet } from 'react-native';
import { colors, fontFamily, radius, spacing } from '../../../styles';

export const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 8,
    paddingBottom: spacing.md,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabInactive: {
    backgroundColor: colors.secondarySurface,
  },
  tabLabel: {
    fontFamily: fontFamily.medium,
    fontSize: 13,
    color: colors.text,
  },
  tabLabelActive: {
    fontFamily: fontFamily.semiBold,
    fontSize: 13,
    color: colors.white,
  },
});
