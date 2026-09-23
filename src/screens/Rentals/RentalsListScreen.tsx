import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, Image, Pressable, RefreshControl, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';
import { colors } from '../../styles';
import SubScreenHeader from '../../components/layout/SubScreenHeader';
import LoadingState from '../../components/ui/LoadingState';
import ErrorState from '../../components/ui/ErrorState';
import { servicesApi, type ApiServiceListing } from '../../services/catalogApi';
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
  };
}

/**
 * Every rental property a vendor has published.
 *
 * `?kind=rental` asks the API for one category, and each listing arrives with
 * its own bedrooms, bathrooms and nightly rate from the rental detail row —
 * so the card shows what the vendor actually entered.
 */
export default function RentalsListScreen({ navigation }: Props) {
  const [items, setItems] = useState<RentalProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      const { items: rows } = await servicesApi.list({ kind: 'rental', limit: 60 });
      setItems(rows.map(toProperty));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load properties');
    }
  }, []);

  useEffect(() => {
    load().finally(() => setLoading(false));
  }, [load]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, [load]);

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
          <Text style={styles.poweredBadge}>Powered by DoHuub</Text>
        ) : null}
      </View>

      <View style={styles.cardBody}>
        <View style={styles.nameRow}>
          <Text style={styles.name} numberOfLines={2}>
            {item.name}
          </Text>
          <View style={styles.rating}>
            <Icon name="star" size={14} color="#F5B914" />
            <Text style={styles.ratingValue}>{item.rating.toFixed(1)}</Text>
            <Text style={styles.reviews}>({item.reviews})</Text>
          </View>
        </View>

        {item.location ? (
          <Text style={styles.location} numberOfLines={1}>
            {item.location}
          </Text>
        ) : null}

        <View style={styles.metaRow}>
          <View style={styles.meta}>
            <Icon name="bed-outline" size={15} color={colors.textSecondary} />
            <Text style={styles.metaText}>{item.beds} bed</Text>
          </View>
          <View style={styles.meta}>
            <Icon name="water-outline" size={15} color={colors.textSecondary} />
            <Text style={styles.metaText}>{item.baths} bath</Text>
          </View>
          <Text style={styles.metaText}>· {item.type}</Text>
        </View>

        <Text style={styles.price}>
          ${item.price}
          <Text style={styles.priceUnit}> / night</Text>
        </Text>
      </View>
    </Pressable>
  );

  return (
    <View style={styles.screen}>
      <SubScreenHeader title="Rental Properties" onBack={() => navigation.goBack()} />

      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState message={error} onRetry={() => load()} />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(i) => i.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListHeaderComponent={
            items.length ? (
              <Text style={styles.count}>
                {items.length} {items.length === 1 ? 'property' : 'properties'} available
              </Text>
            ) : null
          }
          ListEmptyComponent={
            <View style={styles.empty}>
              <Icon name="home-outline" size={36} color={colors.textFaint} />
              <Text style={styles.emptyTitle}>No properties yet</Text>
              <Text style={styles.emptyText}>
                There are no rental properties listed right now. Check back soon.
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}
