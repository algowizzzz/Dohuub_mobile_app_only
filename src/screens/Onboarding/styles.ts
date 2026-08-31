import { StyleSheet } from 'react-native';
import { fontFamily, spacing } from '../../styles';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  skipRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.sm,
  },
  skipLabel: {
    fontFamily: fontFamily.medium,
    color: '#FFFFFF',
    fontSize: 16,
  },
  list: {
    flex: 1,
  },
  listContent: {
    flexGrow: 1,
  },
  footer: {
    width: '100%',
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.lg,
  },
});
