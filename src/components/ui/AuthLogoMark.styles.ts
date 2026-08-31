import { StyleSheet } from 'react-native';
import { colors, radius } from '../../styles';

export const styles = StyleSheet.create({
  wrap: {
    width: 84,
    height: 84,
    borderRadius: radius.lg,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  logo: {
    width: 52,
    height: 52,
  },
});
