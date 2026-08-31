import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../../styles';
import type { ApiCard } from '../../../services/accountApi';
import { styles } from './PaymentCardRow.styles';

type Props = {
  card: ApiCard;
  onEdit: () => void;
  onSetDefault: () => void;
  onDelete: () => void;
};

function capitalize(value: string): string {
  if (!value) return 'Card';
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export default function PaymentCardRow({ card, onEdit, onSetDefault, onDelete }: Props) {
  const expiry = `${String(card.expMonth).padStart(2, '0')}/${card.expYear}`;

  return (
    <View style={styles.card}>
      <LinearGradient
        colors={[colors.gradientStart, colors.gradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.brandWrap}
      >
        <Icon name="card" size={22} color={colors.white} />
      </LinearGradient>

      <View style={styles.info}>
        <Text style={styles.title}>
          {capitalize(card.brand)} •••• {card.last4}
        </Text>
        <Text style={styles.expiry}>Expires {expiry}</Text>
        {card.isDefault ? (
          <View style={styles.defaultBadge}>
            <Text style={styles.defaultBadgeText}>Default</Text>
          </View>
        ) : (
          <TouchableOpacity onPress={onSetDefault} activeOpacity={0.7} style={styles.setDefaultButton}>
            <Text style={styles.setDefaultText}>Set as Default</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.editButton} onPress={onEdit} hitSlop={4}>
          <Icon name="create-outline" size={18} color={colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={onDelete} hitSlop={4}>
          <Icon name="trash-outline" size={18} color={colors.danger} />
        </TouchableOpacity>
      </View>
    </View>
  );
}