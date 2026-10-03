import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';
import MainScreenLayout from '../../components/layout/MainScreenLayout';
import SubScreenHeader from '../../components/layout/SubScreenHeader';
import PrimaryButton from '../../components/ui/PrimaryButton';
import TextField from '../../components/ui/TextField';
import PhoneField from '../../components/ui/PhoneField';
import ErrorBanner from '../../components/ui/ErrorBanner';
import LoadingState from '../../components/ui/LoadingState';
import ErrorState from '../../components/ui/ErrorState';
import { colors } from '../../styles';
import { ApiError } from '../../services/ApiError';
import { deliveryApi, type DeliveryEstimate } from '../../services/deliveryApi';
import type { ResolvedAddress } from '../../services/placesApi';
import type { ApiCommerceOrder } from '../../services/commerceApi';
import { useAddressStore } from '../../store/addressStore';
import { useAuthStore } from '../../store/authStore';
import { useCommerceStore } from '../../store/commerceStore';
import { ADDRESS_TYPE_META, formatAddressLine, type Address } from '../SavedAddresses/addresses';
import AddressSearch from '../AddAddress/components/AddressSearch';
import { deliveryStyles as styles } from './styles';

type Props = NativeStackScreenProps<RootStackParamList, 'SendPackage'>;

type Stop = {
  label: string;
  address: string;
  lat: number | null;
  lng: number | null;
  state?: string | null;
};

type StopChoice = { kind: 'saved'; id: string } | { kind: 'other' } | null;

const fromSaved = (a: Address): Stop => ({
  label: ADDRESS_TYPE_META[a.type]?.label ?? 'Saved address',
  address: formatAddressLine(a),
  lat: a.latitude,
  lng: a.longitude,
  state: a.state,
});

const fromResolved = (r: ResolvedAddress): Stop => ({
  label: r.street || r.formatted.split(',')[0],
  address: r.formatted || [r.street, r.city, r.state, r.zip].filter(Boolean).join(', '),
  lat: r.latitude,
  lng: r.longitude,
  state: r.state,
});

/** Next three days, hourly 8:00–20:00, past slots dropped. Pure JS — no native date picker. */
function buildSlots() {
  const days: { key: string; label: string; slots: Date[] }[] = [];
  const now = Date.now() + 30 * 60_000; // at least 30 minutes ahead
  for (let i = 0; i < 3; i += 1) {
    const day = new Date();
    day.setDate(day.getDate() + i);
    const slots: Date[] = [];
    for (let h = 8; h <= 20; h += 1) {
      const slot = new Date(day);
      slot.setHours(h, 0, 0, 0);
      if (slot.getTime() > now) slots.push(slot);
    }
    if (slots.length) {
      const label = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : day.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
      days.push({ key: day.toDateString(), label, slots });
    }
  }
  return days;
}

const formatSlot = (d: Date) => d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

