import { Platform, StyleSheet } from 'react-native';
import { colors, radius, typography } from '../../styles';

export const styles = StyleSheet.create({
  // PWA .btn.primary/.md: radius 12, min-height 52, solid var(--m-primary)
  button: {
    width: '100%',
    height: 52,
    borderRadius: radius.lg,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    ...Platform.select({
      ios: {
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  // PWA .btn:disabled: rgba(46,122,217,.15) bg, var(--m-text-muted) text
  buttonDisabled: {
    backgroundColor: 'rgba(46, 122, 217, 0.15)',
    shadowOpacity: 0,
    elevation: 0,
  },
  label: {
    ...typography.button,
    color: colors.white,
  },
  labelDisabled: {
    color: colors.textMuted,
  },
});
