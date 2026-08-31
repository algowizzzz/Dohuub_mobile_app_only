import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';
import { colors } from '../../styles';
import MainScreenLayout from '../../components/layout/MainScreenLayout';
import SubScreenHeader from '../../components/layout/SubScreenHeader';
import PrimaryButton from '../../components/ui/PrimaryButton';
import LoadingState from '../../components/ui/LoadingState';
import { useBookingStore } from '../../store/bookingStore';
import { reviewsApi } from '../../services/reviewApi';
import { ApiError } from '../../services/ApiError';
import ErrorBanner from '../../components/ui/ErrorBanner';
import type { ApiBooking } from '../../services/bookingApi';
import { formatScheduledDate } from '../Bookings/statusMeta';
import { styles } from './styles';

const MIN_COMMENT_LENGTH = 3;
const MAX_COMMENT_LENGTH = 2000;

type Props = NativeStackScreenProps<RootStackParamList, 'LeaveReview'>;

export default function LeaveReviewScreen({ navigation, route }: Props) {
  const getBooking = useBookingStore(state => state.getBooking);
  const patchRow = useBookingStore(state => state.patchRow);
  const [booking, setBooking] = useState<ApiBooking | null>(null);
  const [loading, setLoading] = useState(true);
  const [stars, setStars] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getBooking(route.params.bookingId)
      .then(setBooking)
      .catch(() => setBooking(null))
      .finally(() => setLoading(false));
  }, [getBooking, route.params.bookingId]);

  const canSubmit = stars > 0 && comment.trim().length >= MIN_COMMENT_LENGTH && !submitting;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    setError(null);
    try {
      const review = await reviewsApi.create({
        bookingId: route.params.bookingId,
        stars,
        comment: comment.trim(),
      });
      patchRow(route.params.bookingId, {
        review: { id: review.id, stars: review.stars, comment: review.comment ?? null },
      });
      navigation.replace('BookingDetail', { bookingId: route.params.bookingId });
    } catch (err) {
      setError(ApiError.messageOf(err, 'Could not submit the review.'));
      setSubmitting(false);
    }
  };

  return (
    <MainScreenLayout edges={['top', 'bottom']}>
      <SubScreenHeader title="Rate Your Experience" onBack={() => navigation.goBack()} />

      {loading ? (
        <LoadingState />
      ) : (
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior="padding"
        >
          <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled" automaticallyAdjustKeyboardInsets>
            {booking ? (
              <View style={styles.serviceCard}>
                <LinearGradient
                  colors={[colors.gradientCtaStart, colors.gradientCtaEnd]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.serviceIconWrap}
                >
                  <Icon name="sparkles" size={20} color={colors.white} />
                </LinearGradient>
                <View style={styles.serviceInfo}>
                  <Text style={styles.serviceName}>{booking.service.name}</Text>
                  <Text style={styles.serviceDate}>{formatScheduledDate(booking.scheduledDate)}</Text>
                </View>
              </View>
            ) : null}

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Rate Your Experience *</Text>
              <View style={styles.starRow}>
                {[1, 2, 3, 4, 5].map(value => (
                  <TouchableOpacity
                    key={value}
                    style={styles.starButton}
                    onPress={() => setStars(value)}
                    hitSlop={4}
                  >
                    <Icon
                      name={value <= stars ? 'star' : 'star-outline'}
                      size={38}
                      color={value <= stars ? colors.warning : colors.border}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Write Your Review *</Text>
              <TextInput
                style={styles.textarea}
                multiline
                numberOfLines={5}
                maxLength={MAX_COMMENT_LENGTH}
                placeholder="Share your experience with this service…"
                placeholderTextColor={colors.textMuted}
                value={comment}
                onChangeText={setComment}
              />
              <Text style={styles.counter}>{comment.length} characters</Text>
            </View>

            {error ? <ErrorBanner message={error} /> : null}

            <PrimaryButton
              label={submitting ? 'Submitting…' : 'Submit Review'}
              onPress={handleSubmit}
              disabled={!canSubmit}
              loading={submitting}
              style={styles.submitButton}
            />

            <TouchableOpacity
              style={styles.laterButton}
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
            >
              <Text style={styles.laterLabel}>Review Later</Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      )}
    </MainScreenLayout>
  );
}