function StopPicker({
  badge,
  badgeColor,
  title,
  addresses,
  choice,
  onChoose,
  other,
  onOther,
  testPrefix,
  onRevealSearch,
}: {
  badge: string;
  badgeColor: string;
  title: string;
  addresses: Address[];
  choice: StopChoice;
  onChoose: (c: StopChoice) => void;
  other: Stop | null;
  onOther: (s: Stop | null) => void;
  testPrefix: string;
  /** Asks the form to scroll this card to the top so the search box clears the keyboard. */
  onRevealSearch?: (y: number) => void;
}) {
  const yRef = useRef(0);
  const [query, setQuery] = useState(other?.address ?? '');
  const [lookupError, setLookupError] = useState<string | null>(null);
  const selectedSaved = choice?.kind === 'saved' ? addresses.find(a => a.id === choice.id) : undefined;
  const selected = selectedSaved ? fromSaved(selectedSaved) : choice?.kind === 'other' ? other : null;

  return (
    <View style={styles.card} onLayout={e => (yRef.current = e.nativeEvent.layout.y)}>
      <View style={[styles.stopRow, { marginBottom: 12, alignItems: 'center' }]}>
        <View style={[styles.stopBadge, { backgroundColor: badgeColor }]}>
          <Text style={styles.stopBadgeText}>{badge}</Text>
        </View>
        <Text style={[styles.cardTitle, { marginBottom: 0 }]}>{title}</Text>
      </View>

      <View style={styles.chipWrap}>
        {addresses.map(a => {
          const active = choice?.kind === 'saved' && choice.id === a.id;
          return (
            <TouchableOpacity
              key={a.id}
              testID={`${testPrefix}-saved-${a.type}`}
              style={[styles.chip, active && styles.chipActive]}
              onPress={() => onChoose({ kind: 'saved', id: a.id })}
              activeOpacity={0.8}
            >
              <Icon
                name={ADDRESS_TYPE_META[a.type]?.icon ?? 'location-outline'}
                size={14}
                color={active ? colors.white : colors.primary}
              />
              <Text style={[styles.chipText, active && styles.chipTextActive]}>
                {ADDRESS_TYPE_META[a.type]?.label ?? 'Saved'}
              </Text>
            </TouchableOpacity>
          );
        })}
        <TouchableOpacity
          testID={`${testPrefix}-other`}
          style={[styles.chip, choice?.kind === 'other' && styles.chipActive]}
          onPress={() => {
            onChoose({ kind: 'other' });
            setTimeout(() => onRevealSearch?.(yRef.current), 50);
          }}
          activeOpacity={0.8}
        >
          <Icon name="search-outline" size={14} color={choice?.kind === 'other' ? colors.white : colors.primary} />
          <Text style={[styles.chipText, choice?.kind === 'other' && styles.chipTextActive]}>Another address</Text>
        </TouchableOpacity>
      </View>

      {choice?.kind === 'other' ? (
        <View style={{ marginTop: 12 }}>
          <AddressSearch
            value={query}
            onChangeText={text => {
              setQuery(text);
              if (other) onOther(null);
            }}
            onSelect={resolved => {
              const stop = fromResolved(resolved);
              setQuery(stop.address);
              onOther(stop);
            }}
            onError={setLookupError}
          />
          {lookupError ? <ErrorBanner message={lookupError} /> : null}
        </View>
      ) : null}

      {selected ? (
        <View style={styles.selectedAddress} testID={`${testPrefix}-selected`}>
          <Icon name="location" size={18} color={badgeColor} />
          <View style={styles.stopBody}>
            <Text style={styles.stopTitle} numberOfLines={1}>
              {selected.label}
            </Text>
            <Text style={styles.stopLine} numberOfLines={2}>
              {selected.address}
            </Text>
          </View>
        </View>
      ) : null}
    </View>
  );
}

