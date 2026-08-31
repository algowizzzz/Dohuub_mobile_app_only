import { StyleSheet } from 'react-native';
import { colors, radius, typography } from '../../styles';

export const styles = StyleSheet.create({
  // PWA .btnWhite (social sign-in): radius 12, min-height 52, white bg
  button: {
    width: '100%',
    height: 52,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginRight: 10,
  },
  label: {
    ...typography.bodyBold,
    color: colors.text,
  },
});
