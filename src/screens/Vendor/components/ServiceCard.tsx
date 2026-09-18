import React, { useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../../styles';
import type { ApiVendorService } from '../../../services/catalogApi';
import { formatDurationHours } from '../../../utils/duration';
import { styles } from './ServiceCard.styles';

type Props = {
  service: ApiVendorService;
  ratingAverage?: number;
  ratingCount?: number;
  onPress: () => void;
};

export default function ServiceCard({ service, ratingAverage, ratingCount, onPress }: Props) {
  const price = service.discountedPrice ?? service.price;
  const duration = formatDurationHours(service.serviceTimeInMinutes);
  const showRating = (ratingCount ?? 0) > 0 && typeof ratingAverage === 'number';
  const [imageBroken, setImageBroken] = useState(false);
  const photo = service.image?.trim() || '';

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.topRow}>
        {photo && !imageBroken ? (
          <Image
            source={{ uri: photo }}
            style={styles.thumb}
            resizeMode="cover"
            onError={() => setImageBroken(true)}
          />
        ) : (
          <View style={styles.thumbFallback}>
            <Icon name="image-outline" size={20} color={colors.textFaint} />
          </View>
        )}
        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={2}>
            {service.name}
          </Text>
          {service.description ? (
            <Text style={styles.description} numberOfLines={2}>
              {service.description}
            </Text>
          ) : null}
          {showRating || duration ? (
            <View style={styles.metaRow}>
              {showRating ? (
                <View style={styles.metaItem}>
                  <Icon name="star" size={14} color={colors.star} />
                  <Text style={styles.metaRating}>{ratingAverage?.toFixed(1)}</Text>
                </View>
              ) : null}
              {duration ? (
                <View style={styles.metaItem}>
                  <Icon name="time-outline" size={14} color={colors.textMuted} />
                  <Text style={styles.metaDuration}>{duration}</Text>
                </View>
              ) : null}
            </View>
          ) : null}
        </View>
        <Text style={styles.price}>${price}</Text>
      </View>
    </TouchableOpacity>
  );
}
