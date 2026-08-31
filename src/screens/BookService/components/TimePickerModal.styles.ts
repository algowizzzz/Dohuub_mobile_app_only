import { StyleSheet } from 'react-native';
import { colors, fontFamily, radius, spacing } from '../../../styles';

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'flex-end',
  },
  sheet: {
    width: '100%',
    backgroundColor: colors.white,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
  title: {
    fontFamily: fontFamily.bold,
    fontSize: 17,
    color: colors.text,
    marginBottom: spacing.md,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  slot: {
    width: '48%',
    alignItems: 'center',
    justifyContent: 'center',
    height: 46,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    margin: 4,
  },
  slotSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  slotLabel: {
    fontFamily: fontFamily.semiBold,
    fontSize: 13,
    color: colors.text,
  },
  slotLabelSelected: {
    color: colors.white,
    fontFamily: fontFamily.bold,
  },
  loading: {
    paddingVertical: spacing.lg,
  },
  emptyText: {
    fontFamily: fontFamily.regular,
    fontSize: 13,
    color: colors.textMuted,
    paddingVertical: spacing.lg,
  },
});
