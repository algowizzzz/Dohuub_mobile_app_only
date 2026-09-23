import { StyleSheet } from 'react-native';
import { colors, radius, spacing } from '../../styles';

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  fill: {
    flex: 1,
  },
  // ---- list ----
  listContent: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
    gap: spacing.md,
  },
  count: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    overflow: 'hidden',
    shadowColor: '#0B2545',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  imageWrap: {
    position: 'relative',
    height: 200,
    backgroundColor: colors.muted,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageEmpty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  poweredBadge: {
    position: 'absolute',
    top: spacing.sm + 2,
    right: spacing.sm + 2,
    backgroundColor: colors.primary,
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.full,
    overflow: 'hidden',
  },
  cardBody: {
    padding: spacing.md,
    gap: 6,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  name: {
    flex: 1,
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingValue: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  reviews: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  location: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginTop: 2,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  metaText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  price: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.success ?? '#14B8A6',
  },
  priceUnit: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
  },

  // ---- detail ----
  hero: {
    height: 260,
    backgroundColor: colors.muted,
  },
  detailBody: {
    padding: spacing.md,
    gap: spacing.md,
    paddingBottom: spacing.xxl,
  },
  detailTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
    flex: 1,
  },
  pointsBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    backgroundColor: '#FDF3E3',
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  pointsTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#B45309',
  },
  pointsBody: {
    fontSize: 13,
    color: '#B45309',
    marginTop: 2,
  },
  hostCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm + 4,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  hostAvatar: {
    width: 44,
    height: 44,
    borderRadius: radius.full,
    backgroundColor: colors.iconBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hostName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  hostLine: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 1,
  },
  statGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm + 4,
  },
  statCell: {
    flexBasis: '47%',
    flexGrow: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm + 2,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
  },
  statLabel: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  card2: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: spacing.sm,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  about: {
    fontSize: 14,
    lineHeight: 21,
    color: colors.textSecondary,
  },
  amenityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  amenity: {
    flexBasis: '50%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingVertical: 5,
  },
  amenityText: {
    flex: 1,
    fontSize: 14,
    color: colors.textSecondary,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  priceValue: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.success ?? '#14B8A6',
  },
  empty: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
    gap: 4,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginTop: spacing.sm,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: spacing.lg,
  },
  footer: {
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});
