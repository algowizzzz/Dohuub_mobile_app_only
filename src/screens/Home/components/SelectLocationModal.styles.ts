import { Platform, StyleSheet } from 'react-native';
import { colors, fontFamily, spacing } from '../../../styles';

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  sheet: {
    width: '100%',
    maxHeight: '80%',
    backgroundColor: 'rgba(254, 254, 254, 0.8)',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.12,
        shadowRadius: 20,
      },
      android: {
        elevation: 16,
      },
    }),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(46, 122, 217, 0.1)',
  },
  title: {
    fontFamily: fontFamily.semiBold,
    fontSize: 18,
    color: colors.text,
  },
  closeButton: {
    padding: 8,
    marginRight: -8,
  },
  list: {
    flexGrow: 0,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  empty: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  emptyTitle: {
    fontFamily: fontFamily.medium,
    fontSize: 16,
    color: colors.text,
    marginTop: spacing.md,
  },
  emptySubtitle: {
    fontFamily: fontFamily.regular,
    fontSize: 14,
    color: colors.textMuted,
    marginTop: spacing.sm,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: spacing.md,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(46, 122, 217, 0.12)',
    backgroundColor: 'rgba(254, 254, 254, 0.8)',
  },
  cardSelected: {
    borderWidth: 2,
    borderColor: colors.primary,
    backgroundColor: 'rgba(227, 240, 255, 0.8)',
  },
  pin: {
    marginTop: 2,
    marginRight: 12,
  },
  info: {
    flex: 1,
    minWidth: 0,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  label: {
    fontFamily: fontFamily.medium,
    fontSize: 16,
    color: colors.text,
    marginRight: 8,
  },
  defaultBadge: {
    backgroundColor: '#E3F0FF',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  defaultBadgeOnSelected: {
    backgroundColor: colors.white,
  },
  defaultBadgeText: {
    fontFamily: fontFamily.medium,
    fontSize: 12,
    color: colors.primary,
  },
  check: {
    marginLeft: 'auto',
  },
  line: {
    fontFamily: fontFamily.regular,
    fontSize: 14,
    lineHeight: 20,
    color: colors.textMuted,
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(46, 122, 217, 0.1)',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    borderRadius: 12,
    ...Platform.select({
      ios: {
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  addButtonLabel: {
    fontFamily: fontFamily.medium,
    fontSize: 16,
    color: colors.white,
  },
  addButtonLabelSpaced: {
    marginLeft: 8,
  },
});
