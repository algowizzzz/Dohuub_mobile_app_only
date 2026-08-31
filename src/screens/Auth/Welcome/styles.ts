import { StyleSheet } from 'react-native';
import { colors, fontFamily, radius, spacing } from '../../../styles';

// Ported from the PWA's BlueAuth.module.css (shared by Welcome/Signin) —
// full var(--m-primary) background, centered 280px logo, tagline, stacked
// white/outline buttons max-width 320, underlined switch line, terms footer.
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
  // PWA .logo: 280x280, contain
  logo: {
    width: 260,
    height: 260,
    marginBottom: spacing.sm,
  },
  wordmark: {
    fontFamily: fontFamily.bold,
    fontSize: 30,
    letterSpacing: 1,
    color: colors.white,
    marginTop: spacing.md,
  },
  // PWA .tagline: 18px, rgba(255,255,255,.85), margin-bottom 28
  tagline: {
    fontFamily: fontFamily.regular,
    fontSize: 18,
    color: 'rgba(255,255,255,0.85)',
    marginBottom: spacing.lg + 4,
  },
  // PWA .buttons: max-width 320, gap 16
  actions: {
    width: '100%',
    maxWidth: 320,
    gap: spacing.md,
  },
  // PWA .btnWhite: min-height 52, radius 12, solid white, 16px/600 #374151
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
  // PWA .btnOutline: min-height 52, radius 12, 1.5px rgba(255,255,255,.7) border
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
  // PWA .error: rgba(239,68,68,.35) bg, white text, radius 10
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
  // PWA .switchLine: 15px, rgba(255,255,255,.85), margin-top 24
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingBottom: spacing.xl,
  },
  footerText: {
    fontFamily: fontFamily.regular,
    fontSize: 15,
    color: 'rgba(255,255,255,0.85)',
  },
  footerLink: {
    fontFamily: fontFamily.semiBold,
    fontSize: 15,
    color: colors.white,
    textDecorationLine: 'underline',
  },
});
