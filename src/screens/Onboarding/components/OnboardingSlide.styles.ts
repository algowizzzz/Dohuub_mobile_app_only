import { StyleSheet } from 'react-native';
import { fontFamily, spacing } from '../../../styles';

export const styles = StyleSheet.create({
  slide: {
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  iconWrap: {
    flex: 2,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBadge: {
    width: 192,
    height: 192,
    borderRadius: 96,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconImage: {
    width: 96,
    height: 96,
  },
  textWrap: {
    flex: 2,
    width: '100%',
    alignItems: 'center',
  },
  title: {
    fontFamily: fontFamily.regular,
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 16,
  },
  description: {
    fontFamily: fontFamily.regular,
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 24,
  },
  paginationRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.xl,
  },
});
