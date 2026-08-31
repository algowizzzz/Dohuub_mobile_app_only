import { StyleSheet } from 'react-native';
import { colors, fontFamily, radius, spacing } from '../../../styles';

// Blue "Create Your Account" landing screen — matches WelcomeScreen's
// full-primary-background pattern with a bigger logo and a terms/privacy
// footer (ported from the PWA's mobile BlueAuth.module.css + WelcomeScreen.jsx).
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    marginLeft: spacing.lg,
    marginTop: spacing.sm,
    paddingVertical: spacing.sm,
    paddingRight: spacing.md,
  },
  backLabel: {
    fontFamily: fontFamily.regular,
    fontSize: 16,
    color: colors.white,
  },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  logo: {
    width: 260,
    height: 260,
    marginBottom: -spacing.md,
  },
  tagline: {
    fontFamily: fontFamily.semiBold,
    fontSize: 18,
    color: colors.white,
    marginBottom: spacing.lg + 4,
  },
  actions: {
    width: '100%',
    maxWidth: 320,
    gap: spacing.md,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    minHeight: 52,
    borderRadius: radius.lg,
    backgroundColor: colors.white,
  },
  googleButtonDisabled: {
    opacity: 0.7,
  },
  googleLabel: {
    fontFamily: fontFamily.semiBold,
    fontSize: 16,
    color: colors.text,
  },
  emailButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    minHeight: 52,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.7)',
  },
  emailLabel: {
    fontFamily: fontFamily.semiBold,
    fontSize: 16,
    color: colors.white,
  },
  errorText: {
    fontFamily: fontFamily.regular,
    fontSize: 14,
    color: colors.white,
    textAlign: 'center',
    marginTop: spacing.md,
    backgroundColor: 'rgba(239, 68, 68, 0.35)',
    borderRadius: radius.md + 2,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md - 2,
    maxWidth: 320,
    alignSelf: 'center',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.xl,
  },
  switchText: {
    fontFamily: fontFamily.regular,
    fontSize: 15,
    color: 'rgba(255,255,255,0.85)',
  },
  switchLink: {
    fontFamily: fontFamily.semiBold,
    fontSize: 15,
    color: colors.white,
    textDecorationLine: 'underline',
  },
  footer: {
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  footerText: {
    fontFamily: fontFamily.regular,
    fontSize: 13,
    color: 'rgba(255,255,255,0.75)',
    textAlign: 'center',
  },
  footerLinkRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  footerLink: {
    fontFamily: fontFamily.regular,
    fontSize: 13,
    color: '#FFFFFF',
    textDecorationLine: 'underline',
  },
});
