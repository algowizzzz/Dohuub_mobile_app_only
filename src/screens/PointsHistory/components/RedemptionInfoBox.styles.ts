import { StyleSheet } from 'react-native';
import { colors, fontFamily, radius, spacing } from '../../../styles';

export const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.amberBgAlt,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.amberBorderAlt,
    padding: spacing.md,
    marginTop: spacing.sm,
    marginBottom: spacing.xl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: radius.full,
    backgroundColor: colors.amberBorderAlt,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  title: {
    fontFamily: fontFamily.bold,
    fontSize: 14,
    color: colors.amberText,
  },
  subtitle: {
    fontFamily: fontFamily.regular,
    fontSize: 11,
    color: colors.amberTextMid,
  },
  divider: {
    height: 1,
    backgroundColor: colors.amberBorderAlt,
    marginBottom: spacing.sm,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  itemIconWrap: {
    width: 24,
    height: 24,
    borderRadius: radius.full,
    backgroundColor: colors.amberBorderAlt,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  itemText: {
    flex: 1,
    fontFamily: fontFamily.regular,
    fontSize: 12,
    color: colors.amberText,
    lineHeight: 17,
  },
});
