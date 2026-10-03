import React, { useCallback, useState } from 'react';
import { RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';
import MainScreenLayout from '../../components/layout/MainScreenLayout';
import SubScreenHeader from '../../components/layout/SubScreenHeader';
import PrimaryButton from '../../components/ui/PrimaryButton';
import LoadingState from '../../components/ui/LoadingState';
import ErrorState from '../../components/ui/ErrorState';
import Price from '../../components/ui/Price';
import { colors } from '../../styles';
import { ApiError } from '../../services/ApiError';
import { deliveryApi, type Delivery, type DeliveryStatus } from '../../services/deliveryApi';
import { ACTIVE_STATUSES, DELIVERY_STATUS_META, deliveryTitle, formatDateTime } from './deliveryMeta';
import { StatusPill } from './components/DeliveryParts';
import { deliveryStyles as styles } from './styles';

type Props = NativeStackScreenProps<RootStackParamList, 'MyDeliveries'>;

type TabKey = 'active' | 'completed' | 'issues';

/**
 * The customer's three buckets. "Issues" holds what needs attention or ended
 * without a delivery (disputed, expired, cancelled); an open dispute also
 * stays in Active so it is never out of sight.
 */
const TABS: { key: TabKey; label: string; statuses: DeliveryStatus[] }[] = [
  { key: 'active', label: 'Active', statuses: ACTIVE_STATUSES },
  { key: 'completed', label: 'Completed', statuses: ['delivered'] },
  { key: 'issues', label: 'Issues', statuses: ['disputed', 'expired', 'cancelled'] },
];

export default function MyDeliveriesScreen({ navigation }: Props) {
  const [tab, setTab] = useState<TabKey>('active');
  const [items, setItems] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await deliveryApi.listMine({ limit: 100 });
      setItems(res.items);
      setError(null);
    } catch (err) {
      setError(ApiError.messageOf(err, 'Could not load your deliveries.'));
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const countFor = (key: TabKey) => {
    const statuses = TABS.find(t => t.key === key)!.statuses;
    return items.filter(d => statuses.includes(d.status)).length;
  };
  const visible = items.filter(d => TABS.find(t => t.key === tab)!.statuses.includes(d.status));

  return (
    <MainScreenLayout edges={['top', 'bottom']}>
      <SubScreenHeader
        title="My Deliveries"
        onBack={() => navigation.goBack()}
        right={
          <TouchableOpacity
            testID="my-deliveries-new"
            onPress={() => navigation.navigate('SendPackage', undefined)}
            hitSlop={8}
            accessibilityLabel="Send a package"
          >
            <Icon name="add-circle" size={28} color={colors.primary} />
          </TouchableOpacity>
        }
      />

      <View style={styles.tabRow}>
        {TABS.map(t => {
          const active = tab === t.key;
          const count = countFor(t.key);
          return (
            <TouchableOpacity
              key={t.key}
              testID={`deliveries-tab-${t.key}`}
              style={[styles.tab, active && styles.tabActive]}
              onPress={() => setTab(t.key)}
              activeOpacity={0.8}
            >
              <Text style={[styles.tabText, active && styles.tabTextActive]}>{t.label}</Text>
              {count > 0 ? (
                <View style={[styles.tabCount, active && styles.tabCountActive]}>
                  <Text style={[styles.tabCountText, active && { color: colors.white }]}>{count}</Text>
                </View>
              ) : null}
            </TouchableOpacity>
          );
        })}
      </View>

      {loading ? (
        <LoadingState />
      ) : error && items.length === 0 ? (
        <ErrorState message={error} onRetry={load} />
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                load().finally(() => setRefreshing(false));
              }}
              tintColor={colors.primary}
            />
          }
        >
          {visible.length === 0 ? (
            <View style={styles.emptyWrap}>
              <Icon name="cube-outline" size={44} color={colors.primaryLight} />
              <Text style={styles.emptyTitle}>
                {tab === 'active' ? 'No active deliveries' : tab === 'completed' ? 'Nothing delivered yet' : 'No issues'}
              </Text>
              <Text style={styles.emptyText}>
                {tab === 'active'
                  ? 'Send a package across town — you set the fare and choose your rider.'
                  : 'Your deliveries will show up here.'}
              </Text>
              {tab === 'active' ? (
                <PrimaryButton
                  label="Send a Package"
                  style={{ marginTop: 16, alignSelf: 'stretch' }}
                  onPress={() => navigation.navigate('SendPackage', undefined)}
                />
              ) : null}
            </View>
          ) : (
            visible.map(d => {
              const meta = DELIVERY_STATUS_META[d.status];
              return (
                <TouchableOpacity
                  key={d.id}
                  testID={`delivery-row-${d.reference}`}
                  style={styles.listCard}
                  activeOpacity={0.85}
                  onPress={() => navigation.navigate('DeliveryDetail', { deliveryId: d.id })}
                >
                  <View style={[styles.listIcon, { backgroundColor: meta.bg }]}>
                    <Icon name={d.type === 'order' ? 'bag-handle-outline' : 'cube-outline'} size={22} color={meta.color} />
                  </View>
                  <View style={{ flex: 1, minWidth: 0 }}>
                    <Text style={styles.listTitle} numberOfLines={1}>
                      {deliveryTitle(d)}
                    </Text>
                    <Text style={styles.listMeta} numberOfLines={1}>
                      To {d.recipient.name || d.dropoff.label || d.dropoff.address}
                    </Text>
                    <Text style={styles.listMeta}>
                      {d.reference} · {formatDateTime(d.createdAt)}
                    </Text>
                    <View style={{ marginTop: 6 }}>
                      <StatusPill status={d.status} />
                    </View>
                  </View>
                  <Price
                    amount={d.agreedFare ?? d.proposedFare}
                    currency={d.currency}
                    style={[styles.listTitle, { color: colors.primary }]}
                    align="right"
                  />
                </TouchableOpacity>
              );
            })
          )}
        </ScrollView>
      )}
    </MainScreenLayout>
  );
}
