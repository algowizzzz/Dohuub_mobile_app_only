import React from 'react';
import { Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../../styles';
import type { ApiBookingReview } from '../../../services/bookingApi';
import { styles } from './ReviewSection.styles';

type Props = {
  review: ApiBookingReview;
};

export default function ReviewSection({ review }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Your review</Text>
      <View style={styles.starsRow}>
        {[1, 2, 3, 4, 5].map(star => (
          <Icon
            key={star}
            name={star <= review.stars ? 'star' : 'star-outline'}
            size={18}
            color={colors.warning}
          />
        ))}
      </View>
      {review.comment ? <Text style={styles.comment}>{review.comment}</Text> : null}
    </View>
  );
}
