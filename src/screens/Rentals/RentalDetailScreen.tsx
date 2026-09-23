import React, { useCallback, useEffect, useState } from 'react';
import { Image, ScrollView, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';
import { colors } from '../../styles';
import SubScreenHeader from '../../components/layout/SubScreenHeader';
import LoadingState from '../../components/ui/LoadingState';
import ErrorState from '../../components/ui/ErrorState';
import PrimaryButton from '../../components/ui/PrimaryButton';
import { servicesApi, type ApiServiceListing } from '../../services/catalogApi';
import { styles } from './styles';

type Props = NativeStackScreenProps<RootStackParamList, 'RentalDetail'>;

type PropertyDetail = {
  id: string;
  name: string;
  image: string | null;
  location: string;
  rating: number;
  reviews: number;
  beds: number;
  baths: number;
  guests: number;
  area: number | null;
  areaUnit: string;
  type: string;
  price: number;
  cleaningFee: number | null;
  serviceFee: number | null;
  amenities: string[];
  houseRules: string;
  about: string;
  vendorId: string;
  host: string;
  hostLine: string;
  poweredByDoHuub: boolean;
};

function toDetail(l: ApiServiceListing): PropertyDetail {
  const d = l.rentalDetail ?? ({} as NonNullable<ApiServiceListing['rentalDetail']>);
  return {
    id: l.id,
    name: l.name ?? '',
    image: l.image ?? l.gallery?.[0] ?? null,
    location:
      d.region || [l.store?.city, l.store?.state].filter(Boolean).join(', ') || '',
    rating: Number(l.store?.ratingAverage ?? 0),
    reviews: Number(l.store?.ratingCount ?? 0),
    beds: Number(d.bedrooms ?? 0),
    baths: Number(d.bathrooms ?? 0),
    guests: Number(d.maxGuests ?? 0),
    area: d.totalArea != null ? Number(d.totalArea) : null,
    areaUnit: d.totalAreaUnit === 'sqm' ? 'm²' : 'ft²',
    type: d.propertyType || 'Property',
    price: Number(d.pricePerNight ?? l.price ?? 0),
    cleaningFee: d.cleaningFee != null ? Number(d.cleaningFee) : null,
    serviceFee: d.serviceFee != null ? Number(d.serviceFee) : null,
    amenities: d.amenities ?? [],
    houseRules: d.houseRules ?? '',
    about: l.longDescription || l.description || l.shortDescription || '',
    vendorId: l.vendor?.id ?? '',
    host: l.vendor?.businessName || l.store?.name || 'DoHuub',
    hostLine: l.store?.name || 'Professional property management',
    poweredByDoHuub: Boolean(l.vendor?.poweredByDoHuub),
  };
}

/**
 * One rental property.
 *
 * Everything below the photo comes from the rental detail row the vendor filled
 * in — bedrooms, amenities, house rules, the fee breakdown — so a guest sees
 * exactly what was published, and a property with no house rules simply shows
 * no house rules rather than an empty heading.
 */
export default function RentalDetailScreen({ navigation, route }: Props) {
  const { propertyId } = route.params;
  const [property, setProperty] = useState<PropertyDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      const res = await servicesApi.get(propertyId);
      setProperty(toDetail(res));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load this property');
    }
  }, [propertyId]);

  useEffect(() => {
    load().finally(() => setLoading(false));
  }, [load]);

  if (loading) {
    return (
      <View style={styles.screen}>
        <SubScreenHeader title="Property Details" onBack={() => navigation.goBack()} />
        <LoadingState />
      </View>
    );
  }

  if (error || !property) {
    return (
      <View style={styles.screen}>
        <SubScreenHeader title="Property Details" onBack={() => navigation.goBack()} />
        <ErrorState message={error ?? 'Property not found'} onRetry={() => load()} />
      </View>
    );
  }

  const p = property;

  const stats: Array<{ icon: string; value: string; label: string }> = [
    { icon: 'bed-outline', value: String(p.beds), label: 'Bedrooms' },
    { icon: 'water-outline', value: String(p.baths), label: 'Bathrooms' },
    { icon: 'people-outline', value: String(p.guests), label: 'Max Guests' },
    ...(p.area != null
      ? [{ icon: 'resize-outline', value: `${p.area} ${p.areaUnit}`, label: 'Area' }]
      : []),
  ];

  return (
    <View style={styles.screen}>
      <SubScreenHeader title="Property Details" onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.detailBody}>
        <View style={styles.hero}>
          {p.image ? (
            <Image source={{ uri: p.image }} style={styles.image} resizeMode="cover" />
          ) : (
            <View style={styles.imageEmpty}>
              <Icon name="home-outline" size={34} color={colors.textSecondary} />
            </View>
          )}
          {p.poweredByDoHuub ? (
            <Text style={styles.poweredBadge}>Powered by DoHuub</Text>
          ) : null}
        </View>

        <View style={styles.nameRow}>
          <Text style={styles.detailTitle}>{p.name}</Text>
          <View style={styles.rating}>
            <Icon name="star" size={15} color="#F5B914" />
            <Text style={styles.ratingValue}>{p.rating.toFixed(1)}</Text>
            <Text style={styles.reviews}>({p.reviews})</Text>
          </View>
        </View>

        {p.location ? (
          <View style={styles.meta}>
            <Icon name="location-outline" size={15} color={colors.textSecondary} />
            <Text style={styles.location}>{p.location}</Text>
          </View>
        ) : null}

        {/* Only programme vendors award points, so only they promise them. */}
        {p.poweredByDoHuub ? (
          <View style={styles.pointsBanner}>
            <Icon name="gift-outline" size={20} color="#B45309" />
            <View style={styles.fill}>
              <Text style={styles.pointsTitle}>Earn points on this booking</Text>
              <Text style={styles.pointsBody}>
                1 point per $1 spent • Points added after checkout
              </Text>
            </View>
          </View>
        ) : null}

        <View style={styles.hostCard}>
          <View style={styles.hostAvatar}>
            <Icon name="person-outline" size={20} color={colors.primary} />
          </View>
          <View style={styles.fill}>
            <Text style={styles.hostName}>Hosted by {p.host}</Text>
            <Text style={styles.hostLine}>{p.hostLine}</Text>
          </View>
        </View>

        <View style={styles.statGrid}>
          {stats.map((s) => (
            <View key={s.label} style={styles.statCell}>
              <Icon name={s.icon} size={20} color={colors.primary} />
              <View>
                <Text style={styles.statValue}>{s.value}</Text>
                <Text style={styles.statLabel}>{s.label}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.card2}>
          <Text style={styles.cardTitle}>Pricing</Text>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Per night</Text>
            <Text style={styles.priceValue}>${p.price}</Text>
          </View>
          {/* Fees are optional per property; a blank one shows nothing rather
              than a misleading "$0". */}
          {p.cleaningFee != null ? (
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Cleaning fee</Text>
              <Text style={styles.priceValue}>${p.cleaningFee}</Text>
            </View>
          ) : null}
          {p.serviceFee != null ? (
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Service fee</Text>
              <Text style={styles.priceValue}>${p.serviceFee}</Text>
            </View>
          ) : null}
        </View>

        {p.amenities.length ? (
          <View style={styles.card2}>
            <Text style={styles.cardTitle}>Amenities</Text>
            <View style={styles.amenityGrid}>
              {p.amenities.map((a) => (
                <View key={a} style={styles.amenity}>
                  <Icon name="checkmark-circle" size={16} color={colors.success} />
                  <Text style={styles.amenityText}>{a}</Text>
                </View>
              ))}
            </View>
          </View>
        ) : null}

        {p.about ? (
          <View style={styles.card2}>
            <Text style={styles.cardTitle}>Description</Text>
            <Text style={styles.about}>{p.about}</Text>
          </View>
        ) : null}

        {p.houseRules ? (
          <View style={styles.card2}>
            <Text style={styles.cardTitle}>House Rules</Text>
            <Text style={styles.about}>{p.houseRules}</Text>
          </View>
        ) : null}
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton
          label="Check Availability"
          disabled={!p.vendorId}
          onPress={() =>
            navigation.navigate('BookService', { vendorId: p.vendorId, serviceId: p.id })
          }
        />
      </View>
    </View>
  );
}
