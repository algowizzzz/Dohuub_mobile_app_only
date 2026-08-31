import React, { useCallback, useMemo, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';
import { colors } from '../../styles';
import MainScreenLayout from '../../components/layout/MainScreenLayout';
import SubScreenHeader from '../../components/layout/SubScreenHeader';
import LoadingState from '../../components/ui/LoadingState';
import ErrorState from '../../components/ui/ErrorState';
import { useRewardsStore } from '../../store/rewardsStore';
import HistoryFilterTabs, { type HistoryFilter } from './components/HistoryFilterTabs';
import TotalsRow from './components/TotalsRow';
import HistoryEntryRow from './components/HistoryEntryRow';
import RedemptionInfoBox from './components/RedemptionInfoBox';
import { styles } from './styles';

type Props = NativeStackScreenProps<RootStackParamList, 'PointsHistory'>;

function monthGroupOf(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

export default function PointsHistoryScreen({ navigation }: Props) {
  const history = useRewardsStore(state => state.history);
  const loading = useRewardsStore(state => state.loading);
  const error = useRewardsStore(state => state.error);
  const loadHistory = useRewardsStore(state => state.loadHistory);
  const [filter, setFilter] = useState<HistoryFilter>('all');

  useFocusEffect(
    useCallback(() => {
      loadHistory({ limit: 100 }).catch(() => {});
    }, [loadHistory]),
  );

  const filteredTransactions = useMemo(
    () => (filter === 'all' ? history : history.filter(transaction => transaction.kind === filter)),
    [history, filter],
  );

  const totals = useMemo(() => {
    return history.reduce(
      (acc, entry) => {
        acc[entry.kind] += entry.points;
        return acc;
      },
      { earned: 0, redeemed: 0, returned: 0 },
    );
  }, [history]);

  const groups = useMemo(() => {
    const seen = new Map<string, typeof filteredTransactions>();
    filteredTransactions.forEach(transaction => {
      const key = monthGroupOf(transaction.createdAt);
      const list = seen.get(key) ?? [];
      list.push(transaction);
      seen.set(key, list);
    });
    return Array.from(seen.entries());
  }, [filteredTransactions]);

  if (loading && history.length === 0) {
    return (
      <MainScreenLayout edges={['top', 'bottom']}>
        <SubScreenHeader title="Points history" onBack={() => navigation.goBack()} />
        <LoadingState />
      </MainScreenLayout>
    );
  }

  if (error && history.length === 0) {
    return (
      <MainScreenLayout edges={['top', 'bottom']}>
        <SubScreenHeader title="Points history" onBack={() => navigation.goBack()} />
        <ErrorState message={error} onRetry={() => loadHistory({ limit: 100 })} />
      </MainScreenLayout>
    );
  }

  return (
    <MainScreenLayout edges={['top', 'bottom']}>
      <SubScreenHeader title="Points history" onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <HistoryFilterTabs active={filter} onChange={setFilter} />

        <TotalsRow earned={totals.earned} redeemed={totals.redeemed} returned={totals.returned} />

        {groups.length === 0 ? (
          <Text style={styles.monthLabel}>No transactions yet.</Text>
        ) : (
          groups.map(([monthGroup, transactions]) => (
            <View key={monthGroup}>
              <Text style={styles.monthLabel}>{monthGroup}</Text>
              {transactions.map(transaction => (
                <HistoryEntryRow key={transaction.id} transaction={transaction} />
              ))}
            </View>
          ))
        )}

        <RedemptionInfoBox />
      </ScrollView>
    </MainScreenLayout>
  );
}
