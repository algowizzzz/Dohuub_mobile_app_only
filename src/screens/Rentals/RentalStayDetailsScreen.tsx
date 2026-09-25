import React, { useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Calendar, House, Minus, Plus } from 'lucide-react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';
import { colors } from '../../styles';
import MainScreenLayout from '../../components/layout/MainScreenLayout';
import SubScreenHeader from '../../components/layout/SubScreenHeader';
import LoadingState from '../../components/ui/LoadingState';
import ErrorState from '../../components/ui/ErrorState';
import { BookingFooter, GradientFill } from './bookingParts';
import { FG, MUTED_FG, styles, TEAL_GRADIENT, TEAL_TEXT, TEAL_TINT } from './bookingStyles';
import {
  formatDateKey,
  formatMoney,
  nightsBetween,
  stayDuration,
  stayPricing,
  useRentalStay,
} from './rentalBooking';

type Props = NativeStackScreenProps<RootStackParamList, 'RentalStayDetails'>;

function Stepper({
  value,
  onMinus,
  onPlus,
  minusDisabled,
  plusDisabled,
  label,
}: {
  value: number;
  onMinus: () => void;
  onPlus: () => void;
  minusDisabled: boolean;
  plusDisabled: boolean;
  label: string;
}) {
  return (
    <View style={styles.stepper}>
      <TouchableOpacity
        style={[styles.stepButton, styles.stepMinus, minusDisabled && styles.stepDisabled]}
        onPress={onMinus}
        disabled={minusDisabled}
        accessibilityLabel={`Fewer ${label}`}
      >
        <Minus size={16} color={FG} strokeWidth={2} />
      </TouchableOpacity>
      <Text style={styles.stepCount}>{value}</Text>
      <TouchableOpacity
        style={[styles.stepButton, plusDisabled && styles.stepDisabled]}
        onPress={onPlus}
        disabled={plusDisabled}
        accessibilityLabel={`More ${label}`}
      >
        <GradientFill colors={TEAL_GRADIENT} />
        <Plus size={16} color={colors.white} strokeWidth={2} />
      </TouchableOpacity>
    </View>
  );
}

/** Step 2 of a rental booking — guests and special requests for the chosen dates. */
export default function RentalStayDetailsScreen({ navigation, route }: Props) {
  const { propertyId, checkIn, checkOut } = route.params;
  const { property, loading, error, reload } = useRentalStay(propertyId);

  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [specialRequests, setSpecialRequests] = useState('');

  if (loading) {
    return (
      <MainScreenLayout edges={['top', 'bottom']}>
        <SubScreenHeader title="Stay Details" onBack={() => navigation.goBack()} />
        <LoadingState />
      </MainScreenLayout>
    );
  }

  if (error || !property) {
    return (
      <MainScreenLayout edges={['top', 'bottom']}>
        <SubScreenHeader title="Stay Details" onBack={() => navigation.goBack()} />
        <ErrorState message={error ?? 'Property not found'} onRetry={reload} />
      </MainScreenLayout>
    );
  }

  const nights = nightsBetween(checkIn, checkOut);
  const duration = stayDuration(nights);
  // A blank max-guests field means the vendor set no cap.
  const cap = property.maxGuests > 0 ? property.maxGuests : Infinity;
  const totalGuests = adults + children;
  const full = totalGuests >= cap;
  const { accommodation, accommodationLabel, cleaningFee, serviceFee, subtotal } =
    stayPricing(property, nights);

  return (
    <MainScreenLayout edges={['top', 'bottom']}>
      <SubScreenHeader title="Stay Details" onBack={() => navigation.goBack()} />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
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
                {property.location ? (
                  <Text style={[styles.textSm, styles.mb2]}>{property.location}</Text>
                ) : null}
                <View style={styles.summaryDuration}>
                  <Calendar size={16} color={TEAL_TEXT} />
                  <Text style={styles.summaryDurationText}>{duration}</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={[styles.headingLg, styles.mb3]}>Your Dates</Text>
            <View style={styles.gap2}>
              <View style={styles.rowBetween}>
                <Text style={styles.textMuted}>Check-in</Text>
                <Text style={styles.text}>{formatDateKey(checkIn)}</Text>
              </View>
              <View style={styles.rowBetween}>
                <Text style={styles.textMuted}>Check-out</Text>
                <Text style={styles.text}>{formatDateKey(checkOut)}</Text>
              </View>
              <View style={[styles.divider, styles.rowBetween]}>
                <Text style={styles.text}>Duration</Text>
                <Text style={styles.textTeal}>{duration}</Text>
              </View>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={[styles.heading, styles.mb4]}>Number of Guests</Text>

            <View style={[styles.guestRow, styles.mb4]}>
              <View>
                <Text style={styles.text}>Adults</Text>
                <Text style={styles.textSm}>Age 13+</Text>
              </View>
              <Stepper
                label="adults"
                value={adults}
                onMinus={() => setAdults(n => Math.max(1, n - 1))}
                onPlus={() => setAdults(n => Math.min(cap - children, n + 1))}
                minusDisabled={adults <= 1}
                plusDisabled={full}
              />
            </View>

            <View style={styles.guestRow}>
              <View>
                <Text style={styles.text}>Children</Text>
                <Text style={styles.textSm}>Age 2-12</Text>
              </View>
              <Stepper
                label="children"
                value={children}
                onMinus={() => setChildren(n => Math.max(0, n - 1))}
                onPlus={() => setChildren(n => Math.min(cap - adults, n + 1))}
                minusDisabled={children <= 0}
                plusDisabled={full}
              />
            </View>

            {Number.isFinite(cap) ? (
              <Text style={styles.guestNote}>Maximum {cap} guests allowed</Text>
            ) : null}
          </View>

          <View>
            <Text style={[styles.heading, styles.mb2]}>
              Special Requests <Text style={styles.mutedColor}>(Optional)</Text>
            </Text>
            <TextInput
              style={styles.textArea}
              value={specialRequests}
              onChangeText={setSpecialRequests}
              placeholder="Any special requests or requirements?"
              placeholderTextColor={MUTED_FG}
              multiline
              textAlignVertical="top"
              maxLength={1000}
            />
          </View>

          <View style={styles.tintBox}>
            <GradientFill colors={TEAL_TINT} />
            <Text style={[styles.heading, styles.mb4]}>Price Breakdown</Text>
            <View style={styles.gap3}>
              {/* Both fees always show, as $0 when the vendor left them blank. */}
              <View style={styles.rowBetween}>
                <Text style={styles.textMuted}>{accommodationLabel}</Text>
                <Text style={styles.text}>${formatMoney(accommodation)}</Text>
              </View>
              <View style={styles.rowBetween}>
                <Text style={styles.textMuted}>Cleaning fee</Text>
                <Text style={styles.text}>${formatMoney(cleaningFee)}</Text>
              </View>
              <View style={styles.rowBetween}>
                <Text style={styles.textMuted}>Service fee</Text>
                <Text style={styles.text}>${formatMoney(serviceFee)}</Text>
              </View>
              <View style={[styles.tealDivider, styles.rowBetween]}>
                <Text style={styles.text}>Total</Text>
                <Text style={styles.totalValueXl}>${formatMoney(subtotal)}</Text>
              </View>
            </View>
          </View>
        </ScrollView>

        <BookingFooter
          label="Continue to Booking"
          onPress={() =>
            navigation.navigate('RentalConfirm', {
              propertyId,
              checkIn,
              checkOut,
              adults,
              children,
              specialRequests: specialRequests.trim() || undefined,
            })
          }
        />
      </KeyboardAvoidingView>
    </MainScreenLayout>
  );
}
