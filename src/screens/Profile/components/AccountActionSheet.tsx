import React from 'react';
import { Modal, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../../styles';
import { actionStyles as styles } from './accountAction.styles';

type Tone = 'primary' | 'danger';

type Props = {
  visible: boolean;
  title: string;
  tone?: Tone;
  closeDisabled?: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export default function AccountActionSheet({
  visible,
  title,
  tone = 'primary',
  closeDisabled,
  onClose,
  children,
}: Props) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={closeDisabled ? () => {} : onClose}
    >
      <TouchableWithoutFeedback onPress={closeDisabled ? () => {} : onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={styles.sheet}>
              <View style={[styles.header, tone === 'danger' ? styles.headerDanger : styles.headerPrimary]}>
                <Text style={styles.title}>{title}</Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={onClose}
                  disabled={closeDisabled}
                  hitSlop={8}
                >
                  <Icon name="close" size={22} color={colors.textMuted} />
                </TouchableOpacity>
              </View>
              <View style={styles.body}>{children}</View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
