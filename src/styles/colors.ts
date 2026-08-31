// Ported 1:1 from the PWA's mobile design tokens (--m-*):
// /Users/macbookpro/Documents/dohuub/doohub-pwa/src/mobile/styles/tokens.css
// Keep this a flat object — every `colors.xyz` reference across the app
// depends on the export shape staying flat.
export const colors = {
  // Brand
  primary: '#2E7AD9',
  primaryDark: '#1D4AAD',
  primaryLight: '#4CA6FA',
  gradientStart: '#4CA6FA',
  gradientEnd: '#1D4AAD',
  gradientCtaStart: '#2E7AD9',
  gradientCtaEnd: '#1E6BC9',
  gradientTabbar: ['#4CA6FA', '#1D4ADD'],

  // Legacy/secondary brand accents kept for existing references
  gold: '#F5B914',
  goldDark: '#D9A400',
  secondary: '#FF7A45',

  // Surfaces
  background: '#F0F7FF',
  backgroundAlt: '#E3F0FF',
  surface: '#FFFFFF',
  muted: '#E8F1FC',
  secondarySurface: '#E0EDFF',
  secondarySurfaceFg: '#1D4AAD',
  iconBg: '#E8F1FC',

  // Text
  text: '#1E293B',
  textMuted: '#64748B',
  textSecondary: '#64748B',
  textFaint: '#94A3B8',
  textInverse: '#FFFFFF',
  textAccent: '#1D4AAD',
  textHeading: '#0F172A',

  // Borders
  border: '#E0EDFF',
  borderDark: '#9CA3AF',
  borderAccent: '#4CA6FA',
  divider: 'rgba(46, 122, 217, 0.1)',
  dividerSoft: 'rgba(46, 122, 217, 0.08)',
  dividerFaint: 'rgba(46, 122, 217, 0.05)',

  // Status
  success: '#10B981',
  successLight: '#D1FAE5',
  successDeep: '#166534',
  warning: '#F59E0B',
  warningLight: '#FEF3C7',
  danger: '#EF4444',
  errorLight: '#FEE2E2',
  errorDeep: '#991B1B',
  info: '#3B82F6',
  infoLight: '#DBEAFE',

  // Stars
  star: '#FACC15',
  starAlt: '#F59E0B',
  starEmpty: '#94A3B8',

  // Category accents (match --m-cat-*)
  categoryCleaning: '#2E7AD9',
  categoryCleaningLight: '#DBEAFE',
  categoryHandyman: '#EAB308',
  categoryHandymanLight: '#FEF9C3',
  categoryGroceries: '#F59E0B',
  categoryGroceriesLight: '#FEF3C7',
  categoryGroceryGreen: '#10B981',
  categoryBeauty: '#EC4899',
  categoryBeautyLight: '#FCE7F3',
  categoryRentals: '#14B8A6',
  categoryCaregiving: '#8B5CF6',
  categoryCaregivingLight: '#EDE9FE',
  categoryRides: '#A855F7',

  // Rewards / amber cards
  rewardPurple: 'rgb(147, 51, 234)',
  rewardPurpleDeep: '#7E22CE',
  amberBg: '#FFFBEB',
  amberBgAlt: '#FFF7ED',
  amberBorder: '#FDE68A',
  amberBorderAlt: '#FED7AA',
  amberText: '#92400E',
  amberTextMid: '#B45309',
  amberTextLight: '#D97706',
  streakFlame: '#F97316',

  // Overlays
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 0, 0, 0.4)',
  overlaySlate: 'rgba(15, 23, 42, 0.45)',
  glass: 'rgba(255, 255, 255, 0.95)',

  // Neutrals & existing extras (kept for backward compatibility)
  white: '#FFFFFF',
  black: '#000000',
  purple: '#7C3AED',
  purpleLight: '#EDE9FE',
};
