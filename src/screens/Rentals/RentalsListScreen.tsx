import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  FlatList,
  Image,
  Modal,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { Bath, Bed, Search, SlidersHorizontal, Star, X } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';
import { colors } from '../../styles';
import MainScreenLayout from '../../components/layout/MainScreenLayout';
import SubScreenHeader from '../../components/layout/SubScreenHeader';
import WishlistHeart from '../../components/commerce/WishlistHeart';
import LoadingState from '../../components/ui/LoadingState';
import ErrorState from '../../components/ui/ErrorState';
import { servicesApi, type ApiRentalTerm, type ApiServiceListing } from '../../services/catalogApi';
import { getNearMeCoords } from '../../utils/nearMe';
import { normalizeRentalTerms, RENTAL_TERMS, rentalTermSpacing, RentalTermPills } from './rentalTerms';
import { styles } from './styles';

type Props = NativeStackScreenProps<RootStackParamList, 'RentalsList'>;

/** One API listing in the fields this card renders. */
export type RentalProperty = {
  id: string;
  name: string;
  image: string | null;
  rating: number;
  reviews: number;
  location: string;
  beds: number;
  baths: number;
  type: string;
  price: number;
  poweredByDoHuub: boolean;
  rentalTerms: ApiRentalTerm[];
};

export function toProperty(l: ApiServiceListing): RentalProperty {
  const d = l.rentalDetail ?? ({} as NonNullable<ApiServiceListing['rentalDetail']>);
  return {
    id: l.id,
    name: l.name ?? '',
    image: l.image ?? l.gallery?.[0] ?? null,
    rating: Number(l.store?.ratingAverage ?? 0),
    reviews: Number(l.store?.ratingCount ?? 0),
    // A property's own region, not the store's city — the business may be
    // registered nowhere near the place it rents out.
    location:
      d.region || [l.store?.city, l.store?.state].filter(Boolean).join(', ') || '',
    beds: Number(d.bedrooms ?? 0),
    baths: Number(d.bathrooms ?? 0),
    type: d.propertyType || 'Property',
    price: Number(d.pricePerNight ?? l.price ?? 0),
    poweredByDoHuub: Boolean(l.vendor?.poweredByDoHuub),
    rentalTerms: normalizeRentalTerms(d.rentalTerms),
  };
}

const PROPERTY_TYPES = ['All', 'Apartment', 'House', 'Studio', 'Villa'];
const BEDROOMS = ['Any', '1', '2', '3', '4+'];
const BATHROOMS = ['Any', '1', '2', '3+'];
const PRICES = ['Any', 'Under $100', '$100-$200', '$200-$300', 'Over $300'];
const TEAL_GRADIENT = ['#14B8A6', '#0694A2'];

/** Teal pill for the selected chip and the primary sheet button. */
function TealFill({ radius }: { radius: number }) {
  return (
    <LinearGradient
      colors={TEAL_GRADIENT}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[StyleSheet.absoluteFill, { borderRadius: radius }]}
    />
  );
}

/**
 * Every rental property a vendor has published.
 *
 * `?kind=rental` asks the API for one category, and each listing arrives with
 * its own bedrooms, bathrooms and nightly rate from the rental detail row —
 * so the card shows what the vendor actually entered. Search and filters run
 * over that loaded page on the device.
 */
