import { StyleSheet } from 'react-native';
import { fontFamily, spacing } from '../../../styles';

export const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  rowLast: {
    marginBottom: 0,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(147, 51, 234, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  textCol: {
    flex: 1,
    paddingTop: 2,
  },
  title: {
    fontFamily: fontFamily.medium,
    fontSize: 14,
    color: 'rgb(88, 28, 135)',
  },
  description: {
    fontFamily: fontFamily.regular,
    fontSize: 13,
    color: 'rgb(126, 34, 206)',
    marginTop: 2,
  },
});