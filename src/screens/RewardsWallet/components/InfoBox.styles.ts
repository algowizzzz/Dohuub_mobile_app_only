import { StyleSheet } from 'react-native';
import { fontFamily, radius, spacing } from '../../../styles';

export const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFF5EC',
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: '#F3D5B0',
  },
  title: {
    fontFamily: fontFamily.semiBold,
    fontSize: 15,
    color: '#B45309',
    marginBottom: 12,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  bullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EA580C',
    marginTop: 5,
    marginRight: spacing.sm,
  },
  itemText: {
    flex: 1,
    fontFamily: fontFamily.regular,
    fontSize: 13,
    color: '#B45309',
    lineHeight: 19,
  },
});
