import { StyleSheet } from 'react-native';
import { colors, fontFamily, radius, spacing } from '../../../styles';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    alignItems: 'center',
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    fontFamily: fontFamily.bold,
    fontSize: 22,
    color: colors.text,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: fontFamily.regular,
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.sm - 2,
    marginBottom: spacing.xl,
    maxWidth: 320,
  },
  label: {
    alignSelf: 'flex-start',
    fontFamily: fontFamily.bold,
    fontSize: 13,
    color: colors.textMuted,
    marginBottom: spacing.sm,
  },
  input: {
    width: '100%',
    height: 52,
    borderRadius: radius.md,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    fontFamily: fontFamily.regular,
    fontSize: 15,
    color: colors.text,
    marginBottom: spacing.lg,
  },
  errorText: {
    width: '100%',
    fontFamily: fontFamily.regular,
    fontSize: 13,
    color: colors.danger,
    marginBottom: spacing.sm,
  },
  saveButton: {
    width: '100%',
    marginTop: spacing.sm,
  },
});
