import { StyleSheet } from 'react-native';
import { colors, fontFamily, radius, spacing } from '../../../styles';

export const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginBottom: spacing.lg,
  },
  option: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 72,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.white,
    marginRight: spacing.sm,
  },
  optionActive: {
    borderColor: colors.primary,
    backgroundColor: '#EAF1FE',
  },
  optionLabel: {
    fontFamily: fontFamily.semiBold,
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 6,
  },
  optionLabelActive: {
    color: colors.primary,
    fontFamily: fontFamily.bold,
  },
});
