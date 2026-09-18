import { StyleSheet } from 'react-native';
import { fontFamily, spacing } from '../../styles';

export const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    width: '100%',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.28)',
    backgroundColor: '#FFF5EC',
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: spacing.md,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(245, 158, 11, 0.22)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    flexShrink: 0,
  },
  textCol: {
    flex: 1,
    minWidth: 0,
    flexShrink: 1,
  },
  title: {
    fontFamily: fontFamily.semiBold,
    fontSize: 14,
    color: '#B45309',
  },
  subtitle: {
    fontFamily: fontFamily.regular,
    fontSize: 12,
    color: '#B45309',
    marginTop: 2,
    lineHeight: 17,
    flexShrink: 1,
  },
});
