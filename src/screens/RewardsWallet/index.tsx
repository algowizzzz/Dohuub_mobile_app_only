import React, { useCallback, useMemo, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';
import { colors } from '../../styles';
import MainScreenLayout from '../../components/layout/MainScreenLayout';
import SubScreenHeader from '../../components/layout/SubScreenHeader';
import LoadingState from '../../components/ui/LoadingState';
import ErrorState from '../../components/ui/ErrorState';
import { useRewardsStore } from '../../store/rewardsStore';
import { useBookingStore } from '../../store/bookingStore';
import { vendorCategoriesApi, type ApiVendorCategory } from '../../services/catalogApi';
import BalanceCard from './components/BalanceCard';
import InfoStatCard from './components/InfoStatCard';
import WalletActionButtons from './components/WalletActionButtons';
import StreakCard from './components/StreakCard';
import MilestonesCard from './components/MilestonesCard';
import InfoBox from './components/InfoBox';
import ActivityRow from './components/ActivityRow';
import { howToEarnPoints } from './rewards';
import {
  categoryProgress,
  longestWeeklyStreak,
  nextStreakTarget,
  pendingPointsFromBookings,
  streakMarkers,
} from './mapWallet';
import { styles } from './styles';

type Props = NativeStackScreenProps<RootStackParamList, 'RewardsWallet'>;

const RECENT_ACTIVITY_COUNT = 5;

export default function RewardsWalletScreen({ navigation }: Props) {
  const balance = useRewardsStore(state => state.balance);
  const history = useRewardsStore(state => state.history);
  const referral = useRewardsStore(state => state.referral);
  const loading = useRewardsStore(state => state.loading);
  const error = useRewardsStore(state => state.error);
  const loadBalance = useRewardsStore(state => state.loadBalance);
  const loadHistory = useRewardsStore(state => state.loadHistory);
  const loadReferral = useRewardsStore(state => state.loadReferral);
  const bookings = useBookingStore(state => state.bookings);
  const loadBookings = useBookingStore(state => state.load);
  const [categories, setCategories] = useState<ApiVendorCategory[]>([]);

  useFocusEffect(
    useCallback(() => {
      loadBalance().catch(() => {});
      loadHistory({ limit: RECENT_ACTIVITY_COUNT }).catch(() => {});
      loadReferral().catch(() => {});
      loadBookings({ limit: 100 }).catch(() => {});
      vendorCategoriesApi
        .list()
        .then(setCategories)
        .catch(() => {});
    }, [loadBalance, loadHistory, loadReferral, loadBookings]),
  );

  const pendingPoints = useMemo(() => pendingPointsFromBookings(bookings), [bookings]);
  const bestStreak = useMemo(() => {
    const fromBookings = longestWeeklyStreak(bookings.map(booking => booking.completedAt));
    return Math.max(fromBookings, balance?.weeklyStreak ?? 0);
  }, [bookings, balance?.weeklyStreak]);
  const categoriesMapped = useMemo(
    () => categoryProgress(categories, bookings),
    [categories, bookings],
  );

  if (loading && !balance) {
    return (
      <MainScreenLayout edges={['top', 'bottom']}>
        <SubScreenHeader title="Rewards Wallet" onBack={() => navigation.goBack()} />
        <LoadingState />
      </MainScreenLayout>
    );
  }

  if (error && !balance) {
    return (
      <MainScreenLayout edges={['top', 'bottom']}>
        <SubScreenHeader title="Rewards Wallet" onBack={() => navigation.goBack()} />
        <ErrorState message={error} onRetry={() => loadBalance()} />
      </MainScreenLayout>
    );
  }

  if (!balance) return null;

  const currentStreak = balance.weeklyStreak;
  const nextWeeks = nextStreakTarget(currentStreak);
  const referrerPoints = referral?.rewards.referrerPoints ?? 60;
  const pointsPerUnit = balance.conversion.pointsPerCurrencyUnit || 100;

  return (
    <MainScreenLayout edges={['top', 'bottom']}>
      <SubScreenHeader title="Rewards Wallet" onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <BalanceCard points={balance.balance} value={balance.value} />

          <View style={styles.statsRow}>
            <InfoStatCard
              icon="time-outline"
              label="Pending"
              value={String(pendingPoints)}
              suffix="pts"
              tone="neutral"
            />
            <InfoStatCard
              icon="time-outline"
              label="Expiring Soon"
              value="0"
              suffix="pts"
              tone="danger"
            />
          </View>

          <WalletActionButtons
            onReferAndEarn={() => navigation.navigate('ReferFriend')}
            onViewHistory={() => navigation.navigate('PointsHistory')}
          />

          <StreakCard
            currentStreak={currentStreak}
            bestStreak={bestStreak}
            markers={streakMarkers(currentStreak)}
            nextWeeks={nextWeeks}
          />

          <MilestonesCard categories={categoriesMapped} lifetimePoints={balance.lifetimePoints} />

          <InfoBox title="How to Earn Points" items={howToEarnPoints(referrerPoints, pointsPerUnit)} />

          <View style={styles.activityHeader}>
            <Text style={styles.activityTitle}>Recent Activity</Text>
            <TouchableOpacity onPress={() => navigation.navigate('PointsHistory')} hitSlop={8}>
              <Text style={styles.viewAll}>View All</Text>
            </TouchableOpacity>
          </View>

          {history.length === 0 ? (
            <Text style={styles.emptyText}>No activity yet.</Text>
          ) : (
            history.map(transaction => <ActivityRow key={transaction.id} transaction={transaction} />)
          )}

          <View style={styles.expiryBox}>
            <Text style={styles.expiryText}>
              Points expire 12 months after earning. Use them before they're gone!
            </Text>
          </View>
        </ScrollView>
    </MainScreenLayout>
  );
}