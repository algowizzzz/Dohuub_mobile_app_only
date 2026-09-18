import React, { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
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
          <Text style={styles.cardTitle}>{order.vendor?.businessName || 'Order'}</Text>
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
              <Text style={styles.summaryValue}>${Number(item.lineTotal).toFixed(2)}</Text>
            </View>
          ))}
        </View>

        <View style={styles.card}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>${Number(order.subtotal).toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Delivery</Text>
            <Text style={styles.summaryValue}>${Number(order.deliveryFee).toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tax</Text>
            <Text style={styles.summaryValue}>${Number(order.taxAmount).toFixed(2)}</Text>
          </View>
          <View style={[styles.summaryRow, styles.summaryTotal, { marginBottom: 0 }]}>
            <Text style={{ fontWeight: '700', color: colors.text }}>Total</Text>
            <Text style={{ fontWeight: '700', color: colors.text }}>
              ${Number(order.totalAmount).toFixed(2)}
            </Text>
          </View>
        </View>

        {order.paymentStatus !== 'paid' && order.status === 'pending_payment' ? (
          <PrimaryButton
            label="Pay now"
            onPress={() => navigation.navigate('OrderPayment', { orderId: order.id })}
          />
        ) : null}
      </ScrollView>
    </MainScreenLayout>
  );
}
