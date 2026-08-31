import { StyleSheet } from 'react-native';
import { colors, fontFamily, radius, spacing } from '../../../styles';

export const styles = StyleSheet.create({
  // PWA .inputBar: white bg, top border --m-divider-soft, no shadow.
  wrap: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    borderTopWidth: 1,
    borderTopColor: colors.dividerSoft,
  },
  // PWA .input: 1.5px border --m-border, radius full, --m-bg fill.
  input: {
    flex: 1,
    maxHeight: 100,
    backgroundColor: colors.background,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 3,
    fontFamily: fontFamily.regular,
    fontSize: 14,
    color: colors.text,
    marginRight: spacing.sm,
  },
  // PWA .sendBtn: 42x42 circle, always --m-primary bg; :disabled -> opacity 0.5.
  sendButton: {
    width: 42,
    height: 42,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});
