import { StyleSheet } from 'react-native';
import { colors, fontFamily, radius, spacing } from '../../../styles';

export const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
    backgroundColor: '#FFF5EC',
    borderWidth: 1,
    borderColor: '#F3D5B0',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    overflow: 'hidden',
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontFamily: fontFamily.semiBold,
    fontSize: 16,
    color: colors.text,
  },
  subtitle: {
    fontFamily: fontFamily.regular,
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBF7',
    borderRadius: radius.md,
    paddingVertical: 12,
    marginBottom: spacing.md,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: '#E8E0D5',
  },
  statAchieved: {
    fontFamily: fontFamily.bold,
    fontSize: 22,
    color: '#EA580C',
  },
  statRemaining: {
    fontFamily: fontFamily.bold,
    fontSize: 22,
    color: colors.text,
  },
  statEarned: {
    fontFamily: fontFamily.bold,
    fontSize: 22,
    color: '#22C55E',
  },
  statCaption: {
    fontFamily: fontFamily.regular,
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
  statEarnedCaption: {
    fontFamily: fontFamily.regular,
    fontSize: 11,
    color: '#22C55E',
    marginTop: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 10,
  },
  rowTitle: {
    flex: 1,
    fontFamily: fontFamily.medium,
    fontSize: 14,
    color: colors.text,
  },
  dots: {
    flexDirection: 'row',
    gap: 4,
    marginRight: 4,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E8E0D5',
  },
  dotFilled: {
    backgroundColor: '#EA580C',
  },
  empty: {
    fontFamily: fontFamily.regular,
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'center',
    paddingVertical: spacing.sm,
  },
});
