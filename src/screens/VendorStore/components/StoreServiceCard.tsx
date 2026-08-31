import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../../styles';
import type { ApiVendorService } from '../../../services/catalogApi';
import { styles } from './StoreServiceCard.styles';

type Props = {
  service: ApiVendorService;
  ratingAverage: number;
  ratingCount: number;
  onPress: () => void;
};

export default function StoreServiceCard({
  service,
  ratingAverage,
  ratingCount,
  onPress,
}: Props) {
  const price = service.discountedPrice ?? service.price;
  const showRating = ratingCount > 0;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      {service.image ? (
        <Image source={{ uri: service.image }} style={styles.image} />
      ) : (
        <View style={styles.imageFallback}>
          <Icon name="sparkles" size={24} color={colors.textFaint} />
        </View>
      )}
      <View style={styles.body}>
        <Text style={styles.name} numberOfLines={2}>
          {service.name}
        </Text>
        {showRating ? (
          <View style={styles.ratingRow}>
            <Icon name="star" size={12} color={colors.star} />
            <Text style={styles.rating}>{ratingAverage.toFixed(1)}</Text>
          </View>
        ) : (
          <Text style={styles.newLabel}>New</Text>
        )}
        {service.description ? (
          <Text style={styles.description} numberOfLines={1}>
            {service.description}
          </Text>
        ) : null}
        <Text style={styles.price}>${Math.round(price)}</Text>
      </View>
    </TouchableOpacity>
  );
}
