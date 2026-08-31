import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../../styles';
import AccountActionSheet from './AccountActionSheet';
import { actionStyles as styles } from './accountAction.styles';

type Props = {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export default function LogOutModal({ visible, onClose, onConfirm }: Props) {
  return (
    <AccountActionSheet visible={visible} title="Log Out" onClose={onClose}>
      <View style={[styles.iconWrap, styles.iconWrapPrimary]}>
        <Icon name="log-out-outline" size={32} color={colors.primary} />
      </View>

      <Text style={styles.headline}>Are you sure you want to log out?</Text>
      <Text style={styles.message}>
        You will need to log in again to access your account and bookings.
      </Text>

      <TouchableOpacity style={styles.confirmButton} onPress={onConfirm} activeOpacity={0.85}>
        <LinearGradient
          colors={[colors.gradientStart, colors.gradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.confirmButtonFill}
        >
          <Text style={styles.confirmLabel}>Yes, Log Out</Text>
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity style={styles.cancelButton} onPress={onClose} activeOpacity={0.8}>
        <Text style={styles.cancelLabel}>Cancel</Text>
      </TouchableOpacity>
    </AccountActionSheet>
  );
}
