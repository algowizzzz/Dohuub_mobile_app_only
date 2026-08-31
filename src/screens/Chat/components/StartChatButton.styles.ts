import { Platform, StyleSheet } from 'react-native';
import { colors, fontFamily, spacing } from '../../../styles';

export const styles = StyleSheet.create({
  hit: {
    width: '100%',
  },
  button: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 18,
    paddingLeft: 18,
    paddingRight: 14,
    paddingVertical: 16,
    marginBottom: spacing.sm,
    ...Platform.select({
      android: {
        elevation: 4,
      },
    }),
  },
  label: {
    flex: 1,
    flexShrink: 1,
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
    flexShrink: 0,
  },
});
