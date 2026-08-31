import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';
import { colors } from '../../styles';
import MainScreenLayout from '../../components/layout/MainScreenLayout';
import SubScreenHeader from '../../components/layout/SubScreenHeader';
import PrimaryButton from '../../components/ui/PrimaryButton';
import { useAddressStore } from '../../store/addressStore';
import { useCurrentLocation } from '../../hooks/useCurrentLocation';
import { ApiError } from '../../services/ApiError';
import ErrorBanner from '../../components/ui/ErrorBanner';
import { reverseGeocode, type ResolvedAddress } from '../../services/placesApi';
import AddressTypeSelector from './components/AddressTypeSelector';
import AddressSearch from './components/AddressSearch';
import AddressMapPreview from './components/AddressMapPreview';
import type { AddressType } from '../SavedAddresses/addresses';
import { styles } from './styles';

type Props = NativeStackScreenProps<RootStackParamList, 'AddAddress'>;

export default function AddAddressScreen({ navigation, route }: Props) {
  const addressId = route.params?.addressId;
  const presetType = route.params?.type;
  const addresses = useAddressStore(state => state.addresses);
  const addAddress = useAddressStore(state => state.addAddress);
  const updateAddress = useAddressStore(state => state.updateAddress);
  const existing = addresses.find(a => a.id === addressId);

  const [type, setType] = useState<AddressType>(existing?.type ?? presetType ?? 'home');
  const [street, setStreet] = useState(existing?.address ?? '');
  const [city, setCity] = useState(existing?.city ?? '');
  const [state, setState] = useState(existing?.state ?? '');
  const [zip, setZip] = useState(existing?.zipCode ?? '');
  const [instructions, setInstructions] = useState(existing?.instructions ?? '');
  const [lat, setLat] = useState(existing?.latitude ? String(existing.latitude) : '');
  const [lng, setLng] = useState(existing?.longitude ? String(existing.longitude) : '');
  const [saving, setSaving] = useState(false);
  const [resolving, setResolving] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [lookupError, setLookupError] = useState<string | null>(null);

  const { getCurrentLocation, loading: locating, error: locationError } = useCurrentLocation();

  const latNum = lat ? Number(lat) : NaN;
  const lngNum = lng ? Number(lng) : NaN;
  const hasPin = Number.isFinite(latNum) && Number.isFinite(lngNum);
  const busy = locating || resolving;
  const canSave = street.trim().length >= 5 && city.trim().length > 0 && !saving && !busy;

  const applyResolved = (resolved: ResolvedAddress) => {
    const streetLine = resolved.street.trim().length >= 5 ? resolved.street : resolved.formatted;
    setStreet(streetLine);
    setCity(resolved.city);
    setState(resolved.state);
    setZip(resolved.zip);
    setLat(String(resolved.latitude));
    setLng(String(resolved.longitude));
    setLookupError(null);
  };

  const handleUseCurrentLocation = async () => {
    if (busy) return;
    setLookupError(null);
    setSubmitError(null);
    const coords = await getCurrentLocation();
    if (!coords) return;

    setLat(coords.lat);
    setLng(coords.lng);
    setResolving(true);
    try {
      const resolved = await reverseGeocode(Number(coords.lat), Number(coords.lng));
      if (resolved) {
        applyResolved(resolved);
      } else {
        setLookupError('Could not find a street address for this location. You can search for it instead.');
      }
    } catch {
      setLookupError('Could not look up this location. Check your connection and try again.');
    } finally {
      setResolving(false);
    }
  };

  const handleSave = async () => {
    if (!canSave) return;

    const payload = {
      type,
      address: street.trim(),
      city: city.trim() || undefined,
      state: state.trim() || undefined,
      zipCode: zip.trim() || undefined,
      instructions: instructions.trim() || undefined,
      latitude: lat ? Number(lat) : undefined,
      longitude: lng ? Number(lng) : undefined,
    };

    setSaving(true);
    setSubmitError(null);
    try {
      if (existing) {
        await updateAddress(existing.id, payload);
      } else {
        await addAddress(payload);
      }
      navigation.goBack();
    } catch (error) {
      setSubmitError(ApiError.messageOf(error, 'Could not save this address.'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <MainScreenLayout edges={['top', 'bottom']}>
      <SubScreenHeader
        title={existing ? 'Edit Address' : 'Add Address'}
        onBack={() => navigation.goBack()}
      />

      <KeyboardAvoidingView style={styles.flex} behavior="padding">
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          automaticallyAdjustKeyboardInsets
        >
          <Text style={styles.label}>Address Type</Text>
          <AddressTypeSelector value={type} onChange={setType} />

          <AddressSearch
            value={street}
            onChangeText={text => {
              setStreet(text);
              setLookupError(null);
            }}
            onSelect={applyResolved}
            onError={setLookupError}
          />

          <TouchableOpacity
            style={[styles.locationButton, busy && styles.locationButtonDisabled]}
            onPress={handleUseCurrentLocation}
            disabled={busy}
            activeOpacity={0.7}
          >
            {busy ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <Icon name="locate-outline" size={18} color={colors.primary} />
            )}
            <Text style={styles.locationButtonLabel}>
              {busy ? 'Finding your location…' : 'Use my current location'}
            </Text>
          </TouchableOpacity>

          {locationError ? <ErrorBanner message={locationError} /> : null}
          {lookupError ? <ErrorBanner message={lookupError} /> : null}

          {hasPin ? (
            <AddressMapPreview
              key={`${lat},${lng}`}
              latitude={latNum}
              longitude={lngNum}
              label={street || city || 'Pinned on the map'}
            />
          ) : null}

          <Text style={styles.label}>City</Text>
          <TextInput
            style={styles.input}
            value={city}
            onChangeText={setCity}
            placeholder="City"
            placeholderTextColor={colors.textMuted}
          />

          <View style={styles.row}>
            <View style={styles.rowItem}>
              <Text style={styles.label}>State / region</Text>
              <TextInput
                style={styles.input}
                value={state}
                onChangeText={setState}
                placeholder="State"
                placeholderTextColor={colors.textMuted}
                autoCapitalize="words"
              />
            </View>
            <View style={styles.rowItemLast}>
              <Text style={styles.label}>Zip / postal code</Text>
              <TextInput
                style={styles.input}
                value={zip}
                onChangeText={setZip}
                placeholder="Postal code"
                placeholderTextColor={colors.textMuted}
                autoCapitalize="characters"
                maxLength={20}
              />
            </View>
          </View>

          <Text style={styles.label}>Delivery Instructions (Optional)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={instructions}
            onChangeText={setInstructions}
            placeholder="e.g., Ring doorbell twice, Leave at door"
            placeholderTextColor={colors.textMuted}
            multiline
            textAlignVertical="top"
          />

          {submitError ? <ErrorBanner message={submitError} /> : null}

          <Text style={styles.helperText}>
            Search or use your location and we fill the address from Google Maps, including the pin
            used to show nearby providers.
          </Text>

          <PrimaryButton
            label={saving ? 'Saving…' : 'Save Address'}
            onPress={handleSave}
            disabled={!canSave}
            loading={saving}
            style={styles.saveButton}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </MainScreenLayout>
  );
}
