import { StyleSheet } from 'react-native';
import { colors, fontFamily, radius, spacing } from '../../styles';

// Ported from the PWA's MProfileScreen.module.css — a flat, light
// background with divided row groups (no boxed white cards, no dark
// header/gradient hero).
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl + 72,
  },
  group: {
    flexDirection: 'column',
  },
  pointsPill: {
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 4,
  },
  pointsPillText: {
    fontFamily: fontFamily.bold,
    fontSize: 12,
    color: colors.white,
  },
});
