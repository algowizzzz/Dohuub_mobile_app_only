import React, { useCallback, useEffect, useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import {
  Bath,
  Bed,
  Car,
  CheckCircle2,
  ChevronRight,
  Dumbbell,
  Gift,
  MapPin,
  Maximize,
  Shirt,
  Star,
  Tv,
  Users,
  UtensilsCrossed,
  Waves,
  Wifi,
  Wind,
  type LucideIcon,
} from 'lucide-react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';
import { colors } from '../../styles';
import MainScreenLayout from '../../components/layout/MainScreenLayout';
import SubScreenHeader from '../../components/layout/SubScreenHeader';
import WishlistHeart from '../../components/commerce/WishlistHeart';
import LoadingState from '../../components/ui/LoadingState';
import ErrorState from '../../components/ui/ErrorState';
import ReviewPhotos from '../../components/ui/ReviewPhotos';
import Price from '../../components/ui/Price';
import { pointsRateText } from '../../components/ui/EarnPointsCard';
import { servicesApi, type ApiServiceListing } from '../../services/catalogApi';
import { reviewsApi, type ApiReview } from '../../services/reviewApi';
import { requireAuth } from '../../hooks/useRequireAuth';
import { normalizeRentalTerms, rentalTermSpacing, RentalTermPills } from './rentalTerms';
import { abbreviateName, formatRelativeTime } from '../../utils/relativeTime';
import { styles } from './styles';

type Props = NativeStackScreenProps<RootStackParamList, 'RentalDetail'>;

type PropertyDetail = {
  id: string;
  name: string;
  photos: string[];
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
  currency: string;
  pointsPerDollar: number;
  pricePerWeek: number | null;
  pricePerMonth: number | null;
  cleaningFee: number | null;
  serviceFee: number | null;
  amenities: string[];
  houseRules: string[];
  about: string;
  vendorId: string;
  host: string;
  hostPhoto: string | null;
  hostLine: string;
  poweredByDoHuub: boolean;
  rentalTerms: string[];
};

function toDetail(l: ApiServiceListing): PropertyDetail {
  const d = l.rentalDetail ?? ({} as NonNullable<ApiServiceListing['rentalDetail']>);
  return {
    id: l.id,
    name: l.name ?? '',
    photos: Array.from(new Set([l.image, ...(l.gallery ?? [])].filter((u): u is string => !!u))),
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
    currency: l.currency || 'USD',
    pointsPerDollar: Number(l.pointsPerDollar) || 0,
    pricePerWeek: d.pricePerWeek != null ? Number(d.pricePerWeek) : null,
    pricePerMonth: d.pricePerMonth != null ? Number(d.pricePerMonth) : null,
    cleaningFee: d.cleaningFee != null ? Number(d.cleaningFee) : null,
    serviceFee: d.serviceFee != null ? Number(d.serviceFee) : null,
    amenities: d.amenities ?? [],
    // Vendors type rules one per line, often with their own bullet.
    houseRules: (d.houseRules ?? '')
      .split(/\r?\n/)
      .map(r => r.replace(/^\s*[-•*]\s*/, '').trim())
      .filter(Boolean),
    about: l.longDescription || l.description || l.shortDescription || '',
    vendorId: l.vendor?.id ?? '',
    host: l.vendor?.businessName || l.store?.name || 'DoHuub',
    hostPhoto: l.store?.image || l.vendor?.user?.image || null,
    hostLine: l.store?.name || 'Professional property management',
    poweredByDoHuub: Boolean(l.vendor?.poweredByDoHuub),
    rentalTerms: normalizeRentalTerms(d.rentalTerms),
  };
}

const TEAL = '#14B8A6';

/** Best-effort icon for a free-text amenity the vendor typed. */
function amenityIcon(name: string): LucideIcon {
  const n = name.toLowerCase();
  if (n.includes('wifi') || n.includes('wi-fi') || n.includes('internet')) return Wifi;
  if (n.includes('kitchen')) return UtensilsCrossed;
  if (/\bac\b/.test(n) || n.includes('air con') || n.includes('heat')) return Wind;
  if (n.includes('tv') || n.includes('television')) return Tv;
  if (n.includes('wash') || n.includes('laundry') || n.includes('dryer')) return Shirt;
  if (n.includes('parking') || n.includes('garage')) return Car;
  if (n.includes('pool')) return Waves;
  if (n.includes('gym')) return Dumbbell;
  return CheckCircle2;
}

/**
 * A gradient behind content. The gradient fills an ordinary view instead of
 * being the container: react-native-linear-gradient mis-draws its own border
 * and padding on iOS, which showed up as a doubled, offset box.
 */
function GradientBox({
  colors: stops,
  style,
  children,
}: {
  colors: string[];
  style: React.ComponentProps<typeof View>['style'];
  children: React.ReactNode;
}) {
  return (
    <View style={[style, styles.gradientClip]}>
      <LinearGradient
        colors={stops}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      {children}
    </View>
  );
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
  const { width } = useWindowDimensions();
  const [property, setProperty] = useState<PropertyDetail | null>(null);
  const [reviews, setReviews] = useState<ApiReview[]>([]);
  const [photoIndex, setPhotoIndex] = useState(0);
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
    // Reviews are a nice-to-have; a failure here must not hide the property.
    reviewsApi
      .list({ serviceId: propertyId, limit: 3 })
      .then(r => setReviews(r.items))
      .catch(() => setReviews([]));
  }, [propertyId]);

  useEffect(() => {
    load().finally(() => setLoading(false));
  }, [load]);

  if (loading) {
    return (
      <MainScreenLayout edges={['top', 'bottom']}>
        <SubScreenHeader title="Property Details" onBack={() => navigation.goBack()} />
        <LoadingState />
      </MainScreenLayout>
    );
  }

  if (error || !property) {
    return (
      <MainScreenLayout edges={['top', 'bottom']}>
        <SubScreenHeader title="Property Details" onBack={() => navigation.goBack()} />
        <ErrorState message={error ?? 'Property not found'} onRetry={() => load()} />
      </MainScreenLayout>
    );
  }

  const p = property;

  const stats: Array<{ Icon: LucideIcon; value: string; label: string }> = [
    { Icon: Bed, value: String(p.beds), label: 'Bedrooms' },
    { Icon: Bath, value: String(p.baths), label: 'Bathrooms' },
    { Icon: Users, value: String(p.guests), label: 'Max Guests' },
    ...(p.area != null ? [{ Icon: Maximize, value: `${p.area} ${p.areaUnit}`, label: 'Area' }] : []),
  ];

  const onPhotoScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) =>
    setPhotoIndex(Math.round(e.nativeEvent.contentOffset.x / width));

  const openHost = p.vendorId
    ? () => navigation.navigate('Vendor', { vendorId: p.vendorId })
    : undefined;

  return (
    <MainScreenLayout edges={['top', 'bottom']}>
      <SubScreenHeader
        title="Property Details"
        onBack={() => navigation.goBack()}
        right={<WishlistHeart serviceId={propertyId} variant="plain" size={22} />}
      />

      <ScrollView contentContainerStyle={styles.detailScroll}>
        <View style={styles.hero}>
          {p.photos.length ? (
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={onPhotoScroll}
            >
              {p.photos.map(uri => (
                <Image key={uri} source={{ uri }} style={[styles.heroImage, { width }]} resizeMode="cover" />
              ))}
            </ScrollView>
          ) : (
            <View style={styles.imageEmpty}>
              <Icon name="home-outline" size={34} color={colors.textSecondary} />
            </View>
          )}
          {p.poweredByDoHuub ? (
            <GradientBox colors={[colors.gradientStart, colors.gradientEnd]} style={styles.heroBadge}>
              <Text style={styles.heroBadgeText}>Powered by DoHuub</Text>
            </GradientBox>
          ) : null}
          {p.photos.length > 1 ? (
            <View style={styles.dots}>
              {p.photos.map((uri, i) => (
                <View key={uri} style={[styles.dot, i === photoIndex && styles.dotActive]} />
              ))}
            </View>
          ) : null}
        </View>

        <View style={styles.detailBody}>
          <View>
            <View style={styles.nameRow}>
              <Text style={styles.detailTitle}>{p.name}</Text>
              <View style={styles.rating}>
                <Star size={20} color={colors.star} fill={colors.star} />
                <Text style={styles.detailRatingValue}>{p.rating.toFixed(1)}</Text>
                <Text style={styles.detailReviews}>({p.reviews})</Text>
              </View>
            </View>
            {p.location ? (
              <View style={styles.detailMeta}>
                <MapPin size={16} color={colors.textSecondary} />
                <Text style={styles.detailLocation}>{p.location}</Text>
              </View>
            ) : null}
            <RentalTermPills terms={p.rentalTerms} style={rentalTermSpacing.detail} />
          </View>

          {/* Only programme vendors award points, so only they promise them. */}
          {p.poweredByDoHuub ? (
            <GradientBox
              colors={['rgba(245, 158, 11, 0.1)', 'rgba(249, 115, 22, 0.1)']}
              style={styles.pointsBanner}
            >
              <View style={styles.pointsIcon}>
                <Gift size={20} color="#F59E0B" />
              </View>
              <View style={styles.fill}>
                <Text style={styles.pointsTitle}>Earn points on this booking</Text>
                <Text style={styles.pointsBody}>
                  {pointsRateText(p.pointsPerDollar, p.currency)} • Points added after checkout
                </Text>
              </View>
            </GradientBox>
          ) : null}

          <TouchableOpacity
            style={[styles.whiteCard, styles.hostCard]}
            activeOpacity={0.8}
            disabled={!openHost}
            onPress={openHost}
          >
            {p.hostPhoto ? (
              <Image source={{ uri: p.hostPhoto }} style={styles.hostAvatar} resizeMode="cover" />
            ) : (
              <View style={styles.hostAvatar}>
                <Icon name="person" size={24} color={colors.primary} />
              </View>
            )}
            <View style={styles.fill}>
              <Text style={styles.hostName}>Hosted by {p.host}</Text>
              <Text style={styles.hostLine}>{p.hostLine}</Text>
            </View>
            {openHost ? (
              <ChevronRight size={20} color={colors.textSecondary} />
            ) : null}
          </TouchableOpacity>

          <View style={styles.statGrid}>
            {stats.map(({ Icon: StatIcon, value, label }) => (
              <View key={label} style={[styles.whiteCard, styles.statCell]}>
                <StatIcon size={24} color={TEAL} strokeWidth={2} />
                <View>
                  <Text style={styles.statValue}>{value}</Text>
                  <Text style={styles.statLabel}>{label}</Text>
                </View>
              </View>
            ))}
          </View>

          <GradientBox
            colors={['rgba(20, 184, 166, 0.1)', 'rgba(6, 148, 162, 0.1)']}
            style={styles.pricingCard}
          >
            <Text style={[styles.sectionTitle, styles.pricingTitle]}>Pricing</Text>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Per Night</Text>
              <Price amount={p.price} currency={p.currency} style={styles.priceValue} align="right" compact />
            </View>
            {/* Long-stay rates are optional; only the ones the vendor set show. */}
            {p.pricePerWeek != null ? (
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Per Week</Text>
                <Price amount={p.pricePerWeek} currency={p.currency} style={styles.priceValueDark} align="right" compact />
              </View>
            ) : null}
            {p.pricePerMonth != null ? (
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Per Month</Text>
                <Price amount={p.pricePerMonth} currency={p.currency} style={styles.priceValueDark} align="right" compact />
              </View>
            ) : null}
            {/* Fees are optional per property; a blank one shows nothing rather
                than a misleading "$0". */}
            {p.cleaningFee != null ? (
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Cleaning Fee</Text>
                <Price amount={p.cleaningFee} currency={p.currency} style={styles.priceValueDark} align="right" compact />
              </View>
            ) : null}
            {p.serviceFee != null ? (
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Service Fee</Text>
                <Price amount={p.serviceFee} currency={p.currency} style={styles.priceValueDark} align="right" compact />
              </View>
            ) : null}
          </GradientBox>

          {p.amenities.length ? (
            <View>
              <Text style={styles.sectionTitle}>Amenities</Text>
              <View style={styles.amenityGrid}>
                {p.amenities.map(a => {
                  const AmenityIcon = amenityIcon(a);
                  return (
                  <View key={a} style={[styles.whiteCard, styles.amenity]}>
                    <AmenityIcon size={20} color={TEAL} strokeWidth={2} />
                    <Text style={styles.amenityText}>{a}</Text>
                  </View>
                  );
                })}
              </View>
            </View>
          ) : null}

          {p.about ? (
            <View>
              <Text style={styles.sectionTitle}>Description</Text>
              <Text style={styles.about}>{p.about}</Text>
            </View>
          ) : null}

          {p.location ? (
            <View>
              <Text style={styles.sectionTitle}>Location</Text>
              <View style={styles.mapBox}>
                <MapPin size={32} color={colors.textSecondary} />
              </View>
              <Text style={styles.mapCaption}>{p.location}</Text>
            </View>
          ) : null}

          {p.houseRules.length ? (
            <View>
              <Text style={styles.sectionTitle}>House Rules</Text>
              <View style={styles.rules}>
                {p.houseRules.map((rule, i) => (
                  <View key={`${i}-${rule}`} style={styles.ruleRow}>
                    <View style={styles.ruleDot} />
                    <Text style={styles.ruleText}>{rule}</Text>
                  </View>
                ))}
              </View>
            </View>
          ) : null}

          {reviews.length ? (
            <View>
              <View style={styles.reviewsHeader}>
                <Text style={[styles.sectionTitle, styles.noMargin]}>Reviews</Text>
                {p.vendorId ? (
                  <TouchableOpacity
                    style={styles.viewAll}
                    onPress={() => navigation.navigate('VendorReviews', { vendorId: p.vendorId })}
                  >
                    <Text style={styles.viewAllText}>View All</Text>
                    <ChevronRight size={16} color={TEAL} />
                  </TouchableOpacity>
                ) : null}
              </View>
              <View style={styles.reviewList}>
                {reviews.map(r => {
                  const stars = Math.round(r.stars);
                  return (
                    <View key={r.id} style={[styles.whiteCard, styles.reviewCard]}>
                      <View style={styles.reviewTop}>
                        <Text style={styles.reviewName}>
                          {abbreviateName(r.author?.fullName || r.reviewerName || 'Guest')}
                        </Text>
                        <Text style={styles.reviewDate}>{formatRelativeTime(r.createdAt)}</Text>
                      </View>
                      <View style={styles.reviewStars}>
                        {[1, 2, 3, 4, 5].map(n => (
                          <Star
                            key={n}
                            size={16}
                            color={n <= stars ? colors.star : colors.border}
                            fill={n <= stars ? colors.star : 'transparent'}
                          />
                        ))}
                      </View>
                      {r.comment ? <Text style={styles.reviewComment}>{r.comment}</Text> : null}
                      <ReviewPhotos images={r.images} />
                    </View>
                  );
                })}
              </View>
            </View>
          ) : null}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          activeOpacity={0.85}
          disabled={!p.vendorId}
          testID="rental-check-availability"
          onPress={() => {
            // Booking needs an account: ask guests to sign in here, before
            // they spend time picking dates and guests.
            if (!requireAuth('Sign in to check availability and book this property.')) return;
            navigation.navigate('RentalDates', { propertyId: p.id });
          }}
        >
          <GradientBox
            colors={['#14B8A6', '#0694A2']}
            style={[styles.ctaButton, !p.vendorId && styles.ctaDisabled]}
          >
            <Text style={styles.ctaText}>Check Availability</Text>
          </GradientBox>
        </TouchableOpacity>
      </View>
    </MainScreenLayout>
  );
}
