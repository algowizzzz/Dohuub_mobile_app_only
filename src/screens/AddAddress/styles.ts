import { StyleSheet } from 'react-native';
import { colors, fontFamily, radius, spacing } from '../../styles';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  label: {
    fontFamily: fontFamily.bold,
    fontSize: 13,
    color: colors.textMuted,
    marginBottom: spacing.sm,
  },
  input: {
    height: 50,
    borderRadius: radius.md,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    fontFamily: fontFamily.regular,
    fontSize: 14,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  textArea: {
    height: 90,
    paddingTop: spacing.sm,
  },
  hint: {
    fontFamily: fontFamily.regular,
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: spacing.lg,
  },
  row: {
    flexDirection: 'row',
  },
  rowItem: {
    flex: 1,
    marginRight: spacing.sm,
  },
  rowItemLast: {
    flex: 1,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 46,
    borderRadius: radius.md,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.borderAccent,
    marginBottom: spacing.md,
  },
  locationButtonDisabled: {
    opacity: 0.7,
  },
  locationButtonLabel: {
    fontFamily: fontFamily.bold,
    fontSize: 14,
    color: colors.primary,
    marginLeft: spacing.sm,
  },
  errorText: {
    fontFamily: fontFamily.regular,
    fontSize: 12,
    color: colors.danger,
    marginBottom: spacing.sm,
  },
  helperText: {
    fontFamily: fontFamily.regular,
    fontSize: 12,
    color: colors.textMuted,
    lineHeight: 17,
    marginBottom: spacing.lg,
  },
  saveButton: {
    marginTop: spacing.sm,
  },
});
