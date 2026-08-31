import { StyleSheet } from 'react-native';
import { colors, fontFamily, radius, spacing } from '../../../styles';

const CIRCLE_SIZE = 32;

export const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
  markerColumn: {
    width: CIRCLE_SIZE,
    alignItems: 'center',
    marginRight: 14,
  },
  doneCircle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeCircle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  upcomingCircle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  upcomingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.border,
  },
  connector: {
    width: 2,
    flex: 1,
    minHeight: 32,
    backgroundColor: colors.border,
    marginTop: 4,
    marginBottom: 4,
  },
  connectorDone: {
    backgroundColor: colors.success,
  },
  connectorActive: {
    backgroundColor: colors.primary,
  },
  textCol: {
    flex: 1,
    paddingBottom: spacing.md,
  },
  title: {
    fontFamily: fontFamily.semiBold,
    fontSize: 15,
    color: colors.textHeading,
  },
  titleMuted: {
    color: colors.textMuted,
  },
  description: {
    fontFamily: fontFamily.regular,
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 2,
    lineHeight: 18,
  },
  timestamp: {
    fontFamily: fontFamily.medium,
    fontSize: 12,
    color: colors.primary,
    marginTop: 4,
  },
});
