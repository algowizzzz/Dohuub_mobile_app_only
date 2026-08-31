import { StyleSheet } from 'react-native';
import { colors, spacing } from '../../styles';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  flex: {
    flex: 1,
  },
  // PWA .thread: background #ffffff, padding 16px 20px, gap 10 between bubbles.
  list: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  listContent: {
    paddingHorizontal: spacing.md + 4,
    paddingVertical: spacing.md,
    flexGrow: 1,
  },
  inputWrap: {
    backgroundColor: colors.surface,
  },
});
