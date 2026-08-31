import React, { useCallback, useMemo, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';
import MainScreenLayout from '../../components/layout/MainScreenLayout';
import { colors } from '../../styles';
import LoadingState from '../../components/ui/LoadingState';
import ErrorState from '../../components/ui/ErrorState';
import HomeHeader from '../Home/components/HomeHeader';
import { useBookingStore } from '../../store/bookingStore';
import type { ApiBookingStatus } from '../../services/bookingApi';
import FilterTabs, { FilterKey } from './components/FilterTabs';
import DateGroupLabel from './components/DateGroupLabel';
import BookingCard from './components/BookingCard';
import { DATE_GROUP_ORDER, getDateGroup } from './dateGroups';
import { styles } from './styles';

const FILTER_STATUS_MAP: Record<FilterKey, ApiBookingStatus[]> = {
  all: ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'rejected', 'refunded'],
  upcoming: ['pending', 'confirmed'],
  in_progress: ['in_progress'],
  completed: ['completed'],
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function BookingsScreen() {
  const navigation = useNavigation<NavigationProp>();
  const bookings = useBookingStore(state => state.bookings);
  const loading = useBookingStore(state => state.loading);
  const error = useBookingStore(state => state.error);
  const load = useBookingStore(state => state.load);
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');

  useFocusEffect(
    useCallback(() => {
      load().catch(() => {});
    }, [load]),
  );

  const filteredBookings = useMemo(
    () => bookings.filter(booking => FILTER_STATUS_MAP[activeFilter].includes(booking.status)),
    [bookings, activeFilter],
  );

  const groups = useMemo(() => {
    return DATE_GROUP_ORDER.map(group => ({
      group,
      bookings: filteredBookings.filter(booking => getDateGroup(booking.scheduledDate) === group),
    })).filter(entry => entry.bookings.length > 0);
  }, [filteredBookings]);

  return (
    <MainScreenLayout>
      <HomeHeader onAvatarPress={() => {}} />

      {loading && bookings.length === 0 ? (
        <LoadingState />
      ) : error && bookings.length === 0 ? (
        <ErrorState message={error} onRetry={() => load()} />
      ) : (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <FilterTabs active={activeFilter} onChange={setActiveFilter} />

          {groups.length === 0 ? (
            <Text style={styles.emptyText}>No bookings in this filter yet.</Text>
          ) : (
            groups.map(({ group, bookings: groupBookings }) => (
              <View key={group}>
                <DateGroupLabel label={group} count={groupBookings.length} />
                {groupBookings.map(booking => (
                  <BookingCard
                    key={booking.id}
                    booking={booking}
                    onPress={() => navigation.navigate('BookingDetail', { bookingId: booking.id })}
                  />
                ))}
              </View>
            ))
          )}
        </ScrollView>
      )}
    </MainScreenLayout>
  );
}
