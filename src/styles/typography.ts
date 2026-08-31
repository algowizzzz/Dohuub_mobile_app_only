// Inter is bundled and linked natively (src/assets/fonts, iOS UIAppFonts,
// android/app/src/main/assets/fonts) so we keep it as the font family — the
// PWA uses the OS system stack instead, but swapping RN off a working,
// linked font risks broken rendering. Sizes/weights below are tuned to match
// the PWA's mobile scale (EmailSigninScreen.module.css, Input/Button CSS).
export const fontFamily = {
  regular: 'Inter-Regular',
  medium: 'Inter-Medium',
  semiBold: 'Inter-SemiBold',
  bold: 'Inter-Bold',
};

export const typography = {
  // Screen title, e.g. "Sign In" — PWA .title: 24px/700
  h1: { fontFamily: fontFamily.bold, fontSize: 24 },
  h2: { fontFamily: fontFamily.bold, fontSize: 20 },
  h3: { fontFamily: fontFamily.semiBold, fontSize: 18 },
  // PWA .subtitle: 16px/400
  subtitle: { fontFamily: fontFamily.regular, fontSize: 16 },
  body: { fontFamily: fontFamily.regular, fontSize: 15 },
  bodyBold: { fontFamily: fontFamily.semiBold, fontSize: 15 },
  // PWA .hint/.error/.forgot/.link: 13-14px
  caption: { fontFamily: fontFamily.regular, fontSize: 13 },
  // PWA .btn: 16px/600
  button: { fontFamily: fontFamily.semiBold, fontSize: 16 },
};