export default function SendPackageScreen({ navigation, route }: Props) {
  const orderId = route.params?.orderId;
  const user = useAuthStore(s => s.user);
  const addresses = useAddressStore(s => s.addresses);
  const loadAddresses = useAddressStore(s => s.load);
  const getOrder = useCommerceStore(s => s.getOrder);

  const [order, setOrder] = useState<ApiCommerceOrder | null>(null);
  const [orderLoading, setOrderLoading] = useState(Boolean(orderId));
  const [orderError, setOrderError] = useState<string | null>(null);

  const [pickupChoice, setPickupChoice] = useState<StopChoice>(null);
  const [pickupOther, setPickupOther] = useState<Stop | null>(null);
  const [dropoffChoice, setDropoffChoice] = useState<StopChoice>(null);
  const [dropoffOther, setDropoffOther] = useState<Stop | null>(null);
  const [senderPhone, setSenderPhone] = useState(user?.phone ?? '');
  const [senderPhoneValid, setSenderPhoneValid] = useState(true);
  const [recipientName, setRecipientName] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [recipientPhoneValid, setRecipientPhoneValid] = useState(true);
  const [parcel, setParcel] = useState('');
  const [notes, setNotes] = useState('');
  const [fare, setFare] = useState('');
  const [timing, setTiming] = useState<'asap' | 'scheduled'>('asap');
  const days = useMemo(buildSlots, []);
  const [dayKey, setDayKey] = useState(days[0]?.key ?? '');
  const [slot, setSlot] = useState<Date | null>(null);

  const scrollRef = useRef<ScrollView>(null);
  const revealSearch = useCallback((y: number) => scrollRef.current?.scrollTo({ y: Math.max(0, y - 8), animated: true }), []);
  const [estimate, setEstimate] = useState<DeliveryEstimate | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      loadAddresses().catch(() => {});
    }, [loadAddresses]),
  );

  // Default pickup = the customer's default saved address (packages only).
  useEffect(() => {
    if (orderId || pickupChoice || addresses.length === 0) return;
    const def = addresses.find(a => a.isDefault) ?? addresses[0];
    setPickupChoice({ kind: 'saved', id: def.id });
  }, [addresses, orderId, pickupChoice]);

  const loadOrder = useCallback(() => {
    if (!orderId) return;
    setOrderLoading(true);
    setOrderError(null);
    getOrder(orderId)
      .then(setOrder)
      .catch(err => setOrderError((err as Error).message))
      .finally(() => setOrderLoading(false));
  }, [getOrder, orderId]);

  useEffect(loadOrder, [loadOrder]);

  const resolveStop = (choice: StopChoice, other: Stop | null): Stop | null => {
    if (choice?.kind === 'saved') {
      const a = addresses.find(x => x.id === choice.id);
      return a ? fromSaved(a) : null;
    }
    if (choice?.kind === 'other') return other;
    return null;
  };

  const pickup = resolveStop(pickupChoice, pickupOther);
  const dropoff = resolveStop(dropoffChoice, dropoffOther);

  // Fare guide once both ends have coordinates.
  const pLat = pickup?.lat;
  const pLng = pickup?.lng;
  const dLat = dropoff?.lat;
  const dLng = dropoff?.lng;
  useEffect(() => {
    if (pLat == null || pLng == null || dLat == null || dLng == null) {
      setEstimate(null);
      return;
    }
    let alive = true;
    deliveryApi
      .estimate({ pickupLat: pLat, pickupLng: pLng, dropoffLat: dLat, dropoffLng: dLng })
      .then(r => alive && setEstimate(r))
      .catch(() => alive && setEstimate(null));
    return () => {
      alive = false;
    };
  }, [pLat, pLng, dLat, dLng]);

  const fareNum = Number(fare.replace(',', '.'));
  const fareOk = Number.isFinite(fareNum) && fareNum >= 1;
  const isOrder = Boolean(orderId);
  const timingOk = timing === 'asap' || slot != null;

  const missing: string[] = [];
  if (!isOrder) {
    if (!pickup) missing.push('pickup address');
    if (!dropoff) missing.push('drop-off address');
    if (!recipientName.trim()) missing.push('recipient name');
    if (parcel.trim().length < 2) missing.push('what you are sending');
    if (!senderPhoneValid) missing.push('a valid sender phone');
    if (!recipientPhoneValid) missing.push('a valid recipient phone');
  }
  if (!fareOk) missing.push('your fare (at least 1.00)');
  if (!timingOk) missing.push('a pickup time');
  const canSubmit = missing.length === 0 && !submitting;

  const submit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    setError(null);
    try {
      const scheduledPickupAt = timing === 'scheduled' && slot ? slot.toISOString() : undefined;
      const common = {
        proposedFare: Math.round(fareNum * 100) / 100,
        notes: notes.trim() || undefined,
        scheduledPickupAt,
      };
      const delivery = isOrder
        ? await deliveryApi.create({ type: 'order', orderId, ...common })
        : await deliveryApi.create({
            type: 'package',
            pickup: {
              label: pickup!.label,
              address: pickup!.address,
              lat: pickup!.lat ?? undefined,
              lng: pickup!.lng ?? undefined,
              phone: senderPhone || undefined,
            },
            dropoff: {
              label: recipientName.trim(),
              address: dropoff!.address,
              lat: dropoff!.lat ?? undefined,
              lng: dropoff!.lng ?? undefined,
            },
            recipientName: recipientName.trim(),
            recipientPhone: recipientPhone || undefined,
            parcel: parcel.trim(),
            currency: 'USD',
            region: pickup!.state || undefined,
            ...common,
          });
      navigation.replace('DeliveryDetail', { deliveryId: delivery.id });
    } catch (err) {
      setError(ApiError.messageOf(err, 'Could not send your request. Please try again.'));
      setSubmitting(false);
    }
  };

  const title = isOrder ? 'Get a DoHuub rider' : 'Send a Package';

  if (isOrder && (orderLoading || orderError || !order)) {
    return (
      <MainScreenLayout edges={['top', 'bottom']}>
        <SubScreenHeader title={title} onBack={() => navigation.goBack()} />
        {orderLoading ? <LoadingState /> : <ErrorState message={orderError || 'Order not found'} onRetry={loadOrder} />}
      </MainScreenLayout>
    );
  }

  const daySlots = days.find(d => d.key === dayKey)?.slots ?? [];
  const currency = order?.currency ?? 'USD';
  const guide = estimate?.fareGuide;

  return (
    <MainScreenLayout edges={['top', 'bottom']}>
      <SubScreenHeader
        title={title}
        subtitle={isOrder ? `Order ${order?.reference ?? ''}` : 'A DoHuub rider picks it up and drops it off'}
        onBack={() => navigation.goBack()}
      />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
        <ScrollView
          ref={scrollRef}
          testID="send-package-scroll"
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          automaticallyAdjustKeyboardInsets
        >
          {isOrder && order ? (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Route</Text>
              <View style={styles.stopRow}>
                <View style={[styles.stopBadge, { backgroundColor: colors.primary }]}>
                  <Text style={styles.stopBadgeText}>A</Text>
                </View>
                <View style={styles.stopBody}>
                  <Text style={styles.stopTitle}>{order.store?.name || order.vendor?.businessName || 'Store'}</Text>
                  <Text style={styles.stopLine}>The rider collects your order from the store</Text>
                </View>
              </View>
              <View style={styles.stopConnector} />
              <View style={styles.stopRow}>
                <View style={[styles.stopBadge, { backgroundColor: colors.success }]}>
                  <Text style={styles.stopBadgeText}>B</Text>
                </View>
                <View style={styles.stopBody}>
                  <Text style={styles.stopTitle}>Your delivery address</Text>
                  <Text style={styles.stopLine}>
                    {[order.deliveryAddress?.address, order.deliveryAddress?.city, order.deliveryAddress?.state]
                      .filter(Boolean)
                      .join(', ') || 'The address on your order'}
                  </Text>
                </View>
              </View>
            </View>
          ) : (
            <>
              <StopPicker
                badge="A"
                badgeColor={colors.primary}
                title="Pickup"
                addresses={addresses}
                choice={pickupChoice}
                onChoose={setPickupChoice}
                other={pickupOther}
                onOther={setPickupOther}
                testPrefix="pickup"
                onRevealSearch={revealSearch}
              />
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Sender contact</Text>
                <PhoneField
                  label="Phone the rider can call at pickup"
                  value={senderPhone}
                  required={false}
                  onChange={(v, valid) => {
                    setSenderPhone(v);
                    setSenderPhoneValid(valid);
                  }}
                />
              </View>
              <StopPicker
                badge="B"
                badgeColor={colors.success}
                title="Drop-off"
                addresses={addresses}
                choice={dropoffChoice}
                onChoose={setDropoffChoice}
                other={dropoffOther}
                onOther={setDropoffOther}
                testPrefix="dropoff"
                onRevealSearch={revealSearch}
              />
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Recipient</Text>
                <TextField
                  label="Recipient name"
                  testID="recipient-name"
                  value={recipientName}
                  onChangeText={setRecipientName}
                  placeholder="Who receives the package?"
                  autoCapitalize="words"
                />
                <PhoneField
                  label="Recipient phone (optional)"
                  value={recipientPhone}
                  required={false}
                  onChange={(v, valid) => {
                    setRecipientPhone(v);
                    setRecipientPhoneValid(valid);
                  }}
                />
              </View>
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Package</Text>
                <TextField
                  label="What are you sending?"
                  testID="parcel-description"
                  value={parcel}
                  onChangeText={setParcel}
                  placeholder="e.g. Small box, documents, keys"
                  autoCapitalize="sentences"
                />
              </View>
            </>
          )}

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Notes for the rider</Text>
            <TextInput
              testID="delivery-notes"
              style={[styles.input, styles.inputMultiline]}
              value={notes}
              onChangeText={setNotes}
              placeholder="Gate code, floor, handle with care…"
              placeholderTextColor={colors.textFaint}
              multiline
            />
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Pickup time</Text>
            <View style={styles.segment}>
              {(['asap', 'scheduled'] as const).map(t => (
                <TouchableOpacity
                  key={t}
                  testID={`timing-${t}`}
                  style={[styles.segmentItem, timing === t && styles.segmentItemActive]}
                  onPress={() => setTiming(t)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.segmentText, timing === t && styles.segmentTextActive]}>
                    {t === 'asap' ? 'ASAP' : 'Schedule'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {timing === 'scheduled' ? (
              <View style={{ marginTop: 12 }}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipWrap}>
                  {days.map(d => (
                    <TouchableOpacity
                      key={d.key}
                      style={[styles.chip, dayKey === d.key && styles.chipActive]}
                      onPress={() => {
                        setDayKey(d.key);
                        setSlot(null);
                      }}
                    >
                      <Text style={[styles.chipText, dayKey === d.key && styles.chipTextActive]}>{d.label}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
                <View style={[styles.chipWrap, { marginTop: 10 }]}>
                  {daySlots.map(s => {
                    const active = slot?.getTime() === s.getTime();
                    return (
                      <TouchableOpacity
                        key={s.toISOString()}
                        style={[styles.chip, active && styles.chipActive]}
                        onPress={() => setSlot(s)}
                      >
                        <Text style={[styles.chipText, active && styles.chipTextActive]}>{formatSlot(s)}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            ) : (
              <Text style={styles.hint}>Nearby riders see your request right away.</Text>
            )}
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Your fare</Text>
            <View style={styles.fareRow}>
              <Text style={styles.fareCurrency}>{currency}</Text>
              <TextInput
                testID="fare-input"
                style={[styles.input, styles.fareInput]}
                value={fare}
                onChangeText={t => setFare(t.replace(/[^0-9.,]/g, ''))}
                placeholder="0.00"
                placeholderTextColor={colors.textFaint}
                keyboardType="decimal-pad"
                returnKeyType="done"
              />
            </View>
            {guide ? (
              <TouchableOpacity
                testID="fare-guide"
                style={styles.guide}
                activeOpacity={0.8}
                onPress={() => setFare(String(Math.round((guide.min + guide.max) / 2)))}
              >
                <Icon name="bulb-outline" size={18} color={colors.primaryDark} />
                <Text style={styles.guideText}>
                  Riders usually take {currency} {guide.min}–{guide.max} for this trip
                  {estimate?.distanceKm != null ? ` · ${estimate.distanceKm} km` : ''}
                  {estimate?.etaMinutes != null ? ` · ~${estimate.etaMinutes} min` : ''}. Tap to use{' '}
                  {Math.round((guide.min + guide.max) / 2)}.
                </Text>
              </TouchableOpacity>
            ) : null}
            <Text style={styles.hint}>
              You set the price. Riders accept it, decline, or counter once — then you choose. You pay by card up front;
              no cash.
            </Text>
          </View>

          {error ? <ErrorBanner message={error} /> : null}
          {missing.length > 0 && !submitting ? (
            <Text style={[styles.hint, { textAlign: 'center', marginBottom: 10 }]}>Add {missing.join(', ')}.</Text>
          ) : null}

          <PrimaryButton
            testID="send-package-submit"
            label={isOrder ? 'Request a rider' : 'Find a rider'}
            onPress={submit}
            disabled={!canSubmit}
            loading={submitting}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </MainScreenLayout>
  );
}