export default function RentalsListScreen({ navigation }: Props) {
  const [items, setItems] = useState<RentalProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [type, setType] = useState('All');
  const [beds, setBeds] = useState('Any');
  const [baths, setBaths] = useState('Any');
  const [price, setPrice] = useState('Any');
  const [term, setTerm] = useState<'all' | ApiRentalTerm>('all');

  // The rental type is filtered by the API (`rentalTerm`), and the list is
  // limited to properties near the selected / default address like the PWA.
  const load = useCallback(async () => {
    setError(null);
    try {
      const { items: rows } = await servicesApi.list({
        kind: 'rental',
        limit: 60,
        ...(term !== 'all' ? { rentalTerm: term } : {}),
        ...getNearMeCoords(),
      });
      setItems(rows.map(toProperty));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load properties');
    }
  }, [term]);

  useEffect(() => {
    load().finally(() => setLoading(false));
  }, [load]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, [load]);

  const activeFilters = [
    term !== 'all',
    type !== 'All',
    beds !== 'Any',
    baths !== 'Any',
    price !== 'Any',
  ].filter(Boolean).length;

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items
      .filter(p => {
        if (q && !p.name.toLowerCase().includes(q) && !p.location.toLowerCase().includes(q)) {
          return false;
        }
        // Also checked here so the list is right before the refetch lands.
        if (term !== 'all' && !p.rentalTerms.includes(term)) return false;
        if (type !== 'All' && p.type !== type) return false;
        if (beds !== 'Any' && (beds === '4+' ? p.beds < 4 : p.beds !== Number(beds))) return false;
        if (baths !== 'Any' && (baths === '3+' ? p.baths < 3 : p.baths !== Number(baths))) {
          return false;
        }
        if (price === 'Under $100' && p.price >= 100) return false;
        if (price === '$100-$200' && (p.price < 100 || p.price > 200)) return false;
        if (price === '$200-$300' && (p.price < 200 || p.price > 300)) return false;
        if (price === 'Over $300' && p.price <= 300) return false;
        return true;
      })
      // Powered by DoHuub properties lead, as in the design.
      .sort((a, b) => Number(b.poweredByDoHuub) - Number(a.poweredByDoHuub));
  }, [items, search, term, type, beds, baths, price]);

  const clearFilters = () => {
    setTerm('all');
    setType('All');
    setBeds('Any');
    setBaths('Any');
    setPrice('Any');
  };

  const chipRow = (label: string, options: string[], value: string, setValue: (v: string) => void) => (
    <View>
      <Text style={styles.sheetLabel}>{label}</Text>
      <View style={styles.chips}>
        {options.map(o => {
          const active = o === value;
          return (
            <TouchableOpacity
              key={o}
              style={[styles.chip, active && styles.chipActive]}
              onPress={() => setValue(o)}
              activeOpacity={0.8}
            >
              {active ? <TealFill radius={999} /> : null}
              <Text style={[styles.chipText, active && styles.chipTextActive]}>{o}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  const termOptions: { value: 'all' | ApiRentalTerm; label: string }[] = [
    { value: 'all', label: 'All' },
    ...RENTAL_TERMS,
  ];
  const termRow = (
    <View>
      <Text style={styles.sheetLabel}>Rental Type</Text>
      <View style={styles.chips}>
        {termOptions.map(o => {
          const active = o.value === term;
          return (
            <TouchableOpacity
              key={o.value}
              testID={`rental-term-${o.value}`}
              style={[styles.chip, active && styles.chipActive]}
              onPress={() => setTerm(o.value)}
              activeOpacity={0.8}
              accessibilityState={{ selected: active }}
            >
              {active ? <TealFill radius={999} /> : null}
              <Text style={[styles.chipText, active && styles.chipTextActive]}>{o.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  const renderItem = ({ item }: { item: RentalProperty }) => (
    <Pressable
      style={styles.card}
      onPress={() => navigation.navigate('RentalDetail', { propertyId: item.id })}
      accessibilityRole="button"
      accessibilityLabel={`${item.name}, ${item.beds} bed, $${item.price} per night`}
    >
      <View style={styles.imageWrap}>
        {item.image ? (
          <Image source={{ uri: item.image }} style={styles.image} resizeMode="cover" />
        ) : (
          <View style={styles.imageEmpty}>
            <Icon name="home-outline" size={30} color={colors.textSecondary} />
          </View>
        )}
        {item.poweredByDoHuub ? (
          <View style={styles.poweredBadge}>
            <LinearGradient
              colors={[colors.gradientStart, colors.gradientEnd]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
            <Text style={styles.poweredBadgeText}>Powered by DoHuub</Text>
          </View>
        ) : null}
        {/* Top-left: the Powered by DoHuub badge owns the top-right corner. */}
        <WishlistHeart serviceId={item.id} floating style={styles.heartTopLeft} />
      </View>

      <View style={styles.cardBody}>
        <View style={styles.nameRow}>
          <View style={styles.fill}>
            <Text style={styles.name} numberOfLines={1}>
              {item.name}
            </Text>
            {item.location ? (
              <Text style={styles.location} numberOfLines={1}>
                {item.location}
              </Text>
            ) : null}
          </View>
          <View style={styles.rating}>
            <Star size={16} color={colors.star} fill={colors.star} />
            <Text style={styles.ratingValue}>{item.rating.toFixed(1)}</Text>
            <Text style={styles.reviews}>({item.reviews})</Text>
          </View>
        </View>

        <View style={styles.metaRow}>
          <View style={styles.meta}>
            <Bed size={16} color={colors.textSecondary} />
            <Text style={styles.metaText}>{item.beds} bed</Text>
          </View>
          <View style={styles.meta}>
            <Bath size={16} color={colors.textSecondary} />
            <Text style={styles.metaText}>{item.baths} bath</Text>
          </View>
          <Text style={styles.metaText}>• {item.type}</Text>
        </View>

        <RentalTermPills terms={item.rentalTerms} style={rentalTermSpacing.card} />

        <Text style={styles.price}>
          ${item.price}
          <Text style={styles.priceUnit}> / night</Text>
        </Text>
      </View>
    </Pressable>
  );

  return (
    <MainScreenLayout edges={['top']}>
      <SubScreenHeader
        title="Rental Properties"
        onBack={() => navigation.goBack()}
        right={
          <TouchableOpacity
            testID="rentals-filter-button"
            style={styles.filterBtn}
            onPress={() => setShowFilters(true)}
            accessibilityLabel="Filters"
            hitSlop={6}
          >
            <SlidersHorizontal size={20} color={colors.text} />
            {activeFilters > 0 ? (
              <View style={styles.filterCount}>
                <Text style={styles.filterCountText}>{activeFilters}</Text>
              </View>
            ) : null}
          </TouchableOpacity>
        }
      />

      <View style={styles.searchWrap}>
        <Search size={20} color={colors.textSecondary} />
        <TextInput
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
          placeholder="Search properties..."
          placeholderTextColor={colors.textFaint}
          returnKeyType="search"
          autoCorrect={false}
        />
        {search ? (
          <TouchableOpacity onPress={() => setSearch('')} hitSlop={8} accessibilityLabel="Clear search">
            <X size={18} color={colors.textSecondary} />
          </TouchableOpacity>
        ) : null}
      </View>

      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState message={error} onRetry={() => load()} />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={i => i.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          keyboardShouldPersistTaps="handled"
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListHeaderComponent={
            items.length ? (
              <Text style={styles.count}>
                {filtered.length} {filtered.length === 1 ? 'property' : 'properties'} available
              </Text>
            ) : null
          }
          ListEmptyComponent={
            <View style={styles.empty}>
              <Icon name="home-outline" size={36} color={colors.textFaint} />
              <Text style={styles.emptyTitle}>
                {/* The rental-type filter is applied server-side, so an empty page can
                    still mean "filtered out" rather than "nothing listed". */}
                {items.length || activeFilters || search.trim() ? 'No matching properties' : 'No properties yet'}
              </Text>
              <Text style={styles.emptyText}>
                {items.length || activeFilters || search.trim()
                  ? 'Try a different search or clear your filters.'
                  : 'There are no rental properties listed right now. Check back soon.'}
              </Text>
            </View>
          }
        />
      )}

      <Modal
        visible={showFilters}
        transparent
        animationType="slide"
        onRequestClose={() => setShowFilters(false)}
      >
        <Pressable style={styles.sheetBackdrop} onPress={() => setShowFilters(false)} />
        <SafeAreaView edges={['bottom']} style={styles.sheet}>
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>Filters</Text>
            <TouchableOpacity
              style={styles.sheetClose}
              onPress={() => setShowFilters(false)}
              accessibilityLabel="Close filters"
            >
              <X size={20} color={colors.text} />
            </TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={styles.sheetBody}>
            {termRow}
            {chipRow('Property Type', PROPERTY_TYPES, type, setType)}
            {chipRow('Bedrooms', BEDROOMS, beds, setBeds)}
            {chipRow('Bathrooms', BATHROOMS, baths, setBaths)}
            {chipRow('Price per Night', PRICES, price, setPrice)}

            {activeFilters > 0 ? (
              <TouchableOpacity style={styles.clearBtn} onPress={clearFilters} activeOpacity={0.8}>
                <Text style={styles.clearText}>Clear All Filters</Text>
              </TouchableOpacity>
            ) : null}

            <TouchableOpacity
              testID="rentals-filter-apply"
              style={styles.applyBtn}
              onPress={() => setShowFilters(false)}
              activeOpacity={0.85}
            >
              <TealFill radius={12} />
              <Text style={styles.applyText}>Show {filtered.length} Properties</Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </MainScreenLayout>
  );
}
