import React, { useCallback, useMemo, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';
import MainScreenLayout from '../../components/layout/MainScreenLayout';
import { colors } from '../../styles';
import LoadingState from '../../components/ui/LoadingState';
import ErrorState from '../../components/ui/ErrorState';
import HomeHeader from '../Home/components/HomeHeader';
import { useBookingStore } from '../../store/bookingStore';
import { useCommerceStore } from '../../store/commerceStore';
import type { ApiBookingStatus } from '../../services/bookingApi';
import FilterTabs, { FilterKey } from './components/FilterTabs';
import DateGroupLabel from './components/DateGroupLabel';
import BookingCard from './components/BookingCard';
import { DATE_GROUP_ORDER, getDateGroup } from './dateGroups';
import { styles } from './styles';
import { commerceStyles, ORDER_STATUS_META } from '../Commerce/styles';

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
  const orders = useCommerceStore(state => state.orders);
  const ordersLoading = useCommerceStore(state => state.ordersLoading);
  const loadOrders = useCommerceStore(state => state.loadOrders);
  const [mode, setMode] = useState<'bookings' | 'orders'>('bookings');
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');

  useFocusEffect(
    useCallback(() => {
      load().catch(() => {});
      loadOrders().catch(() => {});
    }, [load, loadOrders]),
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

      <View style={{ flexDirection: 'row', gap: 8, paddingHorizontal: 16, paddingTop: 8 }}>
        {(['bookings', 'orders'] as const).map(tab => (
          <TouchableOpacity
            key={tab}
            onPress={() => setMode(tab)}
            style={{
              paddingHorizontal: 14,
              paddingVertical: 8,
              borderRadius: 999,
              backgroundColor: mode === tab ? colors.primary : '#E2E8F0',
            }}
          >
            <Text style={{ color: mode === tab ? '#fff' : colors.text, fontWeight: '600' }}>
              {tab === 'bookings' ? 'Bookings' : 'Orders'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {mode === 'bookings' ? (
        loading && bookings.length === 0 ? (
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
        )
      ) : ordersLoading && orders.length === 0 ? (
        <LoadingState />
      ) : (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {orders.length === 0 ? (
            <Text style={styles.emptyText}>No food or grocery orders yet.</Text>
          ) : (
            orders.map(order => {
              const status = ORDER_STATUS_META[order.status] || ORDER_STATUS_META.placed;
              return (
                <TouchableOpacity
                  key={order.id}
                  onPress={() => navigation.navigate('OrderDetail', { orderId: order.id })}
                  style={commerceStyles.orderCard}
                  activeOpacity={0.85}
                >
                  <View style={commerceStyles.orderIcon}>
                    <Icon name="cart-outline" size={28} color={colors.primary} />
                  </View>
                  <View style={commerceStyles.orderBody}>
                    <Text style={commerceStyles.orderTitle}>
                      {order.vendor?.businessName || 'Order'}
                    </Text>
                    <Text style={commerceStyles.orderMeta}>
                      {order.reference} · ${Number(order.totalAmount).toFixed(2)}
                    </Text>
                    <View style={[commerceStyles.statusPill, { backgroundColor: status.bg }]}>
                      <Text style={[commerceStyles.statusPillText, { color: status.color }]}>
                        {status.label}
                      </Text>
                    </View>
                  </View>
                  <Icon name="chevron-forward" size={20} color={colors.textMuted} />
                </TouchableOpacity>
              );
            })
          )}
        </ScrollView>
      )}
    </MainScreenLayout>
  );
}
