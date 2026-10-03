import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';
import MainScreenLayout from '../../components/layout/MainScreenLayout';
import SubScreenHeader from '../../components/layout/SubScreenHeader';
import PrimaryButton from '../../components/ui/PrimaryButton';
import LoadingState from '../../components/ui/LoadingState';
import ErrorState from '../../components/ui/ErrorState';
import { colors } from '../../styles';
import { useCommerceStore } from '../../store/commerceStore';
import type { ApiCommerceOrder } from '../../services/commerceApi';
import { commerceStyles as styles, ORDER_STATUS_LABEL } from './styles';
import Price from '../../components/ui/Price';
import { deliveryApi, type Delivery } from '../../services/deliveryApi';
import { ACTIVE_STATUSES, DELIVERY_STATUS_META } from '../Delivery/deliveryMeta';

type Props = NativeStackScreenProps<RootStackParamList, 'OrderDetail'>;

export default function OrderDetailScreen({ navigation, route }: Props) {
  const getOrder = useCommerceStore(s => s.getOrder);
  const [order, setOrder] = useState<ApiCommerceOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    setError(null);
    getOrder(route.params.orderId)
      .then(setOrder)
      .catch(err => setError((err as Error).message))
      .finally(() => setLoading(false));
  };

  useEffect(load, [route.params.orderId]);

  // A paid, undelivered order can get a DoHuub rider; if one is already on it, link to tracking.
  const [riderDelivery, setRiderDelivery] = useState<Delivery | null>(null);
  const riderEligible =
    !!order && order.paymentStatus === 'paid' && order.status !== 'delivered' && order.status !== 'cancelled';
  useFocusEffect(
    useCallback(() => {
      if (!order) return;
      deliveryApi
        .listMine({ orderId: order.id, limit: 10 })
        .then(r => setRiderDelivery(r.items.find(x => ACTIVE_STATUSES.includes(x.status)) ?? r.items[0] ?? null))
        .catch(() => {});
    }, [order]),
  );

  if (loading) {
    return (
      <MainScreenLayout edges={['top', 'bottom']}>
        <SubScreenHeader title="Order detail" onBack={() => navigation.goBack()} />
        <LoadingState />
      </MainScreenLayout>
    );
  }

  if (error || !order) {
    return (
      <MainScreenLayout edges={['top', 'bottom']}>
        <SubScreenHeader title="Order detail" onBack={() => navigation.goBack()} />
        <ErrorState message={error || 'Not found'} onRetry={load} />
      </MainScreenLayout>
    );
  }

  return (
    <MainScreenLayout edges={['top', 'bottom']}>
      <SubScreenHeader title="Order detail" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            {order.store?.name || order.vendor?.businessName || 'Order'}
          </Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Reference</Text>
            <Text style={styles.summaryValue}>{order.reference}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Status</Text>
            <Text style={styles.summaryValue}>
              {ORDER_STATUS_LABEL[order.status] || order.status}
            </Text>
          </View>
          <View style={[styles.summaryRow, { marginBottom: 0 }]}>
            <Text style={styles.summaryLabel}>Payment</Text>
            <Text style={styles.summaryValue}>{order.paymentStatus}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Items</Text>
          {(order.items || []).map(item => (
            <View key={item.id} style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>
                {item.quantity}× {item.name}
              </Text>
              <Price amount={item.lineTotal} currency={order.currency} style={styles.summaryValue} align="right" />
            </View>
          ))}
        </View>

        <View style={styles.card}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Price amount={order.subtotal} currency={order.currency} style={styles.summaryValue} align="right" />
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Delivery</Text>
            <Price amount={order.deliveryFee} currency={order.currency} style={styles.summaryValue} align="right" />
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tax</Text>
            <Price amount={order.taxAmount} currency={order.currency} style={styles.summaryValue} align="right" />
          </View>
          <View style={[styles.summaryRow, styles.summaryTotal, { marginBottom: 0 }]}>
            <Text style={{ fontWeight: '700', color: colors.text }}>Total</Text>
<Price amount={order.totalAmount} currency={order.currency} style={{ fontWeight: '700', color: colors.text }} align="right" />
          </View>
        </View>

        {riderDelivery && (ACTIVE_STATUSES.includes(riderDelivery.status) || riderDelivery.status === 'delivered') ? (
          <TouchableOpacity
            testID="order-track-rider"
            style={[styles.card, { flexDirection: 'row', alignItems: 'center', gap: 12 }]}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('DeliveryDetail', { deliveryId: riderDelivery.id })}
          >
            <Icon name="bicycle" size={24} color={colors.primary} />
            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: '700', color: colors.text }}>DoHuub rider · {riderDelivery.reference}</Text>
              <Text style={{ color: DELIVERY_STATUS_META[riderDelivery.status].color, marginTop: 2 }}>
                {DELIVERY_STATUS_META[riderDelivery.status].label}
              </Text>
            </View>
            <Icon name="chevron-forward" size={20} color={colors.textFaint} />
          </TouchableOpacity>
        ) : riderEligible ? (
          <PrimaryButton
            label="Get a DoHuub rider"
            testID="order-get-rider"
            onPress={() => navigation.navigate('SendPackage', { orderId: order.id })}
          />
        ) : null}

        {order.paymentStatus !== 'paid' && order.status === 'pending_payment' ? (
          <PrimaryButton
            label="Pay now"
            testID="order-pay-now"
            onPress={() =>
              navigation.navigate(
                'OrderPayment',
                order.checkoutId ? { checkoutId: order.checkoutId } : { orderId: order.id },
              )
            }
          />
        ) : null}
      </ScrollView>
    </MainScreenLayout>
  );
}
