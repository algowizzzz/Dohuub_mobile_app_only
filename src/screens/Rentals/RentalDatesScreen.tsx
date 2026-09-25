import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';
import MainScreenLayout from '../../components/layout/MainScreenLayout';
import SubScreenHeader from '../../components/layout/SubScreenHeader';
import { servicesApi } from '../../services/catalogApi';
import { BookingFooter, GradientFill } from './bookingParts';
import { FG, styles, TEAL_GRADIENT, TEAL_TINT } from './bookingStyles';
import {
  addDays,
  formatDateKey,
  nightsBetween,
  stayDuration,
  toDateKey,
} from './rentalBooking';

type Props = NativeStackScreenProps<RootStackParamList, 'RentalDates'>;

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

const monthKey = (d: Date) => toDateKey(d).slice(0, 7);

/** Weeks of the month as 7-slot rows; null pads the first and last week. */
function monthGrid(month: Date): Array<Array<string | null>> {
  const year = month.getFullYear();
  const m = month.getMonth();
  const daysInMonth = new Date(year, m + 1, 0).getDate();
  const cells: Array<string | null> = Array(new Date(year, m, 1).getDay()).fill(null);
  for (let day = 1; day <= daysInMonth; day++) cells.push(toDateKey(new Date(year, m, day)));
  while (cells.length % 7) cells.push(null);
  const rows: Array<Array<string | null>> = [];
  for (let i = 0; i < cells.length; i += 7) rows.push(cells.slice(i, i + 7));
  return rows;
}

/**
 * Step 1 of a rental booking — pick check-in and check-out on a month calendar.
 *
 * Booked nights come from the API a month at a time. A night that is booked
 * cannot start a stay, but it can still be a checkout day (the guest leaves
 * that morning), and a stay may never span a booked night.
 */
