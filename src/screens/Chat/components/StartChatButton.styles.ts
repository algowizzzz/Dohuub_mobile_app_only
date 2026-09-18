import { StyleSheet } from 'react-native';
import { colors, fontFamily, spacing } from '../../../styles';

export const styles = StyleSheet.create({
  hit: {
    width: '100%',
    alignSelf: 'stretch',
    marginBottom: spacing.sm,
  },
  pressed: {
    opacity: 0.92,
  },
  button: {
    width: '100%',
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 18,
    paddingLeft: 18,
    paddingRight: 14,
    paddingVertical: 16,
  },
  label: {
    flex: 1,
    minWidth: 0,
    fontFamily: fontFamily.bold,
    fontSize: 17,
    lineHeight: 22,
    color: colors.white,
    marginLeft: 12,
    marginRight: 10,
  },
  arrowWrap: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
