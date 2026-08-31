import { StyleSheet } from 'react-native';
import { colors, fontFamily, radius, spacing } from '../../../styles';

export const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.secondarySurface,
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  cardDanger: {
    backgroundColor: colors.errorLight,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
    gap: 6,
  },
  label: {
    fontFamily: fontFamily.medium,
    fontSize: 13,
    color: colors.textMuted,
  },
  labelDanger: {
    color: colors.danger,
  },
  value: {
    fontFamily: fontFamily.bold,
    fontSize: 22,
    color: colors.text,
  },
  valueDanger: {
    color: colors.danger,
  },
  suffix: {
    fontFamily: fontFamily.regular,
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  suffixDanger: {
    color: colors.danger,
  },
});
