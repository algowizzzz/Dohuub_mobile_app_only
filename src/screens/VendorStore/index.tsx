import React, { useEffect, useMemo, useState } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
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
import type { ApiVendorDetail } from '../../services/catalogApi';
import StoreServiceCard from './components/StoreServiceCard';
import EarnPointsCard from '../../components/ui/EarnPointsCard';
import { styles } from './styles';

type Props = NativeStackScreenProps<RootStackParamList, 'VendorStore'>;

export default function VendorStoreScreen({ navigation, route }: Props) {
  const { vendorId, categoryId } = route.params;
  const getVendor = useCatalogStore(state => state.getVendor);
  const [vendor, setVendor] = useState<ApiVendorDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    setError(null);
    getVendor(vendorId)
      .then(setVendor)
      .catch(err => setError((err as Error).message))
      .finally(() => setLoading(false));
  };

  useEffect(load, [vendorId]);

  const offered = useMemo(() => {
    if (!vendor) return [];
    if (!categoryId) return vendor.services;
    const filtered = vendor.services.filter(service => service.vendorCategory.id === categoryId);
    return filtered.length > 0 ? filtered : vendor.services;
  }, [vendor, categoryId]);

  const pointsRate = offered[0]?.pointsPerDollar ?? vendor?.services[0]?.pointsPerDollar ?? 1;

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <SubScreenHeader title="Provider" onBack={() => navigation.goBack()} />
        <LoadingState />
      </SafeAreaView>
    );
  }

  if (error || !vendor) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <SubScreenHeader title="Provider" onBack={() => navigation.goBack()} />
        <ErrorState message={error ?? 'Provider not found.'} onRetry={load} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScreenStatusBar backgroundColor={colors.white} barStyle="dark-content" />
      <SubScreenHeader title={vendor.businessName} onBack={() => navigation.goBack()} />

      <View style={styles.body}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.summary}>
            <View style={styles.summaryRow}>
              {vendor.user.image ? (
                <Image source={{ uri: vendor.user.image }} style={styles.logo} />
              ) : (
                <View style={styles.logoFallback}>
                  <Icon name="sparkles" size={28} color={colors.primary} />
                </View>
              )}
              <View style={styles.summaryInfo}>
                <Text style={styles.vendorName} numberOfLines={2}>
                  {vendor.businessName}
                </Text>
                {vendor.poweredByDoHuub ? (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>Powered by DoHuub</Text>
                  </View>
                ) : null}
                <View style={styles.ratingRow}>
                  {vendor.ratingCount > 0 ? (
                    <>
                      <Icon name="star" size={14} color={colors.star} />
                      <Text style={styles.ratingValue}>{vendor.ratingAverage.toFixed(1)}</Text>
                      <Text style={styles.reviewCount}>({vendor.ratingCount} reviews)</Text>
                    </>
                  ) : (
                    <Text style={styles.reviewCount}>No reviews yet</Text>
                  )}
                </View>
              </View>
            </View>

            <TouchableOpacity
              style={styles.profileBtn}
              activeOpacity={0.85}
              onPress={() => navigation.navigate('Vendor', { vendorId: vendor.id })}
            >
              <Text style={styles.profileBtnText}>View Vendor Profile</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <EarnPointsCard pointsPerDollar={pointsRate} />

            <Text style={styles.sectionTitle}>Services Offered</Text>
            {offered.length === 0 ? (
              <Text style={styles.emptyText}>No services listed yet.</Text>
            ) : (
              <View style={styles.grid}>
                {offered.map(service => (
                  <StoreServiceCard
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
                ))}
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
