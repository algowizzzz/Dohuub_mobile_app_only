import React, { useCallback, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';
import { colors } from '../../styles';
import ScreenStatusBar from '../../components/layout/ScreenStatusBar';
import SubScreenHeader from '../../components/layout/SubScreenHeader';
import ConfirmModal from '../../components/ui/ConfirmModal';
import LoadingState from '../../components/ui/LoadingState';
import ErrorState from '../../components/ui/ErrorState';
import { useAddressStore } from '../../store/addressStore';
import AddressCard from './components/AddressCard';
import type { Address } from './addresses';
import { styles } from './styles';

type Props = NativeStackScreenProps<RootStackParamList, 'SavedAddresses'>;

export default function SavedAddressesScreen({ navigation }: Props) {
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
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScreenStatusBar backgroundColor={colors.white} barStyle="dark-content" />
      <SubScreenHeader title="Saved Addresses" onBack={() => navigation.goBack()} />

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
              />
            ))}

            <TouchableOpacity
              style={styles.addButton}
              onPress={() => navigation.navigate('AddAddress')}
              activeOpacity={0.8}
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
        confirmLabel={deleting ? 'Deleting…' : 'Delete'}
        cancelLabel="Cancel"
        onConfirm={handleDeleteConfirmed}
        onCancel={() => setAddressPendingDelete(null)}
      />
    </SafeAreaView>
  );
}