import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { CommonActions, useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';
import { colors } from '../../styles';
import MainScreenLayout from '../../components/layout/MainScreenLayout';
import SubScreenHeader from '../../components/layout/SubScreenHeader';
import PrimaryButton from '../../components/ui/PrimaryButton';
import ConfirmModal from '../../components/ui/ConfirmModal';
import LoadingState from '../../components/ui/LoadingState';
import ErrorState from '../../components/ui/ErrorState';
import ErrorBanner from '../../components/ui/ErrorBanner';
import { ApiError } from '../../services/ApiError';
import { usePaymentCardStore } from '../../store/paymentCardStore';
import { useBookingStore } from '../../store/bookingStore';
import type { ApiBooking } from '../../services/bookingApi';
import { styles } from './styles';

type Props = NativeStackScreenProps<RootStackParamList, 'Payment'>;

function formatScheduled(booking: ApiBooking): { dateLabel: string; timeLabel: string } {
  const date = new Date(`${booking.scheduledDate}T00:00:00`);
  const dateLabel = date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const [hourStr, minuteStr] = booking.scheduledTime.split(':');
  let hour = Number(hourStr);
  const period = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12 || 12;
  const timeLabel = `${hour}:${minuteStr} ${period}`;

  return { dateLabel, timeLabel };
}

export default function PaymentScreen({ navigation, route }: Props) {
  const cards = usePaymentCardStore(state => state.cards);
  const loadCards = usePaymentCardStore(state => state.load);
  const getBooking = useBookingStore(state => state.getBooking);
  const pay = useBookingStore(state => state.pay);

  const [booking, setBooking] = useState<ApiBooking | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);
  const [successVisible, setSuccessVisible] = useState(false);

  const load = () => {
    setLoading(true);
    setLoadError(null);
    getBooking(route.params.bookingId)
      .then(setBooking)
      .catch(err => setLoadError((err as Error).message))
      .finally(() => setLoading(false));
  };

  useEffect(load, [route.params.bookingId]);

  useFocusEffect(
    useCallback(() => {
      loadCards().catch(() => {});
    }, [loadCards]),
  );

  useEffect(() => {
    if (!selectedCardId && cards.length > 0) {
      setSelectedCardId(cards.find(card => card.isDefault)?.id ?? cards[0].id);
    }
  }, [cards, selectedCardId]);

  if (loading) {
    return (
      <MainScreenLayout edges={['top', 'bottom']}>
        <SubScreenHeader title="Payment" onBack={() => navigation.goBack()} />
        <LoadingState />
      </MainScreenLayout>
    );
  }

  if (loadError || !booking) {
    return (
      <MainScreenLayout edges={['top', 'bottom']}>
        <SubScreenHeader title="Payment" onBack={() => navigation.goBack()} />
        <ErrorState message={loadError ?? 'Booking not found.'} onRetry={load} />
      </MainScreenLayout>
    );
  }

  const { dateLabel, timeLabel } = formatScheduled(booking);
  const canPay = !!selectedCardId && !submitting;

  const handlePay = async () => {
    if (!canPay || !selectedCardId) return;
    setSubmitting(true);
    setPayError(null);
    try {
      await pay(booking.id, { paymentMethodId: selectedCardId, confirmNow: true });
      setSuccessVisible(true);
    } catch (error) {
      setPayError(ApiError.messageOf(error, 'Payment failed. Please try again.'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDone = () => {
    setSuccessVisible(false);
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Main', params: { screen: 'Bookings' } }],
      }),
    );
  };

  return (
    <MainScreenLayout edges={['top', 'bottom']}>
      <SubScreenHeader title="Payment" onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Order Summary</Text>
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>{booking.service.name}</Text>
            <Text style={styles.summaryValue}>${booking.servicePrice}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Scheduled date</Text>
            <Text style={styles.summaryValueBold}>{dateLabel}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Select Time</Text>
            <Text style={styles.summaryValueBold}>{timeLabel}</Text>
          </View>
          {booking.discountAmount > 0 ? (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Points discount</Text>
              <Text style={styles.summaryDiscount}>-${booking.discountAmount}</Text>
            </View>
          ) : null}
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>${booking.totalAmount}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Payment Method</Text>

        {cards.length === 0 ? (
          <>
            <Text style={styles.emptyText}>No saved cards yet. Add one to pay for this booking.</Text>
            <TouchableOpacity
              style={styles.addCardButton}
              onPress={() => navigation.navigate('PaymentMethods')}
              activeOpacity={0.8}
            >
              <Icon name="add" size={16} color={colors.primary} />
              <Text style={styles.addCardLabel}>Add a card</Text>
            </TouchableOpacity>
          </>
        ) : (
          cards.map(card => {
            const isSelected = card.id === selectedCardId;
            return (
              <TouchableOpacity
                key={card.id}
                style={[styles.cardRow, isSelected && styles.cardRowSelected]}
                onPress={() => setSelectedCardId(card.id)}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={[colors.gradientCtaStart, colors.gradientCtaEnd]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.cardIconWrap}
                >
                  <Icon name="card" size={18} color={colors.white} />
                </LinearGradient>
                <Text style={styles.cardLabel}>
                  {card.brand.charAt(0).toUpperCase() + card.brand.slice(1)} •••• {card.last4}
                </Text>
                {isSelected ? <Icon name="checkmark-circle" size={18} color={colors.primary} /> : null}
              </TouchableOpacity>
            );
          })
        )}

        {payError ? <ErrorBanner message={payError} /> : null}

        <PrimaryButton
          label={submitting ? 'Processing…' : `Pay $${booking.totalAmount}`}
          onPress={handlePay}
          disabled={!canPay}
          loading={submitting}
          style={styles.payButton}
        />
      </ScrollView>

      <ConfirmModal
        visible={successVisible}
        title="Booking confirmed"
        message={`Your ${booking.service.name} booking with ${booking.vendor.businessName} is confirmed for ${dateLabel} at ${timeLabel}.`}
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