export default function RentalDatesScreen({ navigation, route }: Props) {
  const { propertyId } = route.params;
  const todayKey = toDateKey(new Date());

  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [checkIn, setCheckIn] = useState<string | null>(null);
  const [checkOut, setCheckOut] = useState<string | null>(null);
  const [booked, setBooked] = useState<Set<string>>(() => new Set());
  const requestedMonths = useRef<Set<string>>(new Set());

  // Load this month and the next, once each. A failure just means "nothing
  // booked" — the server still rejects a clash when the booking is created.
  useEffect(() => {
    const months = [0, 1].map(
      offset => new Date(currentMonth.getFullYear(), currentMonth.getMonth() + offset, 1),
    );
    months.forEach(month => {
      const key = monthKey(month);
      const lastDay = toDateKey(new Date(month.getFullYear(), month.getMonth() + 1, 0));
      if (requestedMonths.current.has(key) || lastDay < todayKey) return;
      requestedMonths.current.add(key);
      servicesApi
        .unavailableDates(propertyId, { from: toDateKey(month), to: lastDay })
        .then(dates => {
          if (!dates.length) return;
          setBooked(prev => new Set([...prev, ...dates]));
        })
        .catch(() => {
          requestedMonths.current.delete(key);
        });
    });
  }, [currentMonth, propertyId, todayKey]);

  /** True when no night from `from` up to (not including) `to` is booked. */
  const nightsFree = useMemo(
    () => (from: string, to: string) => {
      for (let night = from; night < to; night = addDays(night, 1)) {
        if (booked.has(night)) return false;
      }
      return true;
    },
    [booked],
  );

  // Booked nights can arrive after a pick — drop whatever they invalidate.
  useEffect(() => {
    if (checkIn && booked.has(checkIn)) {
      setCheckIn(null);
      setCheckOut(null);
    } else if (checkIn && checkOut && !nightsFree(checkIn, checkOut)) {
      setCheckOut(null);
    }
  }, [booked, checkIn, checkOut, nightsFree]);

  const choosingCheckOut = !!checkIn && !checkOut;

  const isValidCheckOut = (key: string) =>
    choosingCheckOut && !!checkIn && key > checkIn && nightsFree(checkIn, key);

  const isSelectable = (key: string) => {
    if (key < todayKey) return false;
    return isValidCheckOut(key) || !booked.has(key);
  };

  const onDayPress = (key: string) => {
    if (!isSelectable(key)) return;
    if (isValidCheckOut(key)) {
      setCheckOut(key);
    } else {
      setCheckIn(key);
      setCheckOut(null);
    }
  };

  const nights = checkIn && checkOut ? nightsBetween(checkIn, checkOut) : 0;
  const canContinue = !!checkIn && !!checkOut && nights > 0;

  const shiftMonth = (delta: number) =>
    setCurrentMonth(
      prev => new Date(prev.getFullYear(), prev.getMonth() + delta, 1),
    );

  const info = !checkIn
    ? 'Select your check-in date to begin'
    : !checkOut
      ? 'Now select your check-out date'
      : 'Dates selected! Tap Continue to proceed';

  return (
    <MainScreenLayout edges={['top', 'bottom']}>
      <SubScreenHeader title="Select Dates" onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.dateCards}>
          <View style={[styles.card, styles.dateCard]}>
            <Text style={[styles.textSm, styles.mb1]}>Check-in</Text>
            <Text style={styles.text}>{checkIn ? formatDateKey(checkIn) : 'Select date'}</Text>
          </View>
          <View style={[styles.card, styles.dateCard]}>
            <Text style={[styles.textSm, styles.mb1]}>Check-out</Text>
            <Text style={styles.text}>{checkOut ? formatDateKey(checkOut) : 'Select date'}</Text>
          </View>
        </View>

        {canContinue ? (
          <View style={styles.solidTealBox}>
            <GradientFill colors={TEAL_GRADIENT} />
            <Text style={styles.durationLabel}>Duration</Text>
            <Text style={styles.durationValue}>{stayDuration(nights)}</Text>
          </View>
        ) : null}

        <View style={styles.card}>
          <View style={styles.monthNav}>
            <TouchableOpacity
              style={styles.monthButton}
              onPress={() => shiftMonth(-1)}
              accessibilityLabel="Previous month"
            >
              <ChevronLeft size={20} color={FG} />
            </TouchableOpacity>
            <Text style={styles.heading}>
              {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </Text>
            <TouchableOpacity
              style={styles.monthButton}
              onPress={() => shiftMonth(1)}
              accessibilityLabel="Next month"
            >
              <ChevronRight size={20} color={FG} />
            </TouchableOpacity>
          </View>

          <View style={styles.weekdayRow}>
            {WEEKDAYS.map(day => (
              <View key={day} style={styles.weekday}>
                <Text style={styles.weekdayText}>{day}</Text>
              </View>
            ))}
          </View>

          <View style={styles.calendarRows}>
            {monthGrid(currentMonth).map(week => (
              <View key={week.find(Boolean) ?? 'pad'} style={styles.calendarRow}>
                {week.map((key, i) => {
                  if (!key) return <View key={`pad-${i}`} style={styles.weekday} />;
                  const picked = key === checkIn || key === checkOut;
                  const inRange = !!checkIn && !!checkOut && key > checkIn && key < checkOut;
                  const disabled = !isSelectable(key);
                  const isToday = key === todayKey;
                  return (
                    <TouchableOpacity
                      key={key}
                      activeOpacity={0.7}
                      disabled={disabled}
                      onPress={() => onDayPress(key)}
                      style={[
                        styles.day,
                        picked
                          ? styles.dayPicked
                          : inRange
                            ? styles.dayInRange
                            : disabled
                              ? styles.dayDisabled
                              : null,
                        isToday && !picked && !disabled && styles.dayToday,
                      ]}
                      accessibilityLabel={formatDateKey(key)}
                      accessibilityState={{ disabled, selected: picked }}
                    >
                      {picked ? <GradientFill colors={TEAL_GRADIENT} /> : null}
                      <Text
                        style={[
                          styles.dayText,
                          picked && styles.dayTextPicked,
                          !picked && disabled && styles.dayTextDisabled,
                        ]}
                      >
                        {Number(key.slice(8))}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ))}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={[styles.heading, styles.mb3]}>Legend</Text>
          <View style={styles.legendRows}>
            <View style={styles.legendRow}>
              <View style={styles.legendSwatch}>
                <GradientFill colors={TEAL_GRADIENT} />
              </View>
              <Text style={styles.textSm}>Selected dates</Text>
            </View>
            <View style={styles.legendRow}>
              <View style={[styles.legendSwatch, styles.legendRange]} />
              <Text style={styles.textSm}>Date range</Text>
            </View>
            <View style={styles.legendRow}>
              <View style={[styles.legendSwatch, styles.legendUnavailable]} />
              <Text style={styles.textSm}>Unavailable dates</Text>
            </View>
            <View style={styles.legendRow}>
              <View style={[styles.legendSwatch, styles.legendToday]} />
              <Text style={styles.textSm}>Today</Text>
            </View>
          </View>
        </View>

        <View style={styles.tintBox}>
          <GradientFill colors={TEAL_TINT} />
          <Text style={styles.infoText}>{info}</Text>
        </View>
      </ScrollView>

      <BookingFooter
        label="Continue"
        disabled={!canContinue}
        onPress={() => {
          if (!checkIn || !checkOut) return;
          navigation.navigate('RentalStayDetails', { propertyId, checkIn, checkOut });
        }}
      />
    </MainScreenLayout>
  );
}
