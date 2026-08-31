import { StyleSheet } from 'react-native';
import { colors, fontFamily, radius, spacing } from '../../styles';

export const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    alignSelf: 'stretch',
    width: '100%',
    backgroundColor: colors.errorLight,
    borderRadius: radius.md + 2,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.25)',
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md - 2,
    marginBottom: spacing.md,
  },
  wrapOnDark: {
    backgroundColor: 'rgba(239, 68, 68, 0.4)',
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  icon: {
    marginTop: 1,
    marginRight: spacing.sm,
  },
  text: {
    flex: 1,
    fontFamily: fontFamily.medium,
    fontSize: 14,
    lineHeight: 20,
    color: colors.errorDeep,
  },
  textOnDark: {
    color: colors.white,
  },
});
