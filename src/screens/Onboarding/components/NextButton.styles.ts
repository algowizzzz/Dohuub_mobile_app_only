import { StyleSheet } from 'react-native';
import { fontFamily } from '../../../styles';

export const styles = StyleSheet.create({
  row: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    paddingHorizontal: 24,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  backIcon: {
    marginRight: 2,
  },
  backLabel: {
    fontFamily: fontFamily.semiBold,
    color: '#FFFFFF',
    fontSize: 16,
  },
  nextButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  nextLabel: {
    fontFamily: fontFamily.semiBold,
    color: '#1D4ADD',
    fontSize: 16,
  },
  nextIcon: {
    marginLeft: 4,
  },
});
