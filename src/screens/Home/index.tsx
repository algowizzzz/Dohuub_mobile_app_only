import React, { useCallback, useEffect, useState } from 'react';
import { RefreshControl, ScrollView, Text, View } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';
import MainScreenLayout from '../../components/layout/MainScreenLayout';
import { colors } from '../../styles';
import LoadingState from '../../components/ui/LoadingState';
import ErrorState from '../../components/ui/ErrorState';
import { useAddressStore } from '../../store/addressStore';
import { useServiceLocationStore } from '../../store/serviceLocationStore';
import { useBookingStore } from '../../store/bookingStore';
import { useRewardsStore } from '../../store/rewardsStore';
import { useAuthStore } from '../../store/authStore';
import { requireAuth, useIsSignedIn } from '../../hooks/useRequireAuth';
import { vendorCategoriesApi, type ApiVendorCategory } from '../../services/catalogApi';
import { ADDRESS_TYPE_META, formatAddressLine } from '../SavedAddresses/addresses';
import HomeHeader from './components/HomeHeader';
import SelectLocationModal from './components/SelectLocationModal';
import ServiceCard from './components/ServiceCard';
import HomeSearchBar from './components/HomeSearchBar';
import RewardsWidget from './components/RewardsWidget';
import { styles } from './styles';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const addresses = useAddressStore(state => state.addresses);
  const loadAddresses = useAddressStore(state => state.load);
  const selectedAddressId = useServiceLocationStore(state => state.selectedAddressId);
  const setSelectedAddressId = useServiceLocationStore(state => state.setSelectedAddressId);
  const setLastCoords = useServiceLocationStore(state => state.setLastCoords);
  const loadBookings = useBookingStore(state => state.load);
  const rewardsBalance = useRewardsStore(state => state.balance);
  const loadRewardsBalance = useRewardsStore(state => state.loadBalance);
  const signedIn = useIsSignedIn();
  const [locationModalVisible, setLocationModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [categories, setCategories] = useState<ApiVendorCategory[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);

  useEffect(() => {
    if (signedIn) useAuthStore.getState().completeOnboarding().catch(() => {});
  }, [signedIn]);

  const loadCategories = () => {
    setCategoriesLoading(true);
    setCategoriesError(null);
    return vendorCategoriesApi
      .list({ sortBy: 'updatedAt', sortOrder: 'desc', limit: 100 })
      .then(rows => {
        const list = Array.isArray(rows) ? [...rows] : [];
        list.sort((a, b) => {
          const aTime = new Date(a.updatedAt || a.createdAt || 0).getTime();
          const bTime = new Date(b.updatedAt || b.createdAt || 0).getTime();
          return bTime - aTime;
        });
        setCategories(list);
      })
      .catch(err => setCategoriesError((err as Error).message))
      .finally(() => setCategoriesLoading(false));
  };

  // Account data only — guests browse categories without a session.
  const loadAccountData = useCallback(() => {
    if (!signedIn) return Promise.resolve();
    return Promise.all([
      loadAddresses().catch(() => {}),
      loadBookings().catch(() => {}),
      loadRewardsBalance().catch(() => {}),
    ]).then(() => {});
  }, [signedIn, loadAddresses, loadBookings, loadRewardsBalance]);

  useFocusEffect(
    useCallback(() => {
      loadAccountData();
    }, [loadAccountData]),
  );

  useEffect(() => {
    loadCategories();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    Promise.all([loadAccountData(), loadCategories()]).finally(() => setRefreshing(false));
  };

  useEffect(() => {
    if (!selectedAddressId && addresses.length > 0) {
      const defaultAddress = addresses.find(address => address.isDefault) ?? addresses[0];
      setSelectedAddressId(defaultAddress.id);
    }
  }, [addresses, selectedAddressId, setSelectedAddressId]);

  const selectedAddress = signedIn
    ? addresses.find(address => address.id === selectedAddressId) ?? addresses[0]
    : undefined;

  const openLocation = () => {
    if (requireAuth('Sign in to save addresses and pick where you need service.')) {
      setLocationModalVisible(true);
    }
  };

  return (
    <MainScreenLayout>
      <HomeHeader
        locationLabel={selectedAddress ? ADDRESS_TYPE_META[selectedAddress.type].label : 'Location'}
        onLocationPress={openLocation}
        onAvatarPress={() => {}}
        addressLine={selectedAddress ? formatAddressLine(selectedAddress) : undefined}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      >
        <HomeSearchBar
          onPress={() => {
            if (requireAuth('Sign in to search with the DoHuub AI assistant.')) {
              navigation.navigate('ChatDetail', undefined);
            }
          }}
        />

        <RewardsWidget
          points={signedIn ? rewardsBalance?.balance ?? 0 : 0}
          weeklyStreak={signedIn ? rewardsBalance?.weeklyStreak ?? 0 : 0}
          onPress={() => {
            if (requireAuth('Sign in to earn points on every booking and order.')) {
              navigation.navigate('RewardsWallet');
            }
          }}
        />

        <Text style={styles.sectionTitle}>Available Services</Text>

        {categoriesLoading ? (
          <LoadingState />
        ) : categoriesError ? (
          <ErrorState message={categoriesError} onRetry={loadCategories} />
        ) : (
          <View style={styles.list}>
            {categories.map(category => (
              <ServiceCard
                key={category.id}
                category={category}
                onPress={() => {
                  const title = String(category.title || '').toLowerCase();
                  if (title.includes('groc') || title.includes('food')) {
                    navigation.navigate('CommerceChoice', { categoryId: category.id, mode: 'groceries' });
                  } else if (title.includes('beauty')) {
                    navigation.navigate('CommerceChoice', { categoryId: category.id, mode: 'beauty' });
                  } else if (title.includes('rental')) {
                    // Rentals have their own list: a property is browsed by
                    // bedrooms and nightly rate, not by the vendor offering it.
                    navigation.navigate('RentalsList');
                  } else {
                    navigation.navigate('Services', { categoryId: category.id });
                  }
                }}
              />
            ))}
          </View>
        )}
      </ScrollView>

      <SelectLocationModal
        visible={locationModalVisible}
        addresses={addresses}
        selectedId={selectedAddressId}
        onSelect={id => {
          setSelectedAddressId(id);
          const chosen = addresses.find(address => address.id === id);
          if (chosen?.latitude != null && chosen?.longitude != null) {
            setLastCoords({ lat: chosen.latitude, lng: chosen.longitude });
          }
          setLocationModalVisible(false);
        }}
        onAddNew={() => {
          setLocationModalVisible(false);
          navigation.navigate('AddAddress');
        }}
        onClose={() => setLocationModalVisible(false)}
      />
    </MainScreenLayout>
  );
}
