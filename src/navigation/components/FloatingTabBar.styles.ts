import { Platform, StyleSheet } from 'react-native';
import { colors, fontFamily, radius, spacing } from '../../styles';

const BAR_HEIGHT = Platform.OS === 'ios' ? 68 : 56;

export const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    paddingHorizontal: spacing.md,
  },
  barShadow: {
    borderRadius: 28,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.12,
        shadowRadius: 16,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  bar: {
    height: BAR_HEIGHT,
    flexDirection: 'row',
    alignItems: 'stretch',
    borderRadius: 28,
    paddingHorizontal: 6,
  },
  tabTouchable: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 2,
    paddingVertical: Platform.OS === 'ios' ? 8 : 6,
  },
  item: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  label: {
    fontFamily: fontFamily.bold,
    fontSize: Platform.OS === 'ios' ? 10 : 11,
    letterSpacing: 0.15,
    color: 'rgba(255, 255, 255, 0.72)',
    marginTop: 3,
    textAlign: 'center',
    width: '100%',
  },
  labelActive: {
    color: colors.white,
  },
});
