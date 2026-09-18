import React, { useCallback, useState } from 'react';
import { Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';
import MainScreenLayout from '../../components/layout/MainScreenLayout';
import SubScreenHeader from '../../components/layout/SubScreenHeader';
import LoadingState from '../../components/ui/LoadingState';
import ErrorState from '../../components/ui/ErrorState';
import { colors } from '../../styles';
import { categoryBeauty, commerceFood, commerceGrocery } from '../../assets/images';
import { commerceApi, type ApiCommerceStore } from '../../services/commerceApi';
import { styles as serviceStyles } from '../Services/styles';
import { commerceStyles as styles } from './styles';

type Props = NativeStackScreenProps<RootStackParamList, 'CommerceStores'>;

function isPoweredByDohuub(store: ApiCommerceStore) {
  return Boolean(store.poweredByDoHuub);
}

export default function CommerceStoresScreen({ navigation, route }: Props) {
  const { kind } = route.params;
  const [query, setQuery] = useState('');
  const [stores, setStores] = useState<ApiCommerceStore[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fallbackImg = kind === 'beauty' ? categoryBeauty : kind === 'food' ? commerceFood : commerceGrocery;

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    commerceApi
      .listStores({ kind, limit: 50, ...(query.trim() ? { search: query.trim() } : {}) })
      .then(({ items }) => setStores(items))
      .catch(err => setError((err as Error).message))
      .finally(() => setLoading(false));
  }, [kind, query]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const title = kind === 'beauty' ? 'Beauty Products' : kind === 'food' ? 'Food Delivery' : 'Grocery Delivery';
  const subtitle =
    kind === 'beauty'
      ? 'Shop cosmetics, skincare and beauty essentials'
      : kind === 'food'
        ? 'Choose from top restaurants'
        : 'Shop from top stores near you';
  const searchPlaceholder =
    kind === 'beauty' ? 'Search beauty products...' : kind === 'food' ? 'Search restaurants...' : 'Search grocery stores...';

  return (
    <MainScreenLayout edges={['top', 'bottom']}>
      <SubScreenHeader title={title} subtitle={subtitle} onBack={() => navigation.goBack()} />
      {loading && stores.length === 0 ? (
        <LoadingState />
      ) : error && stores.length === 0 ? (
        <ErrorState message={error} onRetry={load} />
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={serviceStyles.searchWrap}>
            <Icon name="search" size={18} color={colors.textMuted} />
            <TextInput
              style={serviceStyles.searchInput}
              value={query}
              onChangeText={setQuery}
              placeholder={searchPlaceholder}
              placeholderTextColor={colors.textMuted}
            />
          </View>

          {stores.length === 0 ? (
            <View style={styles.emptyWrap}>
              <Icon name="search-outline" size={36} color={colors.textFaint} />
              <Text style={styles.emptyTitle}>No stores yet</Text>
              <Text style={styles.emptyText}>
                Check back soon for {kind === 'beauty' ? 'beauty stores' : kind === 'food' ? 'restaurants' : 'grocers'} near you
              </Text>
            </View>
          ) : (
            stores.map(store => {
              const min = store.deliveryMinutesMin ?? 25;
              const max = store.deliveryMinutesMax ?? 40;
              const eta = `${min}-${max} min`;
              const cuisine =
                (store.cuisineTags || []).slice(0, 2).join(' · ') ||
                (kind === 'beauty' ? 'Beauty products' : kind === 'food' ? 'Restaurant' : 'Grocery');
              const rating = Number(store.ratingAverage) || 0;
              const reviews = Number(store.ratingCount) || 0;
              const cover = store.coverImage || store.user?.image;

              return (
                <View key={store.id} style={styles.storeCard}>
                  <View style={styles.storeRow}>
                    <View style={[styles.storeTile, { backgroundColor: colors.muted }]}>
                      <Image
                        source={cover ? { uri: cover } : fallbackImg}
                        style={cover ? styles.storeTileImg : { width: 40, height: 40 }}
                        resizeMode={cover ? 'cover' : 'contain'}
                      />
                    </View>
                    <View style={styles.storeInfo}>
                      <View style={styles.nameRow}>
                        <Text style={styles.storeName}>{store.businessName}</Text>
                        {isPoweredByDohuub(store) ? (
                          <View style={styles.dohuubBadge}>
                            <Text style={styles.dohuubBadgeText}>DoHuub</Text>
                          </View>
                        ) : null}
                      </View>
                      <Text style={styles.storeLine}>{cuisine}</Text>
                      <View style={styles.metaRow}>
                        {reviews > 0 ? (
                          <View style={styles.metaItem}>
                            <Icon name="star" size={14} color={colors.star} />
                            <Text style={styles.metaValue}>{rating.toFixed(1)}</Text>
                          </View>
                        ) : (
                          <Text style={styles.reviews}>No reviews yet</Text>
                        )}
                        <View style={styles.metaItem}>
                          <Icon name="time-outline" size={14} color={colors.textMuted} />
                          <Text style={styles.metaValue}>{eta}</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                  <View style={styles.storeActions}>
                    <TouchableOpacity
                      style={[styles.primaryBtn, { backgroundColor: colors.primary }]}
                      onPress={() =>
                        navigation.navigate('CommerceMenu', { vendorId: store.id, kind })
                      }
                    >
                      <Text style={styles.primaryBtnText}>
                        {kind === 'food' ? 'View Menu' : 'Shop Now'}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.softBtn}
                      onPress={() => navigation.navigate('Vendor', { vendorId: store.id })}
                    >
                      <Text style={styles.softBtnText}>View Profile</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })
          )}
        </ScrollView>
      )}
    </MainScreenLayout>
  );
}
