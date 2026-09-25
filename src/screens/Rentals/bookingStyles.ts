import { Platform, StyleSheet } from 'react-native';
import { colors, fontFamily } from '../../styles';

// Values below are the prototype's Tailwind classes, 1:1
// (PropertyCalendarScreen / PropertyStayDetailsScreen / PropertyBookingScreen).
// Its compiled CSS has no font-weight utilities, so headings are Inter Medium
// and everything else Inter Regular — nothing here is bold on purpose.
export const TEAL = '#14B8A6';
export const TEAL_END = '#0694A2';
export const TEAL_TEXT = '#0D9488';
export const TEAL_GRADIENT = [TEAL, TEAL_END];
export const TEAL_TINT = ['rgba(20, 184, 166, 0.1)', 'rgba(6, 148, 162, 0.1)'];
export const GREEN_TINT = ['rgba(34, 197, 94, 0.1)', 'rgba(16, 185, 129, 0.1)'];
export const GREEN_GRADIENT = ['#22C55E', '#10B981'];
export const AMBER_TINT = ['rgba(245, 158, 11, 0.1)', 'rgba(249, 115, 22, 0.1)'];
export const BORDER = 'rgba(45, 122, 217, 0.15)';
export const MUTED = '#E8F1FC';
export const FG = colors.text;
export const MUTED_FG = colors.textSecondary;

const TEAL_BORDER = 'rgba(20, 184, 166, 0.3)';

