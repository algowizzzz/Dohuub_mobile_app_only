import { StyleSheet } from 'react-native';
import { colors, fontFamily, spacing } from '../../styles';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxl + 72,
  },
  sectionTitle: {
    fontFamily: fontFamily.medium,
    fontSize: 15,
    color: colors.text,
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  list: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});
