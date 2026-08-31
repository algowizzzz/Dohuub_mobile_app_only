import React, { useEffect, useState } from 'react';
import {
  Image,
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
import LoadingState from '../../components/ui/LoadingState';
import ErrorState from '../../components/ui/ErrorState';
import { useCatalogStore } from '../../store/catalogStore';
import { useAddressStore } from '../../store/addressStore';
import { useServiceLocationStore } from '../../store/serviceLocationStore';
import { useBookingStore } from '../../store/bookingStore';
import { useRewardsStore } from '../../store/rewardsStore';
import type { ApiVendorDetail } from '../../services/catalogApi';
import { formatDurationMinutes } from '../../utils/duration';
import { ADDRESS_TYPE_META, formatAddressLine } from '../SavedAddresses/addresses';
import PickerRow from './components/PickerRow';
import DatePickerModal from './components/DatePickerModal';
import TimePickerModal from './components/TimePickerModal';
import { useServiceAvailability } from './useServiceAvailability';
import { ApiError } from '../../services/ApiError';
import ErrorBanner from '../../components/ui/ErrorBanner';
import { styles } from './styles';

type Props = NativeStackScreenProps<RootStackParamList, 'BookService'>;

export default function BookServiceScreen({ navigation, route }: Props) {
  const getVendor = useCatalogStore(state => state.getVendor);
  const [vendor, setVendor] = useState<ApiVendorDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const addresses = useAddressStore(state => state.addresses);
  const selectedAddressId = useServiceLocationStore(state => state.selectedAddressId);
  const patchDraft = useBookingStore(state => state.patchDraft);
  const createFromDraft = useBookingStore(state => state.createFromDraft);
  const balance = useRewardsStore(state => state.balance);
  const loadRewardsBalance = useRewardsStore(state => state.loadBalance);

  const [dateLabel, setDateLabel] = useState('');
  const [dateValue, setDateValue] = useState<string | null>(null);
  const [timeLabel, setTimeLabel] = useState('');
  const [notes, setNotes] = useState('');
  const [redeemPoints, setRedeemPoints] = useState(false);
  const [dateModalVisible, setDateModalVisible] = useState(false);
  const [timeModalVisible, setTimeModalVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { dateOptions, loadingDays, timeOptions, loadingSlots, loadSlotsForDate } =
    useServiceAvailability(route.params.serviceId);

  const load = () => {
    setLoading(true);
    setError(null);
    getVendor(route.params.vendorId)
      .then(setVendor)
      .catch(err => setError((err as Error).message))
      .finally(() => setLoading(false));
  };

  useEffect(load, [route.params.vendorId]);
  useEffect(() => {
    loadRewardsBalance().catch(() => {});
  }, [loadRewardsBalance]);

  const service = vendor?.services.find(item => item.id === route.params.serviceId);
  const selectedAddress =
    addresses.find(address => address.id === selectedAddressId) ?? addresses[0];

  if (loading) {
    return (
      <MainScreenLayout edges={['top', 'bottom']}>
        <SubScreenHeader title="Book Service" onBack={() => navigation.goBack()} />
        <LoadingState />
      </MainScreenLayout>
    );
  }

  if (error || !vendor || !service) {
    return (
      <MainScreenLayout edges={['top', 'bottom']}>
        <SubScreenHeader title="Book Service" onBack={() => navigation.goBack()} />
        <ErrorState message={error ?? 'Service not found.'} onRetry={load} />
      </MainScreenLayout>
    );
  }

  const price = service.discountedPrice ?? service.price;
  // Points are a DoHuub perk — only house ("Powered by DoHuub") vendors earn
  // or let customers redeem them. The backend rejects pointsToRedeem at a
  // non-powered vendor with code NOT_POWERED_BY_DOHUUB, so this gate must
  // match the PWA's isPoweredByDohuub(vendor) exactly.
  const powered = vendor.poweredByDoHuub === true;
  const pointsToEarn = powered ? Math.round(price * service.pointsPerDollar) : 0;
  const availablePoints = powered ? balance?.balance ?? 0 : 0;
  const redeemDiscount = redeemPoints
    ? Math.floor(availablePoints / (balance?.conversion.pointsPerCurrencyUnit ?? 100))
    : 0;

  const canConfirm = !!dateValue && !!timeLabel && !!selectedAddress && !submitting;

  const handleConfirm = async () => {
    if (!canConfirm || !selectedAddress || !dateValue) return;

    setSubmitting(true);
    setSubmitError(null);
    try {
      patchDraft({
        serviceCategoryId: service.id,
        serviceId: service.id,
        vendorId: vendor.id,
        serviceAddressId: selectedAddress.id,
        scheduledDate: dateValue,
        scheduledTime: timeLabel,
        notes,
        pointsToRedeem: redeemPoints ? availablePoints : 0,
      });
      const booking = await createFromDraft();
      navigation.navigate('Payment', { bookingId: booking.id });
    } catch (err) {
      setSubmitError(ApiError.messageOf(err, 'Could not create this booking.'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <MainScreenLayout edges={['top', 'bottom']}>
      <SubScreenHeader title="Book Service" onBack={() => navigation.goBack()} />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior="padding"
      >
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled" automaticallyAdjustKeyboardInsets>
          <View style={styles.summaryCard}>
            {service.image ? (
              <Image source={{ uri: service.image }} style={styles.summaryImage} resizeMode="cover" />
            ) : (
              <View style={[styles.summaryImage, styles.summaryImagePlaceholder]}>
                <Icon name="sparkles-outline" size={18} color={colors.primary} />
              </View>
            )}
            <View style={styles.summaryInfo}>
              <Text style={styles.summaryName}>{service.name}</Text>
              <Text style={styles.summaryVendor}>{vendor.businessName}</Text>
              <Text style={styles.summaryPrice}>
                ${price} · {formatDurationMinutes(service.serviceTimeInMinutes)}
              </Text>
            </View>
          </View>

          <Text style={styles.label}>Service</Text>
          <PickerRow
            icon="sparkles-outline"
            value={`${service.name} — $${price}`}
            placeholder="Choose a service"
            onPress={() => {}}
            disabled
          />

          <Text style={styles.label}>Select Date</Text>
          <PickerRow
            icon="calendar-outline"
            value={dateLabel}
            placeholder="Choose a date"
            onPress={() => setDateModalVisible(true)}
          />

          <Text style={styles.label}>Select Time</Text>
          <PickerRow
            icon="time-outline"
            value={timeLabel}
            placeholder={dateValue ? 'Choose a time' : 'Pick a date first'}
            onPress={() => setTimeModalVisible(true)}
            disabled={!dateValue}
          />

          <Text style={styles.label}>Service Address</Text>
          {selectedAddress ? (
            <PickerRow
              icon="location-outline"
              value={ADDRESS_TYPE_META[selectedAddress.type].label}
              placeholder="Choose an address"
              subtitle={formatAddressLine(selectedAddress)}
              onPress={() => navigation.navigate('SavedAddresses')}
            />
          ) : (
            <TouchableOpacity
              style={styles.addAddressRow}
              onPress={() => navigation.navigate('AddAddress')}
              activeOpacity={0.8}
            >
              <Icon name="add-circle-outline" size={16} color={colors.primary} />
              <Text style={styles.addAddressLabel}>Add a service address</Text>
            </TouchableOpacity>
          )}

          <Text style={styles.label}>Special instructions</Text>
          <TextInput
            style={styles.textArea}
            value={notes}
            onChangeText={setNotes}
            placeholder="Gate code, pets, parking notes..."
            placeholderTextColor={colors.textMuted}
            multiline
            textAlignVertical="top"
          />

          {powered && service.pointsPerDollar > 0 ? (
            <View style={styles.pointsBox}>
              <View style={styles.pointsBoxHeader}>
                <View style={styles.pointsIconWrap}>
                  <Icon name="gift" size={14} color={colors.amberTextLight} />
                </View>
                <Text style={styles.pointsBoxTitle}>Points you'll earn</Text>
                <Text style={styles.pointsBoxValue}>+{pointsToEarn} pts</Text>
              </View>
              <Text style={styles.pointsBoxSubtitle}>
                {service.pointsPerDollar} points per $1 spent · added after the service is completed
              </Text>
            </View>
          ) : null}

          {powered && availablePoints > 0 ? (
            <TouchableOpacity
              style={[styles.redeemRow, redeemPoints && styles.redeemRowActive]}
              onPress={() => setRedeemPoints(prev => !prev)}
              activeOpacity={0.8}
            >
              <View style={[styles.checkbox, redeemPoints && styles.checkboxChecked]}>
                {redeemPoints ? <Icon name="checkmark" size={13} color={colors.white} /> : null}
              </View>
              <View style={styles.redeemTextCol}>
                <Text style={styles.redeemTitle}>
                  Spend {availablePoints.toLocaleString()} points on this booking
                </Text>
                <Text style={styles.redeemSubtitle}>
                  Takes ${redeemDiscount} off. You have {availablePoints.toLocaleString()} points.
                </Text>
              </View>
            </TouchableOpacity>
          ) : null}

          <View style={styles.priceSummaryCard}>
            <View style={styles.priceSummaryRow}>
              <Text style={styles.priceSummaryLabel}>Service Price</Text>
              <Text style={styles.priceSummaryValue}>${price}</Text>
            </View>
            <Text style={styles.priceSummaryNote}>
              The final total is calculated when the booking is created.
            </Text>
          </View>

          {submitError ? <ErrorBanner message={submitError} /> : null}

          <PrimaryButton
            label={submitting ? 'Creating booking…' : 'Confirm Booking'}
            onPress={handleConfirm}
            disabled={!canConfirm}
            loading={submitting}
            style={styles.confirmButton}
          />
        </ScrollView>
      </KeyboardAvoidingView>

      <DatePickerModal
        visible={dateModalVisible}
        options={dateOptions}
        loading={loadingDays}
        selectedId={dateValue}
        onSelect={(id, label) => {
          setDateValue(id);
          setDateLabel(label);
          setTimeLabel('');
          setDateModalVisible(false);
          loadSlotsForDate(id);
        }}
        onClose={() => setDateModalVisible(false)}
      />

      <TimePickerModal
        visible={timeModalVisible}
        options={timeOptions}
        loading={loadingSlots}
        selected={timeLabel || null}
        onSelect={time => {
          setTimeLabel(time);
          setTimeModalVisible(false);
        }}
        onClose={() => setTimeModalVisible(false)}
      />
    </MainScreenLayout>
  );
}
