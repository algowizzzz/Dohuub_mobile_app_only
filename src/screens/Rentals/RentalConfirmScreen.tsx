import React, { useCallback, useEffect, useState } from 'react';
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { CommonActions, useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Calendar,
  ChevronDown,
  ChevronRight,
  Coins,
  CreditCard,
  Gift,
  House,
  Users,
} from 'lucide-react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';
import { colors } from '../../styles';
import MainScreenLayout from '../../components/layout/MainScreenLayout';
import SubScreenHeader from '../../components/layout/SubScreenHeader';
import LoadingState from '../../components/ui/LoadingState';
import ErrorState from '../../components/ui/ErrorState';
import ErrorBanner from '../../components/ui/ErrorBanner';
import ConfirmModal from '../../components/ui/ConfirmModal';
import { ApiError } from '../../services/ApiError';
import { bookingsApi, type ApiBooking } from '../../services/bookingApi';
import type { ApiCard } from '../../services/accountApi';
import { useAddressStore } from '../../store/addressStore';
import { useServiceLocationStore } from '../../store/serviceLocationStore';
import { usePaymentCardStore } from '../../store/paymentCardStore';
import { useBookingStore } from '../../store/bookingStore';
import { useRewardsStore } from '../../store/rewardsStore';
import { ADDRESS_TYPE_META, formatAddressLine } from '../SavedAddresses/addresses';
import { BookingFooter, GradientFill } from './bookingParts';
import {
  AMBER_TINT,
  FG,
  GREEN_GRADIENT,
  GREEN_TINT,
  MUTED_FG,
  styles,
  TEAL,
  TEAL_GRADIENT,
  TEAL_TINT,
} from './bookingStyles';
import {
  formatDateKey,
  nightsBetween,
  stayDuration,
  stayPricing,
  useRentalStay,
} from './rentalBooking';
import Price from '../../components/ui/Price';
import { pointsRateText } from '../../components/ui/EarnPointsCard';
import { useDisplayCurrency, useFormatMoney } from '../../store/currencyStore';

type Props = NativeStackScreenProps<RootStackParamList, 'RentalConfirm'>;

const cardTitle = (card: ApiCard) => `•••• ${card.last4}`;
const cardSubtitle = (card: ApiCard) =>
  card.cardHolderName || card.brand.charAt(0).toUpperCase() + card.brand.slice(1);

/** Turn the booking endpoint's rental error codes into something a guest can act on. */
function createErrorMessage(err: unknown, maxGuests: number): string {
  if (err instanceof ApiError) {
    if (err.code === 'SLOT_UNAVAILABLE') {
      return 'Those dates were just booked. Go back and pick different dates.';
    }
    if (err.code === 'TOO_MANY_GUESTS') {
      return maxGuests > 0
        ? `This property allows at most ${maxGuests} guests.`
        : 'Too many guests for this property.';
    }
    if (err.code === 'INVALID_STAY') {
      return ApiError.messageOf(err, 'Those dates are not a valid stay. Please pick them again.');
    }
  }
  return ApiError.messageOf(err, 'Could not create this booking.');
}

/**
 * Step 3 of a rental booking — billing address, card, points, then pay.
 *
 * Payment is the regular booking flow: `POST /bookings` (rental fields), then
 * the booking store's `pay()` with the chosen saved card, exactly what the
 * Payment screen does for a slot booking. A booking that was created but whose
 * payment failed is kept and paid again on retry, so a second tap never holds
 * the same nights twice.
 */
