import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../../styles';
import { ADDRESS_TYPE_META, formatAddressLine, type Address } from '../addresses';
import { styles } from './AddressCard.styles';

type Props = {
  address: Address;
  onSetDefault: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

export default function AddressCard({ address, onSetDefault, onEdit, onDelete }: Props) {
  const meta = ADDRESS_TYPE_META[address.type];

  return (
    <View style={[styles.card, address.isDefault && styles.cardDefault]}>
      <View style={styles.iconWrap}>
        <Icon name={meta.icon} size={20} color={colors.primary} />
      </View>

      <View style={styles.info}>
        <View style={styles.titleRow}>
          <Text style={styles.label}>{meta.label}</Text>
          {address.isDefault ? (
            <View style={styles.defaultBadge}>
              <Text style={styles.defaultBadgeText}>Default</Text>
            </View>
          ) : null}
        </View>
        <Text style={styles.addressLine} numberOfLines={2}>
          {formatAddressLine(address)}
        </Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.iconButton} onPress={onEdit} hitSlop={4}>
          <Icon name="create-outline" size={18} color={colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={onDelete} hitSlop={4}>
          <Icon name="trash-outline" size={18} color={colors.danger} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.starButton, address.isDefault && styles.starButtonActive]}
          onPress={onSetDefault}
          disabled={address.isDefault}
          hitSlop={4}
        >
          <Icon
            name={address.isDefault ? 'star' : 'star-outline'}
            size={16}
            color={address.isDefault ? colors.white : colors.textMuted}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}
