import React, { useCallback, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';
import { colors } from '../../styles';
import MainScreenLayout from '../../components/layout/MainScreenLayout';
import SubScreenHeader from '../../components/layout/SubScreenHeader';
import HeaderHomeButton from '../../components/layout/HeaderHomeButton';
import ConfirmModal from '../../components/ui/ConfirmModal';
import LoadingState from '../../components/ui/LoadingState';
import ErrorState from '../../components/ui/ErrorState';
import { useAddressStore } from '../../store/addressStore';
import { useServiceLocationStore } from '../../store/serviceLocationStore';
import AddressCard from './components/AddressCard';
import type { Address } from './addresses';
import { styles } from './styles';

type Props = NativeStackScreenProps<RootStackParamList, 'SavedAddresses'>;

export default function SavedAddressesScreen({ navigation, route }: Props) {
  // Opened from a booking / checkout "Change address": a tap picks the address
  // for the flow and returns to it, instead of only managing the list.
  const selectMode = route.params?.mode === 'select';
  const selectedAddressId = useServiceLocationStore(state => state.selectedAddressId);
  const setSelectedAddressId = useServiceLocationStore(state => state.setSelectedAddressId);
  const setLastCoords = useServiceLocationStore(state => state.setLastCoords);
  const addresses = useAddressStore(state => state.addresses);
  const loading = useAddressStore(state => state.loading);
  const error = useAddressStore(state => state.error);
  const load = useAddressStore(state => state.load);
  const setDefault = useAddressStore(state => state.setDefault);
  const removeAddress = useAddressStore(state => state.removeAddress);
  const [addressPendingDelete, setAddressPendingDelete] = useState<Address | null>(null);
  const [deleting, setDeleting] = useState(false);

  useFocusEffect(
    useCallback(() => {
      load().catch(() => {});
    }, [load]),
  );

  // Same fallback the flows use when nothing was picked yet: default, then first.
  const activeAddressId =
    addresses.find(a => a.id === selectedAddressId)?.id ??
    addresses.find(a => a.isDefault)?.id ??
    addresses[0]?.id;

  const handleSelect = (address: Address) => {
    setSelectedAddressId(address.id);
    if (address.latitude != null && address.longitude != null) {
      setLastCoords({ lat: address.latitude, lng: address.longitude });
    }
    navigation.goBack();
  };

  const handleDeleteConfirmed = async () => {
    if (!addressPendingDelete) return;
    setDeleting(true);
    try {
      await removeAddress(addressPendingDelete.id);
      setAddressPendingDelete(null);
    } catch {
      // surfaced via store error state
    } finally {
      setDeleting(false);
    }
  };

  return (
    <MainScreenLayout edges={['top', 'bottom']}>
      <SubScreenHeader
        title={selectMode ? 'Choose Address' : 'Saved Addresses'}
        onBack={() => navigation.goBack()}
        right={<HeaderHomeButton testID="address-home-button" />}
      />

      {loading && addresses.length === 0 ? (
        <LoadingState />
      ) : error && addresses.length === 0 ? (
        <ErrorState message={error} onRetry={() => load()} />
      ) : (
        <View style={styles.body}>
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {addresses.map(address => (
              <AddressCard
                key={address.id}
                address={address}
                onSetDefault={() => setDefault(address.id)}
                onEdit={() => navigation.navigate('AddAddress', { addressId: address.id })}
                onDelete={() => setAddressPendingDelete(address)}
                onSelect={selectMode ? () => handleSelect(address) : undefined}
                selected={selectMode && address.id === activeAddressId}
              />
            ))}

            <TouchableOpacity
              style={styles.addButton}
              onPress={() => navigation.navigate('AddAddress', selectMode ? { select: true } : undefined)}
              activeOpacity={0.8}
              testID="address-add-new"
            >
              <Icon name="add" size={22} color={colors.primary} />
              <Text style={styles.addButtonLabel}>Add New Address</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      )}

      <ConfirmModal
        visible={!!addressPendingDelete}
        title="Delete address"
        message="Remove this address? This can't be undone."
        icon="trash-outline"
        iconTone="danger"
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={handleDeleteConfirmed}
        loading={deleting}
        confirmTestID="address-delete-confirm"
        onCancel={() => setAddressPendingDelete(null)}
      />
    </MainScreenLayout>
  );
}