export default function RentalConfirmScreen({ navigation, route }: Props) {
  const { propertyId, checkIn, checkOut, adults, children, specialRequests } = route.params;
  const { property, loading, error, reload } = useRentalStay(propertyId);
  const insets = useSafeAreaInsets();

  const addresses = useAddressStore(state => state.addresses);
  const loadAddresses = useAddressStore(state => state.load);
  const selectedAddressId = useServiceLocationStore(state => state.selectedAddressId);
  const setSelectedAddressId = useServiceLocationStore(state => state.setSelectedAddressId);
  const cards = usePaymentCardStore(state => state.cards);
  const loadCards = usePaymentCardStore(state => state.load);
  const pay = useBookingStore(state => state.pay);
  const setConfirmation = useBookingStore(state => state.setConfirmation);
  const balance = useRewardsStore(state => state.balance);
  const loadBalance = useRewardsStore(state => state.loadBalance);

  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [cardSheetVisible, setCardSheetVisible] = useState(false);
  const [choosingAddress, setChoosingAddress] = useState(false);
  const [redeemPoints, setRedeemPoints] = useState(false);
  const [pendingBooking, setPendingBooking] = useState<ApiBooking | null>(null);
  const [confirmed, setConfirmed] = useState<ApiBooking | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const displayCurrency = useDisplayCurrency();
  const formatPrice = useFormatMoney();

  // Refresh on focus so an address or card added on the way back shows up.
  useFocusEffect(
    useCallback(() => {
      loadAddresses().catch(() => {});
      loadCards().catch(() => {});
      loadBalance().catch(() => {});
    }, [loadAddresses, loadCards, loadBalance]),
  );

  useEffect(() => {
    if (!selectedCardId && cards.length > 0) {
      setSelectedCardId(cards.find(card => card.isDefault)?.id ?? cards[0].id);
    }
  }, [cards, selectedCardId]);

  const header = <SubScreenHeader title="Confirm Booking" onBack={() => navigation.goBack()} />;

  if (loading) {
    return (
      <MainScreenLayout edges={['top', 'bottom']}>
        {header}
        <LoadingState />
      </MainScreenLayout>
    );
  }

  if (error || !property) {
    return (
      <MainScreenLayout edges={['top', 'bottom']}>
        {header}
        <ErrorState message={error ?? 'Property not found'} onRetry={reload} />
      </MainScreenLayout>
    );
  }

  const nights = nightsBetween(checkIn, checkOut);
  const guests = adults + children;
  const { accommodation, accommodationLabel, cleaningFee, serviceFee, subtotal } =
    stayPricing(property, nights, displayCurrency);
  // Charged in the listing's currency; a created booking carries its own.
  const currency = pendingBooking?.currency || property.currency;

  // Same address rule as checkout: the one picked for this session, else the
  // default, else the first saved address.
  const address =
    addresses.find(a => a.id === selectedAddressId) ??
    addresses.find(a => a.isDefault) ??
    addresses[0] ??
    null;
  const selectedCard = cards.find(card => card.id === selectedCardId) ?? null;

  // Points are a DoHuub perk: only "Powered by DoHuub" vendors accept them
  // (the API answers NOT_POWERED_BY_DOHUUB otherwise), same gate as BookService.
  const powered = property.poweredByDoHuub;
  const perDollar = balance?.conversion.pointsPerCurrencyUnit ?? 100;
  const availablePoints = powered ? balance?.balance ?? 0 : 0;
  // Whole dollars only, and never more than the stay costs.
  const redeemablePoints =
    Math.floor(Math.min(availablePoints, subtotal * perDollar) / perDollar) * perDollar;
  const canRedeem =
    redeemablePoints > 0 && availablePoints >= (balance?.conversion.minimumRedeemable ?? 0);
  const pointsToRedeem = redeemPoints && canRedeem ? redeemablePoints : 0;

  // Once the booking exists, its server-computed figures are the truth.
  const discount = pendingBooking
    ? Number(pendingBooking.discountAmount || 0)
    : Math.floor(pointsToRedeem / perDollar);
  const total = pendingBooking
    ? Number(pendingBooking.totalAmount)
    : Math.max(0, subtotal - discount);
  const pointsUsed = pendingBooking ? Number(pendingBooking.pointsRedeemed || 0) : pointsToRedeem;
  const earnRate = property.pointsPerDollar > 0 ? property.pointsPerDollar : 1;
  const pointsToEarn = powered ? Math.floor(total * earnRate) : 0;

  const canConfirm = !!address && !!selectedCardId && !submitting;

  const handleConfirm = async () => {
    if (!canConfirm || !address || !selectedCardId) return;
    setSubmitting(true);
    setSubmitError(null);

    let booking = pendingBooking;
    if (!booking) {
      try {
        booking = await bookingsApi.create({
          serviceCategoryId: property.id,
          serviceAddressId: address.id,
          scheduledDate: checkIn,
          checkOutDate: checkOut,
          adults,
          children,
          specialRequests,
          pointsToRedeem: pointsToRedeem || undefined,
        });
        setConfirmation(booking);
        setPendingBooking(booking);
      } catch (err) {
        setSubmitError(createErrorMessage(err, property.maxGuests));
        setSubmitting(false);
        return;
      }
    }

    try {
      const paid = await pay(booking.id, { paymentMethodId: selectedCardId, confirmNow: true });
      if (paid.paymentStatus === 'failed' || paid.paymentStatus === 'requires_payment_method') {
        setSubmitError(paid.paymentFailureReason || 'Payment failed. Please try another card.');
      } else {
        setConfirmed(paid);
      }
    } catch (err) {
      setSubmitError(ApiError.messageOf(err, 'Payment failed. Please try again.'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDone = () => {
    setConfirmed(null);
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Main', params: { screen: 'Bookings' } }],
      }),
    );
  };

  const dateRange = `${formatDateKey(checkIn)} - ${formatDateKey(checkOut)}`;

  return (
    <MainScreenLayout edges={['top', 'bottom']}>
      {header}

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Property summary */}
        <View style={styles.tintBox}>
          <GradientFill colors={TEAL_TINT} />
          <View style={styles.summaryRow}>
            {property.photo ? (
              <Image source={{ uri: property.photo }} style={styles.summaryImage} resizeMode="cover" />
            ) : (
              <View style={[styles.summaryImage, styles.summaryImageEmpty]}>
                <House size={28} color={MUTED_FG} />
              </View>
            )}
            <View style={styles.summaryInfo}>
              <Text style={[styles.heading, styles.mb1]}>{property.name}</Text>
              {property.location ? <Text style={styles.textSm}>{property.location}</Text> : null}
              {powered ? (
                <View style={styles.poweredPill}>
                  <GradientFill colors={[colors.gradientStart, colors.gradientEnd]} />
                  <Text style={styles.poweredPillText}>Powered by DoHuub</Text>
                </View>
              ) : null}
            </View>
          </View>
          <View style={styles.summaryMeta}>
            <View style={styles.summaryMetaRow}>
              <Calendar size={16} color={TEAL} />
              <Text style={styles.summaryMetaText}>{dateRange}</Text>
            </View>
            <View style={styles.summaryMetaRow}>
              <Users size={16} color={TEAL} />
              <Text style={styles.summaryMetaText}>
                {guests} {guests === 1 ? 'guest' : 'guests'} • {stayDuration(nights)}
              </Text>
            </View>
          </View>
        </View>

        {specialRequests ? (
          <View style={styles.card}>
            <Text style={[styles.heading, styles.mb2]}>Special Requests</Text>
            <Text style={styles.textMuted}>{specialRequests}</Text>
          </View>
        ) : null}

        {/* Billing address */}
        <View>
          <View style={styles.sectionHead}>
            <Text style={styles.heading}>Billing Address</Text>
            {addresses.length > 0 && !pendingBooking ? (
              <TouchableOpacity onPress={() => setChoosingAddress(v => !v)} hitSlop={8}>
                <Text style={styles.linkText}>{choosingAddress ? 'Done' : 'Change'}</Text>
              </TouchableOpacity>
            ) : null}
          </View>
          {address ? (
            <View style={styles.card}>
              <Text style={[styles.text, styles.mb1]}>
                {ADDRESS_TYPE_META[address.type]?.label ?? 'Address'}
              </Text>
              <Text style={styles.textSm}>{formatAddressLine(address)}</Text>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.dashedButton}
              onPress={() => navigation.navigate('AddAddress', { select: true })}
              activeOpacity={0.8}
            >
              <Text style={styles.textMuted}>+ Add Address</Text>
            </TouchableOpacity>
          )}
          {choosingAddress ? (
            <View style={styles.addressChoices}>
              {addresses.map(a => (
                <TouchableOpacity
                  key={a.id}
                  testID={`address-row-${a.id}`}
                  style={[styles.addressChoice, a.id === address?.id && styles.addressChoiceActive]}
                  onPress={() => {
                    setSelectedAddressId(a.id);
                    setChoosingAddress(false);
                  }}
                  activeOpacity={0.8}
                >
                  <Text style={styles.text}>{ADDRESS_TYPE_META[a.type]?.label ?? 'Address'}</Text>
                  <Text style={styles.textSm}>{formatAddressLine(a)}</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                style={styles.dashedButton}
                onPress={() => navigation.navigate('AddAddress', { select: true })}
                activeOpacity={0.8}
              >
                <Text style={styles.textMuted}>+ Add Address</Text>
              </TouchableOpacity>
            </View>
          ) : null}
        </View>

        {/* Payment method */}
        <View>
          <Text style={[styles.heading, styles.mb3]}>Payment Method</Text>
          {selectedCard ? (
            <TouchableOpacity
              style={[styles.card, styles.paymentRow]}
              onPress={() => setCardSheetVisible(true)}
              activeOpacity={0.8}
            >
              <View style={styles.cardIcon}>
                <GradientFill colors={TEAL_GRADIENT} />
                <CreditCard size={20} color={colors.white} />
              </View>
              <View style={styles.flex}>
                <Text style={styles.text}>{cardTitle(selectedCard)}</Text>
                <Text style={styles.textSm}>{cardSubtitle(selectedCard)}</Text>
              </View>
              <ChevronRight size={20} color={MUTED_FG} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.dashedButton}
              onPress={() => navigation.navigate('PaymentMethods')}
              activeOpacity={0.8}
            >
              <Text style={styles.textMuted}>+ Add Payment Card</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Points redemption — Powered by DoHuub only */}
        {powered && canRedeem ? (
          <View style={styles.pointsBox}>
            <GradientFill colors={GREEN_TINT} />
            <View style={styles.pointsHeader}>
              <View style={[styles.row, styles.gap3]}>
                <View style={styles.pointsIcon}>
                  <GradientFill colors={GREEN_GRADIENT} />
                  <Coins size={20} color={colors.white} />
                </View>
                <View>
                  <Text style={styles.pointsTitle}>Redeem Points</Text>
                  <Text style={styles.pointsSub}>
                    {availablePoints.toLocaleString()} pts available
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                style={[styles.toggle, !!pendingBooking && styles.ctaDisabled]}
                onPress={() => setRedeemPoints(v => !v)}
                disabled={!!pendingBooking}
                activeOpacity={0.8}
                accessibilityRole="switch"
                accessibilityState={{ checked: redeemPoints }}
                accessibilityLabel="Redeem points"
              >
                {redeemPoints ? <GradientFill colors={GREEN_GRADIENT} /> : null}
                <View style={[styles.toggleKnob, redeemPoints && styles.toggleKnobOn]} />
              </TouchableOpacity>
            </View>

            {redeemPoints ? (
              <View style={styles.pointsBody}>
                <View style={styles.pointsSummary}>
                  <View style={styles.rowBetween}>
                    <Text style={styles.pointsUsingLabel}>Using:</Text>
                    <View style={styles.row}>
                      <Text style={styles.pointsUsingValue}>{pointsUsed.toLocaleString()} pts</Text>
                      <Price amount={discount} currency={currency} style={styles.pointsUsingDiscount} align="right" prefix="-" />
                    </View>
                  </View>
                  <View style={styles.rowBetween}>
                    <Text style={styles.pointsUsingLabel}>Remaining balance:</Text>
                    <Text style={styles.pointsRemaining}>
                      {(availablePoints - pointsUsed).toLocaleString()} pts
                    </Text>
                  </View>
                </View>
              </View>
            ) : null}
          </View>
        ) : null}

        {/* Total */}
        <View style={styles.tintBox}>
          <GradientFill colors={TEAL_TINT} />
          <Text style={[styles.heading, styles.mb4]}>Total Amount</Text>
          <View style={styles.gap2}>
            {/* Both fees always show, as $0 when the vendor left them blank. */}
            <View style={styles.rowBetweenBaseline}>
              <Text style={styles.textMuted}>{accommodationLabel}</Text>
              <Price amount={accommodation} currency={currency} style={styles.text} align="right" compact />
            </View>
            <View style={styles.rowBetweenBaseline}>
              <Text style={styles.textMuted}>Cleaning fee</Text>
              <Price amount={cleaningFee} currency={currency} style={styles.text} align="right" compact />
            </View>
            <View style={styles.rowBetweenBaseline}>
              <Text style={styles.textMuted}>Service fee</Text>
              <Price amount={serviceFee} currency={currency} style={styles.text} align="right" compact />
            </View>
            <View style={[styles.tealDividerSm, styles.rowBetweenBaseline]}>
              <Text style={styles.textMuted}>Subtotal</Text>
              <Price
                amount={pendingBooking ? Number(pendingBooking.servicePrice) : subtotal}
                currency={currency}
                style={styles.text}
                align="right"
                compact
              />
            </View>
            {discount > 0 ? (
              <View style={styles.rowBetweenBaseline}>
                <Text style={styles.discountText}>
                  Points Discount ({pointsUsed.toLocaleString()} pts)
                </Text>
                <Price amount={discount} currency={currency} style={styles.discountText} align="right" prefix="-" />
              </View>
            ) : null}
            <View style={[styles.tealDividerSm, styles.rowBetweenBaseline]}>
              <Text style={styles.text}>Total</Text>
              <Price amount={total} currency={currency} style={styles.totalValue2xl} align="right" />
            </View>
          </View>
        </View>

        {/* Points preview — Powered by DoHuub only */}
        {powered && pointsToEarn > 0 ? (
          <View style={styles.earnBox}>
            <GradientFill colors={AMBER_TINT} />
            <View style={styles.rowBetween}>
              <View style={[styles.row, styles.gap2]}>
                <Gift size={20} color="#F59E0B" />
                <Text style={styles.earnTitle}>Points you'll earn</Text>
              </View>
              <Text style={styles.earnValue}>+{pointsToEarn} pts</Text>
            </View>
            <Text style={styles.earnSub}>
              {pointsRateText(property.pointsPerDollar, currency)} • Added after stay
            </Text>
          </View>
        ) : null}

        {submitError ? <ErrorBanner message={submitError} /> : null}
      </ScrollView>

      <BookingFooter
        label={`Confirm & Pay ${formatPrice(total, currency)}`}
        onPress={handleConfirm}
        disabled={!canConfirm}
        loading={submitting}
      />

      {/* Card picker — same saved cards the Payment screen lists */}
      <Modal
        visible={cardSheetVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setCardSheetVisible(false)}
      >
        <View style={styles.sheetOverlay}>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => setCardSheetVisible(false)}
            accessibilityLabel="Close"
          />
          <View style={styles.sheet}>
            <View style={styles.sheetHeader}>
              <Text style={styles.heading}>Select Payment Card</Text>
              <TouchableOpacity
                style={styles.sheetClose}
                onPress={() => setCardSheetVisible(false)}
                accessibilityLabel="Close"
              >
                <ChevronDown size={20} color={FG} strokeWidth={2} />
              </TouchableOpacity>
            </View>
            <ScrollView
              contentContainerStyle={[styles.sheetList, { paddingBottom: 24 + insets.bottom }]}
            >
              {cards.map(card => (
                <TouchableOpacity
                  key={card.id}
                  style={[styles.sheetCard, card.id === selectedCardId && styles.sheetCardActive]}
                  onPress={() => {
                    setSelectedCardId(card.id);
                    setCardSheetVisible(false);
                  }}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.text, styles.mb1]}>{cardTitle(card)}</Text>
                  <Text style={styles.textSm}>{cardSubtitle(card)}</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                style={styles.dashedButton}
                onPress={() => {
                  setCardSheetVisible(false);
                  navigation.navigate('PaymentMethods');
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.textMuted}>+ Add New Card</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      <ConfirmModal
        visible={!!confirmed}
        title="Booking confirmed"
        message={`Your stay at ${property.name} is booked for ${dateRange}. Reference ${
          confirmed?.reference ?? ''
        }.`}
        icon="checkmark-circle-outline"
        iconTone="warning"
        confirmLabel="View bookings"
        cancelLabel="Close"
        onConfirm={handleDone}
        onCancel={handleDone}
      />
    </MainScreenLayout>
  );
}
