import React from 'react';
import {
  ActivityIndicator,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../styles';
import { styles } from './ConfirmModal.styles';

const TONE = {
  warning: {
    iconWrap: styles.iconWrapWarning,
    iconColor: colors.secondary,
    confirmButton: styles.confirmButtonWarning,
  },
  danger: {
    iconWrap: styles.iconWrapDanger,
    iconColor: colors.danger,
    confirmButton: styles.confirmButtonDanger,
  },
  primary: {
    iconWrap: styles.iconWrapPrimary,
    iconColor: colors.primary,
    confirmButton: styles.confirmButtonPrimary,
  },
};

type Props = {
  visible: boolean;
  title: string;
  message: string;
  icon: string;
  iconTone?: 'warning' | 'danger' | 'primary';
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
  /** While true the confirm button shows a spinner and nothing can be tapped (no double submit). */
  loading?: boolean;
  /** Shown inside the sheet, so a failed action keeps the dialog open for a retry. */
  error?: string | null;
  confirmTestID?: string;
  cancelTestID?: string;
};

export default function ConfirmModal({
  visible,
  title,
  message,
  icon,
  iconTone = 'warning',
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
  loading = false,
  error = null,
  confirmTestID,
  cancelTestID,
}: Props) {
  const dismiss = () => {
    if (!loading) onCancel();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={dismiss}>
      <View style={styles.overlay}>
        {/* Backdrop is a sibling, not a wrapper: wrapping the sheet in a touchable
            made iOS accessibility (and Maestro) read the whole dialog as one element. */}
        <TouchableWithoutFeedback onPress={dismiss} accessible={false}>
          <View style={StyleSheet.absoluteFill} />
        </TouchableWithoutFeedback>
            <View style={styles.sheet}>
              <View style={styles.header}>
                <Text style={styles.title}>{title}</Text>
                <TouchableOpacity onPress={dismiss} disabled={loading} hitSlop={8}>
                  <Icon name="close" size={20} color={colors.textMuted} />
                </TouchableOpacity>
              </View>

              <View style={styles.body}>
                <View
                  style={[styles.iconWrap, TONE[iconTone].iconWrap]}
                >
                  <Icon name={icon} size={26} color={TONE[iconTone].iconColor} />
                </View>
                <Text style={styles.message}>{message}</Text>
                {error ? (
                  <Text style={styles.errorText} testID="confirm-modal-error">
                    {error}
                  </Text>
                ) : null}
              </View>

              <View style={styles.actions}>
                <TouchableOpacity
                  testID={cancelTestID}
                  style={[styles.cancelButton, loading && styles.buttonDisabled]}
                  onPress={dismiss}
                  disabled={loading}
                  activeOpacity={0.8}
                >
                  <Text style={styles.cancelLabel}>{cancelLabel}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  testID={confirmTestID}
                  style={[
                    styles.confirmButton,
                    TONE[iconTone].confirmButton,
                    loading && styles.buttonDisabled,
                  ]}
                  onPress={onConfirm}
                  disabled={loading}
                  activeOpacity={0.85}
                  accessibilityState={{ disabled: loading, busy: loading }}
                >
                  {loading ? (
                    <ActivityIndicator size="small" color={colors.white} />
                  ) : (
                    <Text style={styles.confirmLabel}>{confirmLabel}</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
      </View>
    </Modal>
  );
}
