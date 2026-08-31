import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ScrollView, Text, TextInput, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';
import { colors } from '../../styles';
import MainScreenLayout from '../../components/layout/MainScreenLayout';
import SubScreenHeader from '../../components/layout/SubScreenHeader';
import LoadingState from '../../components/ui/LoadingState';
import ErrorState from '../../components/ui/ErrorState';
import { vendorCategoriesApi, type ApiVendorCategory } from '../../services/catalogApi';
import { useCatalogStore } from '../../store/catalogStore';
import { getNearMeCoords } from '../../utils/nearMe';
import VendorListCard from './components/VendorListCard';
import SortFilterBar from './components/SortFilterBar';
import SortPickerModal from './components/SortPickerModal';
import type { SortKey } from './sorting';
import { styles } from './styles';

type Props = NativeStackScreenProps<RootStackParamList, 'Services'>;

export default function ServicesScreen({ navigation, route }: Props) {
  const { categoryId } = route.params;
  const services = useCatalogStore(state => state.services);
  const loading = useCatalogStore(state => state.servicesLoading);
  const error = useCatalogStore(state => state.error);
  const loadServices = useCatalogStore(state => state.loadServices);

  const [category, setCategory] = useState<ApiVendorCategory | null>(null);
  const [query, setQuery] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('top_rated');
  const [sortModalVisible, setSortModalVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadServices({ vendorCategoryId: categoryId, sortOrder: 'desc', ...getNearMeCoords() }).catch(() => {});
    }, [categoryId, loadServices]),
  );

  useEffect(() => {
    vendorCategoriesApi
      .list()
      .then(categories => setCategory(categories.find(c => c.id === categoryId) ?? null))
      .catch(() => {});
  }, [categoryId]);

  // One card per vendor — a vendor can list multiple services in this category.
  const vendors = useMemo(() => {
    const byVendor = new Map<
      string,
      (typeof services)[number]['vendor'] & { serviceCount: number; minPrice: number }
    >();

    services.forEach(service => {
      const existing = byVendor.get(service.vendor.id);
      const effectivePrice = service.discountedPrice ?? service.price;
      if (existing) {
        existing.serviceCount += 1;
        existing.minPrice = Math.min(existing.minPrice, effectivePrice);
      } else {
        byVendor.set(service.vendor.id, {
          ...service.vendor,
          serviceCount: 1,
          minPrice: effectivePrice,
        });
      }
    });

    let list = Array.from(byVendor.values());

    const normalized = query.trim().toLowerCase();
    if (normalized) {
      list = list.filter(
        vendor =>
          vendor.businessName.toLowerCase().includes(normalized) ||
          vendor.city.toLowerCase().includes(normalized),
      );
    }

    switch (sortKey) {
      case 'top_rated':
        return [...list].sort((a, b) => b.ratingAverage - a.ratingAverage);
      case 'price_low':
        return [...list].sort((a, b) => a.minPrice - b.minPrice);
      case 'price_high':
        return [...list].sort((a, b) => b.minPrice - a.minPrice);
      default:
        return list;
    }
  }, [services, query, sortKey]);

  return (
    <MainScreenLayout edges={['top', 'bottom']}>
      <SubScreenHeader title={category?.title ?? 'Services'} onBack={() => navigation.goBack()} />

      {loading && services.length === 0 ? (
        <LoadingState />
      ) : error && services.length === 0 ? (
        <ErrorState message={error} onRetry={() => loadServices({ vendorCategoryId: categoryId, ...getNearMeCoords() })} />
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.searchWrap}>
            <Icon name="search" size={18} color={colors.textMuted} />
            <TextInput
              style={styles.searchInput}
              value={query}
              onChangeText={setQuery}
              placeholder="Search providers, city or specialty..."
              placeholderTextColor={colors.textMuted}
            />
          </View>

          <SortFilterBar sortKey={sortKey} onPressSort={() => setSortModalVisible(true)} />

          {vendors.length === 0 ? (
            <View style={styles.empty}>
              <Icon name="search-outline" size={36} color={colors.textFaint} />
              <Text style={styles.emptyTitle}>No matches</Text>
              <Text style={styles.emptyText}>Try a different business or service name</Text>
            </View>
          ) : (
            vendors.map(vendor => (
              <VendorListCard
                key={vendor.id}
                vendor={vendor}
                onPress={() =>
                  navigation.navigate('VendorStore', {
                    vendorId: vendor.id,
                    categoryId,
                  })
                }
              />
            ))
          )}
        </ScrollView>
      )}

      <SortPickerModal
        visible={sortModalVisible}
        selected={sortKey}
        onSelect={key => {
          setSortKey(key);
          setSortModalVisible(false);
        }}
        onClose={() => setSortModalVisible(false)}
      />
    </MainScreenLayout>
  );
}
