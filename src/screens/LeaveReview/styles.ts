import { Platform, StyleSheet } from 'react-native';
import { colors, fontFamily, radius, spacing } from '../../styles';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  serviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...Platform.select({
      ios: {
        shadowColor: colors.text,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 10,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  serviceIconWrap: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm + 4,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontFamily: fontFamily.bold,
    fontSize: 15,
    color: colors.text,
  },
  serviceDate: {
    fontFamily: fontFamily.regular,
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 2,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...Platform.select({
      ios: {
        shadowColor: colors.text,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  cardTitle: {
    fontFamily: fontFamily.bold,
    fontSize: 15,
    color: colors.text,
    marginBottom: spacing.sm + 4,
  },
  starRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  starButton: {
    padding: 4,
  },
  textarea: {
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.white,
    fontFamily: fontFamily.regular,
    fontSize: 14,
    color: colors.text,
    padding: spacing.sm + 4,
    minHeight: 120,
    textAlignVertical: 'top',
  },
  counter: {
    fontFamily: fontFamily.regular,
    fontSize: 12,
    color: colors.textFaint,
    textAlign: 'right',
    marginTop: spacing.xs,
  },
  errorText: {
    fontFamily: fontFamily.regular,
    fontSize: 13,
    color: colors.danger,
    backgroundColor: colors.errorLight,
    borderRadius: radius.md,
    padding: spacing.sm + 4,
    marginBottom: spacing.md,
  },
  photoRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: spacing.sm,
    paddingTop: spacing.sm,
    paddingRight: spacing.sm,
  },
  photoTile: {
    width: 80,
    height: 80,
  },
  photoImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: colors.muted,
  },
  photoRemove: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.danger,
  },
  photoAdd: {
    width: 80,
    height: 80,
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.border,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoAddLabel: {
    fontFamily: fontFamily.regular,
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 4,
  },
  photoHint: {
    fontFamily: fontFamily.regular,
    fontSize: 14,
    color: colors.textMuted,
    marginTop: spacing.sm,
  },
  submitButton: {
    marginBottom: spacing.sm,
  },
  laterButton: {
    alignItems: 'center',
    paddingVertical: spacing.sm + 4,
  },
  laterLabel: {
    fontFamily: fontFamily.medium,
    fontSize: 14,
    color: colors.textMuted,
  },
});
