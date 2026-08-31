import React, { useEffect, useMemo, useState } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
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
import type { ApiVendorDetail } from '../../services/catalogApi';
import { groupOpeningHours } from '../../utils/hours';
import ServiceCard from './components/ServiceCard';
import VendorInfoRow from './components/VendorInfoRow';
import OperatingHoursCard from './components/OperatingHoursCard';
import RatingBar from './components/RatingBar';
import ReviewCard from './components/ReviewCard';
import { formatServiceArea } from './format';
import { styles } from './styles';

type Props = NativeStackScreenProps<RootStackParamList, 'Vendor'>;

const EMPTY_BREAKDOWN = [0, 0, 0, 0, 0];

function breakdownFromApi(starBreakdown: StarBreakdown | null | undefined): number[] {
  if (!starBreakdown) return EMPTY_BREAKDOWN;
  return [1, 2, 3, 4, 5].map(star => {
    const key = String(star) as keyof StarBreakdown;
    return starBreakdown[key] ?? 0;
  });
}

function breakdownFromReviews(vendor: ApiVendorDetail): number[] {
  const counts = [0, 0, 0, 0, 0];
  vendor.reviews.forEach(review => {
    const index = Math.round(review.stars) - 1;
    if (index >= 0 && index < 5) counts[index] += 1;
  });
  return counts;
}

export default function VendorScreen({ navigation, route }: Props) {
  const getVendor = useCatalogStore(state => state.getVendor);
  const [vendor, setVendor] = useState<ApiVendorDetail | null>(null);
  const [starBreakdown, setStarBreakdown] = useState<number[]>(EMPTY_BREAKDOWN);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    setError(null);
    Promise.all([
      getVendor(route.params.vendorId),
      reviewsApi.list({ vendorId: route.params.vendorId, limit: 1 }).catch(() => null),
    ])
      .then(([detail, reviewsPage]) => {
        setVendor(detail);
        setStarBreakdown(
          reviewsPage?.starBreakdown
            ? breakdownFromApi(reviewsPage.starBreakdown)
            : breakdownFromReviews(detail),
        );
      })
      .catch(err => setError((err as Error).message))
      .finally(() => setLoading(false));
  };

  useEffect(load, [route.params.vendorId]);

  const hoursRows = useMemo(() => groupOpeningHours(vendor?.openingHours), [vendor]);
  const previewReviews = vendor?.reviews.slice(0, 3) ?? [];

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <SubScreenHeader title="Vendor Profile" onBack={() => navigation.goBack()} />
        <LoadingState />
      </SafeAreaView>
    );
  }

  if (error || !vendor) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <SubScreenHeader title="Vendor Profile" onBack={() => navigation.goBack()} />
        <ErrorState message={error ?? 'Vendor not found.'} onRetry={load} />
      </SafeAreaView>
    );
  }

  const roundedAverage = Math.round(vendor.ratingAverage);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScreenStatusBar backgroundColor={colors.white} barStyle="dark-content" />
      <SubScreenHeader title="Vendor Profile" onBack={() => navigation.goBack()} />

      <View style={styles.body}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.profileHead}>
            {vendor.user.image ? (
              <Image source={{ uri: vendor.user.image }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarFallback}>
                <Icon name="sparkles" size={32} color={colors.primary} />
              </View>
            )}
            <Text style={styles.vendorName}>{vendor.businessName}</Text>
            {vendor.poweredByDoHuub ? (
              <LinearGradient
                colors={[colors.gradientStart, colors.gradientEnd]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.badge}
              >
                <Text style={styles.badgeText}>Powered by DoHuub</Text>
              </LinearGradient>
            ) : null}
            <View style={styles.ratingRow}>
              {vendor.ratingCount > 0 ? (
                <>
                  <Icon name="star" size={18} color={colors.star} />
                  <Text style={styles.ratingValue}>{vendor.ratingAverage.toFixed(1)}</Text>
                </>
              ) : (
                <Text style={styles.noRating}>No reviews yet</Text>
              )}
            </View>
          </View>

          {vendor.bio ? (
            <View style={styles.aboutCard}>
              <Text style={styles.cardTitle}>About</Text>
              <Text style={styles.aboutText}>{vendor.bio}</Text>
            </View>
          ) : null}

          <Text style={styles.sectionTitle}>Service Information</Text>
          <VendorInfoRow
            icon="location-outline"
            label="Service Area"
            value={formatServiceArea(vendor)}
          />
          <OperatingHoursCard rows={hoursRows} />

          <Text style={[styles.sectionTitle, styles.sectionBlock]}>Services Offered</Text>
          {vendor.services.length === 0 ? (
            <Text style={styles.emptyText}>No services listed yet.</Text>
          ) : (
            vendor.services.map(service => (
              <ServiceCard
                key={service.id}
                service={service}
                ratingAverage={vendor.ratingAverage}
                ratingCount={vendor.ratingCount}
                onPress={() =>
                  navigation.navigate('ServiceDetails', {
                    vendorId: vendor.id,
                    serviceId: service.id,
                  })
                }
              />
            ))
          )}

          <View style={[styles.reviewsHeader, styles.sectionBlock]}>
            <Text style={[styles.sectionTitle, styles.reviewsTitle]}>Reviews & Ratings</Text>
            <TouchableOpacity
              style={styles.viewAll}
              activeOpacity={0.7}
              onPress={() => navigation.navigate('VendorReviews', { vendorId: vendor.id })}
            >
              <Text style={styles.viewAllText}>View All</Text>
              <Icon name="chevron-forward" size={16} color={colors.primary} />
            </TouchableOpacity>
          </View>

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

          {previewReviews.map(review => (
            <ReviewCard key={review.id} review={review} />
          ))}
          {previewReviews.length === 0 ? (
            <Text style={styles.emptyText}>No reviews yet.</Text>
          ) : null}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}