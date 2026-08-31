import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../../styles';
import type { ApiBooking } from '../../../services/bookingApi';
import { STATUS_META, formatScheduledTime } from '../statusMeta';
import { styles } from './BookingCard.styles';

type Props = {
  booking: ApiBooking;
  onPress: () => void;
};

function formatBookingAddress(booking: ApiBooking): string | null {
  const address = booking.address;
  if (!address) return null;
  const parts = [address.address, address.city, address.state, address.zipCode].filter(Boolean);
  return parts.length > 0 ? parts.join(', ') : null;
}

export default function BookingCard({ booking, onPress }: Props) {
  const status = STATUS_META[booking.status];
  const addressLine = formatBookingAddress(booking);
  const when = `${booking.scheduledDate} at ${formatScheduledTime(booking.scheduledTime)}`;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      <View style={styles.iconWrap}>
        <Icon name="sparkles" size={32} color={colors.primary} />
      </View>

      <View style={styles.body}>
        <Text style={styles.serviceName} numberOfLines={1}>
          {booking.service.name}
        </Text>
        <Text style={styles.metaText} numberOfLines={1}>
          {when}
        </Text>
        {addressLine ? (
          <Text style={styles.metaText} numberOfLines={1}>
            {addressLine}
          </Text>
        ) : null}
        <View style={[styles.statusPill, { backgroundColor: status.bg }]}>
          <Text style={[styles.statusLabel, { color: status.color }]}>
            {status.label.toLowerCase()}
          </Text>
        </View>
      </View>

      <Icon name="chevron-forward" size={20} color={colors.textMuted} />
    </TouchableOpacity>
  );
}
