import React from 'react';
import { Image, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../../styles';
import type { ApiVendorReview } from '../../../services/catalogApi';
import { abbreviateName, formatRelativeTime } from '../../../utils/relativeTime';
import { styles } from './ReviewCard.styles';

type Props = {
  review: ApiVendorReview;
};

export default function ReviewCard({ review }: Props) {
  const rounded = Math.round(review.stars);
  const name = review.author.fullName || 'Customer';
  const initial = name.trim().charAt(0).toUpperCase() || '?';

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        {review.author.image ? (
          <Image source={{ uri: review.author.image }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarFallback}>
            <Text style={styles.avatarInitial}>{initial}</Text>
          </View>
        )}
        <View style={styles.headerText}>
          <View style={styles.nameRow}>
            <Text style={styles.name} numberOfLines={1}>
              {abbreviateName(name)}
            </Text>
            <Text style={styles.date}>{formatRelativeTime(review.createdAt)}</Text>
          </View>
          <View style={styles.ratingRow}>
            {[1, 2, 3, 4, 5].map(star => (
              <Icon
                key={star}
                name={star <= rounded ? 'star' : 'star-outline'}
                size={14}
                color={star <= rounded ? colors.star : colors.muted}
              />
            ))}
          </View>
        </View>
      </View>
      {review.comment ? <Text style={styles.comment}>{review.comment}</Text> : null}
    </View>
  );
}