// .shadow-card: 0 2px 8px rgba(46, 122, 217, 0.08)
const cardShadow = Platform.select({
  ios: {
    shadowColor: '#2E7AD9',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  android: { elevation: 1 },
});

const text = { fontFamily: fontFamily.regular, fontSize: 16, lineHeight: 24, color: FG };
const textSm = { fontFamily: fontFamily.regular, fontSize: 14, lineHeight: 20, color: MUTED_FG };
const heading = { fontFamily: fontFamily.medium, fontSize: 16, lineHeight: 24, color: FG };

export const styles = StyleSheet.create({
  flex: { flex: 1 },

  // px-6 py-6, space-y-6
  scrollContent: {
    paddingHorizontal: 24,
    paddingVertical: 24,
    gap: 24,
  },

  // p-4 rounded-xl shadow-card, bg card, 1px border
  card: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: BORDER,
    ...cardShadow,
  },
  // Gradient-tinted boxes: the gradient is an absolute-fill child, never the box itself.
  tintBox: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: TEAL_BORDER,
    overflow: 'hidden',
  },
  solidTealBox: {
    padding: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },

  heading,
  headingLg: { ...heading, fontSize: 18, lineHeight: 28 },
  mb1: { marginBottom: 4 },
  mb2: { marginBottom: 8 },
  mb3: { marginBottom: 12 },
  mb4: { marginBottom: 16 },
  text,
  textMuted: { ...text, color: MUTED_FG },
  textSm,
  textTeal: { ...text, color: TEAL },
  mutedColor: { color: MUTED_FG },
  row: { flexDirection: 'row', alignItems: 'center' },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  rowBetweenBaseline: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  gap2: { gap: 8 },
  gap3: { gap: 12 },

  // ---- Select Dates ----
  dateCards: { flexDirection: 'row', gap: 12 },
  dateCard: { flex: 1 },
  durationLabel: { ...textSm, color: 'rgba(255, 255, 255, 0.7)', marginBottom: 4 },
  durationValue: { ...text, fontSize: 20, lineHeight: 28, color: colors.white },

  monthNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  monthButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: MUTED,
  },
  calendarRow: { flexDirection: 'row', gap: 4 },
  calendarRows: { gap: 4 },
  weekdayRow: { flexDirection: 'row', gap: 4, marginBottom: 8 },
  weekday: {
    flex: 1,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  weekdayText: { ...textSm },
  day: {
    flex: 1,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'transparent',
    overflow: 'hidden',
  },
  dayPicked: { borderWidth: 0 },
  dayInRange: { backgroundColor: 'rgba(20, 184, 166, 0.2)' },
  dayDisabled: { backgroundColor: MUTED, opacity: 0.5 },
  dayToday: { borderColor: TEAL },
  dayText: { ...textSm, color: FG },
  dayTextPicked: { color: colors.white },
  dayTextDisabled: { color: MUTED_FG },

  legendRows: { gap: 8 },
  legendRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  legendSwatch: { width: 24, height: 24, borderRadius: 4, overflow: 'hidden' },
  legendRange: { backgroundColor: 'rgba(20, 184, 166, 0.2)' },
  legendUnavailable: { backgroundColor: MUTED, opacity: 0.5 },
  legendToday: { borderWidth: 2, borderColor: TEAL },
  infoText: { ...textSm, color: TEAL_TEXT },

  // ---- pinned bottom bar (px-6 py-4 glass, border-top) ----
  footer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(46, 122, 217, 0.1)',
  },
  cta: {
    minHeight: 56,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  ctaDisabled: { opacity: 0.5 },
  ctaText: { ...text, color: colors.white },

  // ---- property summary ----
  summaryRow: { flexDirection: 'row', gap: 12 },
  summaryImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: MUTED,
  },
  summaryImageEmpty: { alignItems: 'center', justifyContent: 'center' },
  summaryInfo: { flex: 1, minWidth: 0 },
  summaryDuration: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  summaryDurationText: { ...textSm, color: TEAL_TEXT },
  poweredPill: {
    alignSelf: 'flex-start',
    marginTop: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 9999,
    overflow: 'hidden',
  },
  poweredPillText: {
    fontFamily: fontFamily.regular,
    fontSize: 12,
    lineHeight: 16,
    color: colors.white,
  },
  summaryMeta: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: TEAL_BORDER,
    gap: 8,
  },
  summaryMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  summaryMetaText: { ...textSm, flex: 1 },

  // ---- Stay Details ----
  divider: { paddingTop: 8, borderTopWidth: 1, borderTopColor: BORDER },
  tealDivider: { paddingTop: 12, borderTopWidth: 1, borderTopColor: TEAL_BORDER },
  tealDividerSm: { paddingTop: 8, borderTopWidth: 1, borderTopColor: TEAL_BORDER },
  guestRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stepper: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  stepButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  stepMinus: { backgroundColor: MUTED },
  stepDisabled: { opacity: 0.3 },
  stepCount: { ...text, width: 32, textAlign: 'center' },
  guestNote: { ...textSm, marginTop: 12 },
  textArea: {
    ...text,
    minHeight: 122,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    borderRadius: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: BORDER,
  },
  totalValueXl: { ...text, fontSize: 20, lineHeight: 28, color: TEAL },
  totalValue2xl: { ...text, fontSize: 24, lineHeight: 32, color: TEAL },

  // ---- Confirm Booking ----
  sectionHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  linkText: { ...textSm, color: TEAL },
  dashedButton: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: BORDER,
    backgroundColor: colors.surface,
    alignItems: 'center',
  },
  addressChoices: { marginTop: 12, gap: 8 },
  addressChoice: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: colors.surface,
  },
  addressChoiceActive: { borderWidth: 2, borderColor: TEAL, padding: 11 },
  paymentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cardIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },

  pointsBox: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.3)',
    overflow: 'hidden',
  },
  pointsHeader: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pointsIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  pointsTitle: { ...text, color: '#166534' },
  pointsSub: { ...textSm, color: '#22C55E' },
  toggle: {
    width: 48,
    height: 24,
    borderRadius: 12,
    backgroundColor: MUTED,
    overflow: 'hidden',
  },
  toggleKnob: {
    position: 'absolute',
    top: 2,
    left: 2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.white,
    ...Platform.select({
      ios: {
        shadowColor: colors.black,
        shadowOpacity: 0.1,
        shadowRadius: 2,
        shadowOffset: { width: 0, height: 1 },
      },
      android: { elevation: 2 },
    }),
  },
  toggleKnobOn: { transform: [{ translateX: 24 }] },
  pointsBody: { paddingHorizontal: 16, paddingBottom: 16 },
  pointsSummary: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    gap: 4,
  },
  pointsUsingLabel: { ...textSm, color: '#15803D' },
  pointsUsingValue: { ...text, color: '#166534' },
  pointsUsingDiscount: { ...text, color: '#22C55E', marginLeft: 8 },
  pointsRemaining: { ...textSm, color: '#22C55E' },
  discountText: { ...text, color: '#22C55E' },

  earnBox: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
    overflow: 'hidden',
  },
  earnTitle: { ...text, color: '#B45309' },
  earnValue: { ...text, fontSize: 18, lineHeight: 28, color: '#F59E0B' },
  earnSub: { ...textSm, color: '#D97706', marginTop: 4 },

  // ---- card picker sheet ----
  sheetOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    maxHeight: '70%',
    backgroundColor: colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
  sheetHeader: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  sheetClose: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: colors.surface,
  },
  sheetList: { paddingHorizontal: 24, paddingTop: 24, gap: 12 },
  sheetCard: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: BORDER,
    ...cardShadow,
  },
  sheetCardActive: {
    padding: 15,
    borderWidth: 2,
    borderColor: TEAL,
    backgroundColor: 'rgba(20, 184, 166, 0.1)',
  },
});
