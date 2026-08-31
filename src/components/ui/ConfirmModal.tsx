import React from 'react';
import { Modal, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../styles';
import { styles } from './ConfirmModal.styles';

type Props = {
  visible: boolean;
  title: string;
  message: string;
  icon: string;
  iconTone?: 'warning' | 'danger';
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
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
}: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <TouchableWithoutFeedback onPress={onCancel}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={styles.sheet}>
              <View style={styles.header}>
                <Text style={styles.title}>{title}</Text>
                <TouchableOpacity onPress={onCancel} hitSlop={8}>
                  <Icon name="close" size={20} color={colors.textMuted} />
                </TouchableOpacity>
              </View>

              <View style={styles.body}>
                <View
                  style={[
                    styles.iconWrap,
                    iconTone === 'danger' ? styles.iconWrapDanger : styles.iconWrapWarning,
                  ]}
                >
                  <Icon
                    name={icon}
                    size={26}
                    color={iconTone === 'danger' ? colors.danger : colors.secondary}
                  />
                </View>
                <Text style={styles.message}>{message}</Text>
              </View>

              <View style={styles.actions}>
                <TouchableOpacity style={styles.cancelButton} onPress={onCancel} activeOpacity={0.8}>
                  <Text style={styles.cancelLabel}>{cancelLabel}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.confirmButton,
                    iconTone === 'danger' ? styles.confirmButtonDanger : styles.confirmButtonWarning,
                  ]}
                  onPress={onConfirm}
                  activeOpacity={0.85}
                >
                  <Text style={styles.confirmLabel}>{confirmLabel}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
