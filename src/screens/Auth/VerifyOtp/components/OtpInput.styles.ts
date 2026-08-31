import { Platform, StyleSheet } from 'react-native';
import { colors, fontFamily, radius } from '../../../../styles';

export const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  box: {
    width: 48,
    height: 58,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.white,
    backgroundColor: colors.white,
    marginHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: colors.text,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 6,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  boxFilled: {
    borderColor: colors.primary,
  },
  digit: {
    fontFamily: fontFamily.bold,
    fontSize: 22,
    color: colors.text,
  },
  hiddenInput: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0,
  },
});
