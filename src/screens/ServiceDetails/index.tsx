import React, { useEffect, useState } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';
import { colors } from '../../styles';
import MainScreenLayout from '../../components/layout/MainScreenLayout';
import SubScreenHeader from '../../components/layout/SubScreenHeader';
import PrimaryButton from '../../components/ui/PrimaryButton';
import LoadingState from '../../components/ui/LoadingState';
import ErrorState from '../../components/ui/ErrorState';
import { useCatalogStore } from '../../store/catalogStore';
import type { ApiVendorDetail } from '../../services/catalogApi';
import { formatDurationMinutes } from '../../utils/duration';
import EarnPointsCard from '../../components/ui/EarnPointsCard';
import { styles } from './styles';

type Props = NativeStackScreenProps<RootStackParamList, 'ServiceDetails'>;

export default function ServiceDetailsScreen({ navigation, route }: Props) {
  const getVendor = useCatalogStore(state => state.getVendor);
  const [vendor, setVendor] = useState<ApiVendorDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    setError(null);
    getVendor(route.params.vendorId)
      .then(setVendor)
      .catch(err => setError((err as Error).message))
      .finally(() => setLoading(false));
  };

  useEffect(load, [route.params.vendorId]);

  if (loading) {
    return (
      <MainScreenLayout edges={['top', 'bottom']}>
        <SubScreenHeader title="Service Details" onBack={() => navigation.goBack()} />
        <LoadingState />
      </MainScreenLayout>
    );
  }

  const service = vendor?.services.find(item => item.id === route.params.serviceId);

  if (error || !vendor || !service) {
    return (
      <MainScreenLayout edges={['top', 'bottom']}>
        <SubScreenHeader title="Service Details" onBack={() => navigation.goBack()} />
        <ErrorState message={error ?? 'Service not found.'} onRetry={load} />
      </MainScreenLayout>
    );
  }

  const serviceReviews = vendor.reviews;
  const price = service.discountedPrice ?? service.price;

  return (
    <MainScreenLayout edges={['top', 'bottom']}>
      <SubScreenHeader title="Service Details" onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          {service.image ? (
            <Image source={{ uri: service.image }} style={styles.heroImage} resizeMode="cover" />
          ) : (
            <View style={styles.heroFallback}>
              <Icon name="image-outline" size={40} color={colors.textFaint} />
            </View>
          )}
        </View>

        <View style={styles.body}>
        <Text style={styles.name}>{service.name}</Text>
        <View style={styles.ratingRow}>
          {vendor.ratingCount > 0 ? (
            <>
              <Icon name="star" size={14} color={colors.starAlt} />
              <Text style={styles.ratingText}>
                {vendor.ratingAverage.toFixed(1)} ({vendor.ratingCount} reviews)
              </Text>
            </>
          ) : (
            <Text style={styles.noReviewsText}>No reviews yet</Text>
          )}
        </View>
        {service.description ? <Text style={styles.description}>{service.description}</Text> : null}

        <TouchableOpacity
          style={styles.vendorRow}
          activeOpacity={0.8}
          onPress={() => navigation.navigate('Vendor', { vendorId: vendor.id })}
        >
          <View style={styles.vendorIconWrap}>
            <Icon name="sparkles" size={18} color={colors.primary} />
          </View>
          <View style={styles.vendorInfo}>
            <Text style={styles.vendorName}>{vendor.businessName}</Text>
            <Text style={styles.vendorLocation}>
              {vendor.ratingCount > 0
                ? `${vendor.ratingAverage.toFixed(1)} (${vendor.ratingCount})`
                : 'No reviews yet'}
            </Text>
          </View>
          <Icon name="chevron-forward" size={18} color={colors.textMuted} />
        </TouchableOpacity>

        <EarnPointsCard pointsPerDollar={service.pointsPerDollar} />

        <View style={styles.pricingRow}>
          <View style={styles.pricingLabelRow}>
            <Icon name="cash-outline" size={18} color={colors.primary} />
            <Text style={styles.pricingLabel}>Pricing</Text>
          </View>
          <View style={styles.priceValueRow}>
            <Text style={styles.price}>${price}</Text>
            {service.discountedPrice ? (
              <Text style={styles.originalPrice}>${service.price}</Text>
            ) : null}
          </View>
        </View>

        {service.serviceTimeInMinutes ? (
          <View style={styles.pricingRow}>
            <View style={styles.pricingLabelRow}>
              <Icon name="time-outline" size={18} color={colors.primary} />
              <Text style={styles.pricingLabel}>Duration</Text>
            </View>
            <Text style={styles.durationValue}>
              {formatDurationMinutes(service.serviceTimeInMinutes)}
            </Text>
          </View>
        ) : null}

        <PrimaryButton
          label="Book Service"
          onPress={() =>
            navigation.navigate('BookService', { vendorId: vendor.id, serviceId: service.id })
          }
          style={styles.bookButton}
        />

        <View style={styles.reviewsHeader}>
          <Text style={styles.sectionTitle}>Reviews</Text>
          <TouchableOpacity onPress={() => navigation.navigate('VendorReviews', { vendorId: vendor.id })}>
            <View style={styles.viewAllRow}>
              <Text style={styles.viewAllText}>View All</Text>
              <Icon name="chevron-forward" size={14} color={colors.primary} />
            </View>
          </TouchableOpacity>
        </View>
        {serviceReviews.length === 0 ? (
          <Text style={styles.noReviewsText}>No reviews yet for this provider.</Text>
        ) : (
          <Text style={styles.noReviewsText}>
            {serviceReviews.length} review{serviceReviews.length === 1 ? '' : 's'} for this provider.
          </Text>
        )}
        </View>
      </ScrollView>
    </MainScreenLayout>
  );
}
