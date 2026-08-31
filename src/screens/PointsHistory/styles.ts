import { StyleSheet } from 'react-native';
import { colors, fontFamily, spacing } from '../../styles';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: spacing.lg,
  },
  monthLabel: {
    fontFamily: fontFamily.bold,
    fontSize: 15,
    color: colors.text,
    marginBottom: spacing.sm,
  },
});
