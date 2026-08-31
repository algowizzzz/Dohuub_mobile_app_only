import React, { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';
import { colors } from '../../styles';
import ScreenStatusBar from '../../components/layout/ScreenStatusBar';
import SubScreenHeader from '../../components/layout/SubScreenHeader';
import LoadingState from '../../components/ui/LoadingState';
import ErrorState from '../../components/ui/ErrorState';
import { useCatalogStore } from '../../store/catalogStore';
import { reviewsApi, type StarBreakdown } from '../../services/reviewApi';
import type { ApiVendorDetail, ApiVendorReview } from '../../services/catalogApi';
import RatingBar from '../Vendor/components/RatingBar';
import ReviewCard from '../Vendor/components/ReviewCard';
import { styles } from './styles';

type Props = NativeStackScreenProps<RootStackParamList, 'VendorReviews'>;

const EMPTY_BREAKDOWN = [0, 0, 0, 0, 0];

function breakdownFromApi(starBreakdown: StarBreakdown | null | undefined): number[] {
  if (!starBreakdown) return EMPTY_BREAKDOWN;
  return [1, 2, 3, 4, 5].map(star => {
    const key = String(star) as keyof StarBreakdown;
    return starBreakdown[key] ?? 0;
  });
}

export default function VendorReviewsScreen({ navigation, route }: Props) {
  const getVendor = useCatalogStore(state => state.getVendor);
  const [vendor, setVendor] = useState<ApiVendorDetail | null>(null);
  const [reviews, setReviews] = useState<ApiVendorReview[]>([]);
  const [starBreakdown, setStarBreakdown] = useState<number[]>(EMPTY_BREAKDOWN);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    setError(null);
    Promise.all([
      getVendor(route.params.vendorId),
      reviewsApi.list({ vendorId: route.params.vendorId, limit: 50 }).catch(() => null),
    ])
      .then(([detail, reviewsPage]) => {
        setVendor(detail);
        if (reviewsPage?.starBreakdown) {
          setStarBreakdown(breakdownFromApi(reviewsPage.starBreakdown));
        }
        if (reviewsPage?.items?.length) {
          setReviews(
            reviewsPage.items.map(item => ({
              id: item.id,
              stars: item.stars,
              comment: item.comment ?? null,
              createdAt: item.createdAt,
              author: {
                id: item.author?.id ?? '',
                fullName: item.author?.fullName ?? item.reviewerName ?? 'Customer',
                image: item.author?.image ?? null,
              },
            })),
          );
        } else {
          setReviews(detail.reviews);
        }
      })
      .catch(err => setError((err as Error).message))
      .finally(() => setLoading(false));
  };

  useEffect(load, [route.params.vendorId]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <SubScreenHeader title="Reviews & Ratings" onBack={() => navigation.goBack()} />
        <LoadingState />
      </SafeAreaView>
    );
  }

  if (error || !vendor) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <SubScreenHeader title="Reviews & Ratings" onBack={() => navigation.goBack()} />
        <ErrorState message={error ?? 'Vendor not found.'} onRetry={load} />
      </SafeAreaView>
    );
  }

  const roundedAverage = Math.round(vendor.ratingAverage);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScreenStatusBar backgroundColor={colors.white} barStyle="dark-content" />
      <SubScreenHeader title="Reviews & Ratings" onBack={() => navigation.goBack()} />

      <View style={styles.body}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.ratingSummaryCard}>
            <View style={styles.ratingSummaryLeft}>
              <Text style={styles.bigRating}>
                {vendor.ratingCount > 0 ? vendor.ratingAverage.toFixed(1) : '—'}
              </Text>
              <View style={styles.starsRow}>
                {[1, 2, 3, 4, 5].map(star => (
                  <Icon
                    key={star}
                    name={star <= roundedAverage && vendor.ratingCount > 0 ? 'star' : 'star-outline'}
                    size={14}
                    color={colors.star}
                  />
                ))}
              </View>
              <Text style={styles.reviewCountText}>
                {vendor.ratingCount > 0 ? `${vendor.ratingCount} reviews` : 'reviews'}
              </Text>
            </View>
            <View style={styles.ratingSummaryRight}>
              {[5, 4, 3, 2, 1].map(star => (
                <RatingBar
                  key={star}
                  stars={star}
                  count={starBreakdown[star - 1]}
                  total={vendor.ratingCount}
                />
              ))}
            </View>
          </View>

          {reviews.map(review => (
            <ReviewCard key={review.id} review={review} />
          ))}
          {reviews.length === 0 ? <Text style={styles.emptyText}>No reviews yet.</Text> : null}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}