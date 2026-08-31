import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../../styles';
import { styles } from './VendorListCard.styles';

type VendorSummary = {
  id: string;
  businessName: string;
  city: string;
  state: string;
  ratingAverage: number;
  ratingCount: number;
  serviceCount: number;
  minPrice: number;
  poweredByDoHuub?: boolean;
};

type Props = {
  vendor: VendorSummary;
  onPress: () => void;
};

export default function VendorListCard({ vendor, onPress }: Props) {
  const tagline =
    [vendor.city, vendor.state].filter(Boolean).join(', ') ||
    `${vendor.serviceCount} ${vendor.serviceCount === 1 ? 'service' : 'services'} available`;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      <View style={styles.cardRow}>
        <View style={styles.logoFallback}>
          <Icon name="business" size={22} color={colors.textMuted} />
        </View>

        <View style={styles.info}>
          <View style={styles.nameRow}>
            <Text style={styles.name} numberOfLines={1}>
              {vendor.businessName}
            </Text>
            {vendor.poweredByDoHuub ? (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>Powered by DoHuub</Text>
              </View>
            ) : null}
          </View>

          <View style={styles.ratingRow}>
            {vendor.ratingCount > 0 ? (
              <>
                <Icon name="star" size={14} color={colors.star} />
                <Text style={styles.rating}>{vendor.ratingAverage.toFixed(1)}</Text>
                <Text style={styles.reviews}>({vendor.ratingCount})</Text>
              </>
            ) : (
              <Text style={styles.reviews}>No reviews yet</Text>
            )}
          </View>

          <Text style={styles.tagline} numberOfLines={1}>
            {tagline}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
