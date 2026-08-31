import { Platform, StyleSheet } from 'react-native';
import { colors, fontFamily, radius, spacing } from '../../../styles';

export const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(46, 122, 217, 0.08)',
    ...Platform.select({
      ios: {
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: colors.secondarySurface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  body: {
    flex: 1,
    minWidth: 0,
    marginRight: spacing.sm,
  },
  serviceName: {
    fontFamily: fontFamily.semiBold,
    fontSize: 16,
    color: colors.textHeading,
    marginBottom: 4,
  },
  metaText: {
    fontFamily: fontFamily.regular,
    fontSize: 13,
    color: colors.textMuted,
    marginBottom: 2,
  },
  statusPill: {
    alignSelf: 'flex-start',
    borderRadius: radius.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginTop: 8,
  },
  statusLabel: {
    fontFamily: fontFamily.medium,
    fontSize: 12,
  },
});
