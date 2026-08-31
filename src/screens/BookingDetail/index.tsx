import React, { useEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';
import { colors } from '../../styles';
import ScreenStatusBar from '../../components/layout/ScreenStatusBar';
import SubScreenHeader from '../../components/layout/SubScreenHeader';
import PrimaryButton from '../../components/ui/PrimaryButton';
import ConfirmModal from '../../components/ui/ConfirmModal';
import LoadingState from '../../components/ui/LoadingState';
import ErrorState from '../../components/ui/ErrorState';
import ErrorBanner from '../../components/ui/ErrorBanner';
import { ApiError } from '../../services/ApiError';
import { useBookingStore } from '../../store/bookingStore';
import { useAddressStore } from '../../store/addressStore';
import type { ApiBooking } from '../../services/bookingApi';
import { formatScheduledTime } from '../Bookings/statusMeta';
import { ADDRESS_TYPE_META, formatAddressLine } from '../SavedAddresses/addresses';
import { buildTimeline } from './timeline';
import TimelineStepRow from './components/TimelineStepRow';
import DetailInfoRow from './components/DetailInfoRow';
import ReviewSection from './components/ReviewSection';
import { styles } from './styles';

type Props = NativeStackScreenProps<RootStackParamList, 'BookingDetail'>;

export default function BookingDetailScreen({ navigation, route }: Props) {
  const getBooking = useBookingStore(state => state.getBooking);
  const cancelBooking = useBookingStore(state => state.cancel);
  const addresses = useAddressStore(state => state.addresses);
  const loadAddresses = useAddressStore(state => state.load);
  const [booking, setBooking] = useState<ApiBooking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelVisible, setCancelVisible] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    setError(null);
    getBooking(route.params.bookingId)
      .then(setBooking)
      .catch(err => setError(ApiError.messageOf(err, 'Could not load this booking.')))
      .finally(() => setLoading(false));
  };

  useEffect(load, [route.params.bookingId]);

  useEffect(() => {
    loadAddresses().catch(() => {});
  }, [loadAddresses]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <ScreenStatusBar backgroundColor={colors.white} barStyle="dark-content" />
        <SubScreenHeader title="Order Status" onBack={() => navigation.goBack()} />
        <LoadingState />
      </SafeAreaView>
    );
  }

  if (error || !booking) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <ScreenStatusBar backgroundColor={colors.white} barStyle="dark-content" />
        <SubScreenHeader title="Order Status" onBack={() => navigation.goBack()} />
        <ErrorState message={error ?? 'Booking not found.'} onRetry={load} />
      </SafeAreaView>
    );
  }

  const timeline = buildTimeline(booking);
  const isCancelled = booking.status === 'cancelled' || booking.status === 'rejected';
  const isUnpaid =
    (booking.paymentStatus === 'unpaid' || booking.paymentStatus === 'requires_payment_method') &&
    !isCancelled;
  const cancellable = booking.status === 'pending' || booking.status === 'confirmed';

  const savedAddress = addresses.find(item => item.id === booking.serviceAddressId);
  const addressTypeLabel = savedAddress
    ? ADDRESS_TYPE_META[savedAddress.type].label
    : 'Address';
  const addressLine = savedAddress
    ? formatAddressLine(savedAddress)
    : booking.address
      ? [booking.address.address, booking.address.city, booking.address.state, booking.address.zipCode]
          .filter(Boolean)
          .join(', ')
      : '';

  const handleCancelConfirmed = async () => {
    setCancelling(true);
    setActionError(null);
    try {
      await cancelBooking(booking.id);
      setCancelVisible(false);
      navigation.goBack();
    } catch (err) {
      setCancelVisible(false);
      setActionError(ApiError.messageOf(err, 'Could not cancel this booking.'));
    } finally {
      setCancelling(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScreenStatusBar backgroundColor={colors.white} barStyle="dark-content" />
      <SubScreenHeader title="Order Status" onBack={() => navigation.goBack()} />

      <View style={styles.body}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <TouchableOpacity
            style={styles.serviceCard}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('Vendor', { vendorId: booking.vendorId })}
          >
            <LinearGradient
              colors={[colors.gradientCtaStart, colors.gradientCtaEnd]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.serviceIconWrap}
            >
              <Icon name="sparkles" size={24} color={colors.white} />
            </LinearGradient>
            <View style={styles.serviceInfo}>
              <Text style={styles.serviceName}>{booking.service.name}</Text>
              <Text style={styles.serviceVendor}>{booking.vendor.businessName}</Text>
              {booking.pointsEarned > 0 ? (
                <View style={styles.pointsPill}>
                  <Text style={styles.pointsPillText}>+{booking.pointsEarned} pts earned</Text>
                </View>
              ) : null}
            </View>
            <Icon name="chevron-forward" size={18} color={colors.textMuted} />
          </TouchableOpacity>

          <Text style={styles.orderRef}>Order {booking.reference}</Text>

          {isCancelled ? (
            <View style={styles.cancelledBanner}>
              <Icon name="close-circle" size={18} color={colors.danger} />
              <Text style={styles.cancelledBannerText}>
                This booking was {booking.status === 'rejected' ? 'declined' : 'cancelled'}
                {booking.cancellationReason ? ` — ${booking.cancellationReason}` : ''}
              </Text>
            </View>
          ) : (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Order Timeline</Text>
              {timeline.map((step, index) => (
                <TimelineStepRow key={step.key} step={step} isLast={index === timeline.length - 1} />
              ))}
            </View>
          )}

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Service Details</Text>
            <DetailInfoRow
              icon="calendar-outline"
              label="Scheduled Date & Time"
              value={`${booking.scheduledDate} at ${formatScheduledTime(booking.scheduledTime)}`}
              isLast={!addressLine}
            />
            {addressLine ? (
              <DetailInfoRow
                icon="location-outline"
                label="Service Address"
                value={addressTypeLabel}
                secondaryValue={addressLine}
                isLast
              />
            ) : null}
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Payment</Text>
            <View style={styles.paymentRow}>
              <Text style={styles.paymentLabel}>Service price</Text>
              <Text style={styles.paymentValue}>${booking.servicePrice}</Text>
            </View>
            {booking.discountAmount > 0 ? (
              <View style={styles.paymentRow}>
                <Text style={styles.paymentLabel}>Points discount</Text>
                <Text style={styles.paymentDiscount}>-${booking.discountAmount}</Text>
              </View>
            ) : null}
            <View style={styles.paymentDivider} />
            <View style={styles.paymentRow}>
              <Text style={styles.totalLabel}>
                {booking.paymentStatus === 'paid' ? 'Total paid' : 'Total due'}
              </Text>
              <Text style={styles.totalValue}>${booking.totalAmount}</Text>
            </View>
          </View>

          {booking.review ? <ReviewSection review={booking.review} /> : null}

          {booking.status === 'completed' && !booking.review ? (
            <TouchableOpacity
              style={styles.leaveReviewButton}
              activeOpacity={0.85}
              onPress={() => navigation.navigate('LeaveReview', { bookingId: booking.id })}
            >
              <Icon name="star-outline" size={16} color={colors.primary} />
              <Text style={styles.leaveReviewLabel}>Leave a Review</Text>
            </TouchableOpacity>
          ) : null}

          {isUnpaid ? (
            <PrimaryButton
              label="Pay for this booking"
              onPress={() => navigation.navigate('Payment', { bookingId: booking.id })}
              style={styles.payButton}
            />
          ) : null}

          {actionError ? <ErrorBanner message={actionError} /> : null}

          {cancellable ? (
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setCancelVisible(true)}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelButtonLabel}>Cancel booking</Text>
            </TouchableOpacity>
          ) : null}

          {booking.status === 'completed' ? (
            <TouchableOpacity
              style={styles.bookAgainButton}
              activeOpacity={0.7}
              onPress={() =>
                navigation.navigate('BookService', {
                  vendorId: booking.vendorId,
                  serviceId: booking.service.id,
                })
              }
            >
              <Text style={styles.bookAgainLabel}>Book again</Text>
            </TouchableOpacity>
          ) : null}
        </ScrollView>
      </View>

      <ConfirmModal
        visible={cancelVisible}
        title="Cancel booking"
        message="Are you sure you want to cancel this booking? This can't be undone."
        icon="close-circle-outline"
        iconTone="danger"
        confirmLabel={cancelling ? 'Cancelling…' : 'Cancel booking'}
        cancelLabel="Keep booking"
        onConfirm={handleCancelConfirmed}
        onCancel={() => setCancelVisible(false)}
      />
    </SafeAreaView>
  );
}
