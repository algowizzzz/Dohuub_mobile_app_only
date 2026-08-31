import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../../styles';
import ErrorBanner from '../../../components/ui/ErrorBanner';
import AccountActionSheet from './AccountActionSheet';
import { actionStyles as styles } from './accountAction.styles';

type Props = {
  visible: boolean;
  confirming?: boolean;
  error?: string | null;
  onClose: () => void;
  onConfirm: () => void;
};

const LOST_ITEMS = [
  'All your saved addresses',
  'Payment methods',
  'Order history',
  'Bookings and preferences',
  'Account information',
];

export default function DeleteAccountModal({
  visible,
  confirming,
  error,
  onClose,
  onConfirm,
}: Props) {
  return (
    <AccountActionSheet
      visible={visible}
      title="Delete Account"
      tone="danger"
      closeDisabled={confirming}
      onClose={onClose}
    >
      <View style={[styles.iconWrap, styles.iconWrapDanger]}>
        <Icon name="trash-outline" size={32} color={colors.danger} />
      </View>

      <Text style={styles.headline}>Delete Your Account?</Text>
      <Text style={[styles.message, styles.messageBeforeWarning]}>
        This action cannot be undone. All your data will be permanently deleted.
      </Text>

      <View style={styles.warningBox}>
        <Icon name="warning" size={20} color={colors.danger} />
        <View style={styles.warningCopy}>
          <Text style={styles.warningTitle}>You will lose:</Text>
          {LOST_ITEMS.map(item => (
            <Text key={item} style={styles.warningItem}>
              • {item}
            </Text>
          ))}
        </View>
      </View>

      {error ? <ErrorBanner message={error} /> : null}

      <TouchableOpacity
        style={[styles.confirmButton, confirming && styles.confirmButtonDisabled]}
        onPress={onConfirm}
        disabled={confirming}
        activeOpacity={0.85}
      >
        <View style={[styles.confirmButtonFill, styles.confirmButtonDanger]}>
          <Text style={styles.confirmLabel}>
            {confirming ? 'Deleting…' : 'Yes, Delete My Account'}
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.cancelButton}
        onPress={onClose}
        disabled={confirming}
        activeOpacity={0.8}
      >
        <Text style={styles.cancelLabel}>Cancel</Text>
      </TouchableOpacity>
    </AccountActionSheet>
  );
}
