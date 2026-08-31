import { StyleSheet } from 'react-native';
import { colors, fontFamily, radius, spacing } from '../../../styles';

export const styles = StyleSheet.create({
  wrap: {
    marginTop: spacing.md,
  },
  title: {
    fontFamily: fontFamily.bold,
    fontSize: 15,
    color: colors.text,
    marginBottom: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.dividerSoft,
    paddingTop: spacing.md,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  emptyText: {
    fontFamily: fontFamily.regular,
    fontSize: 13,
    color: colors.textMuted,
    marginTop: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.muted,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  rowIconWrap: {
    width: 36,
    height: 36,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  rowTextCol: {
    flex: 1,
    marginRight: spacing.sm,
  },
  rowTitle: {
    fontFamily: fontFamily.bold,
    fontSize: 13,
    color: colors.text,
  },
  rowSubtitle: {
    fontFamily: fontFamily.regular,
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 1,
  },
  rowDate: {
    fontFamily: fontFamily.regular,
    fontSize: 11,
    color: colors.textMuted,
  },
});
