import { StyleSheet } from 'react-native';
import { colors, fontFamily, radius, spacing } from '../../styles';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  body: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderColor: colors.primaryLight,
    borderStyle: 'dashed',
    backgroundColor: 'rgba(46, 122, 217, 0.04)',
    gap: 8,
    marginBottom: spacing.md,
  },
  addButtonLabel: {
    fontFamily: fontFamily.medium,
    fontSize: 15,
    color: colors.primary,
  },
  secureBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.secondarySurface,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    gap: 8,
  },
  secureBadgeLabel: {
    fontFamily: fontFamily.medium,
    fontSize: 14,
    color: colors.primary,
  },
});