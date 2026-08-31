import { StyleSheet } from 'react-native';
import { fontFamily, radius, spacing } from '../../../styles';

export const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: radius.md,
    backgroundColor: '#FFFBEB',
    paddingVertical: spacing.sm + 4,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  side: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 2,
  },
  text: {
    fontFamily: fontFamily.semiBold,
    fontSize: 16,
    color: '#1E293B',
  },
  giftColor: {
    color: '#B45309',
  },
  flameColor: {
    color: '#F97316',
  },
});
