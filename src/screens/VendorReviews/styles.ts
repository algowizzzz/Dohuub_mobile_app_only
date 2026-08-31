import { Platform, StyleSheet } from 'react-native';
import { colors, fontFamily, radius, spacing } from '../../styles';

const cardShadow = Platform.select({
  ios: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
  },
  android: {
    elevation: 2,
  },
});

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  body: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  ratingSummaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...cardShadow,
  },
  ratingSummaryLeft: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 92,
  },
  bigRating: {
    fontFamily: fontFamily.bold,
    fontSize: 36,
    color: colors.text,
    lineHeight: 40,
  },
  starsRow: {
    flexDirection: 'row',
    marginTop: 4,
    gap: 1,
  },
  reviewCountText: {
    fontFamily: fontFamily.regular,
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 4,
  },
  ratingSummaryRight: {
    flex: 1,
    justifyContent: 'center',
    marginLeft: spacing.lg,
  },
  emptyText: {
    fontFamily: fontFamily.regular,
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
    paddingVertical: spacing.lg,
  },
});