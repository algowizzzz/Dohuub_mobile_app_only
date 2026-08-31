import { StyleSheet } from 'react-native';
import { colors, fontFamily, radius, spacing } from '../../../styles';

// Ported from the PWA's MProfileScreen.module.css .profileRow / .name /
// .email / .editLink — flat row, 80px avatar, no card background/shadow.
export const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: radius.full,
    backgroundColor: colors.iconBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm + 2,
  },
  info: {
    flex: 1,
  },
  name: {
    fontFamily: fontFamily.semiBold,
    fontSize: 16,
    color: colors.text,
  },
  email: {
    fontFamily: fontFamily.regular,
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 1,
  },
  editLink: {
    alignSelf: 'flex-start',
    marginTop: 3,
  },
  editLinkText: {
    fontFamily: fontFamily.medium,
    fontSize: 13,
    color: colors.primary,
  },
});
