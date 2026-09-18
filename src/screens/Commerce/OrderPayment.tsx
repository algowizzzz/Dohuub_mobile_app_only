import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { CommonActions, useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';
import MainScreenLayout from '../../components/layout/MainScreenLayout';
import SubScreenHeader from '../../components/layout/SubScreenHeader';
import PrimaryButton from '../../components/ui/PrimaryButton';
import LoadingState from '../../components/ui/LoadingState';
import ErrorState from '../../components/ui/ErrorState';
import ErrorBanner from '../../components/ui/ErrorBanner';
import ConfirmModal from '../../components/ui/ConfirmModal';
import { colors } from '../../styles';
import { usePaymentCardStore } from '../../store/paymentCardStore';
import { useCommerceStore } from '../../store/commerceStore';
import type { ApiCommerceOrder } from '../../services/commerceApi';
import { styles } from '../Payment/styles';

type Props = NativeStackScreenProps<RootStackParamList, 'OrderPayment'>;

export default function OrderPaymentScreen({ navigation, route }: Props) {
  const cards = usePaymentCardStore(state => state.cards);
  const loadCards = usePaymentCardStore(state => state.load);
  const getOrder = useCommerceStore(state => state.getOrder);
  const payOrder = useCommerceStore(state => state.payOrder);

  const [order, setOrder] = useState<ApiCommerceOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);
  const [successVisible, setSuccessVisible] = useState(false);

  const load = () => {
    setLoading(true);
    setLoadError(null);
    getOrder(route.params.orderId)
      .then(setOrder)
      .catch(err => setLoadError((err as Error).message))
      .finally(() => setLoading(false));
  };

  useEffect(load, [route.params.orderId]);

  useFocusEffect(
    useCallback(() => {
      loadCards().catch(() => {});
    }, [loadCards]),
  );

  useEffect(() => {
    if (!selectedCardId && cards.length > 0) {
      setSelectedCardId(cards.find(card => card.isDefault)?.id ?? cards[0].id);
    }
  }, [cards, selectedCardId]);

  if (loading) {
    return (
      <MainScreenLayout edges={['top', 'bottom']}>
        <SubScreenHeader title="Payment" onBack={() => navigation.goBack()} />
        <LoadingState />
      </MainScreenLayout>
    );
  }

  if (loadError || !order) {
    return (
      <MainScreenLayout edges={['top', 'bottom']}>
        <SubScreenHeader title="Payment" onBack={() => navigation.goBack()} />
        <ErrorState message={loadError || 'Order not found'} onRetry={load} />
      </MainScreenLayout>
    );
  }

  const runPay = async () => {
    if (!selectedCardId) return;
    setSubmitting(true);
    setPayError(null);
    try {
      // Same contract as booking pay: pass the saved card row id / Stripe PM id
      // the backend resolves via cards table.
      await payOrder(order.id, {
        paymentMethodId: selectedCardId,
        confirmNow: true,
      });
      const updated = await getOrder(order.id);
      setOrder(updated);
      if (updated.paymentStatus === 'paid') setSuccessVisible(true);
      else setPayError('Payment is still processing. Check Orders shortly.');
    } catch (err) {
      setPayError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <MainScreenLayout edges={['top', 'bottom']}>
      <SubScreenHeader title="Payment" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {payError ? <ErrorBanner message={payError} /> : null}
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>{order.vendor?.businessName || 'Order'}</Text>
            <Text style={styles.summaryValue}>{order.reference}</Text>
          </View>
          {(order.items || []).slice(0, 5).map(item => (
            <View key={item.id} style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>
                {item.quantity}× {item.name}
              </Text>
              <Text style={styles.summaryValue}>${Number(item.lineTotal).toFixed(2)}</Text>
            </View>
          ))}
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={[styles.totalValue, { color: colors.primary }]}>
              ${Number(order.totalAmount).toFixed(2)}
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Payment method</Text>
        {cards.map(card => (
          <TouchableOpacity
            key={card.id}
            style={[styles.cardRow, card.id === selectedCardId && styles.cardRowSelected]}
            onPress={() => setSelectedCardId(card.id)}
          >
            <Icon name="card" size={20} color={colors.primary} />
            <Text style={styles.cardLabel}>
              {(card.brand || 'Card').toUpperCase()} •••• {card.last4}
            </Text>
          </TouchableOpacity>
        ))}

        <PrimaryButton
          label={`Pay $${Number(order.totalAmount).toFixed(2)}`}
          loading={submitting}
          disabled={!selectedCardId || order.paymentStatus === 'paid'}
          onPress={runPay}
          style={{ marginTop: 20 }}
        />
      </ScrollView>

      <ConfirmModal
        visible={successVisible}
        title="Order placed"
        message="Your food/grocery order is confirmed."
        icon="checkmark-circle"
        confirmLabel="View orders"
        cancelLabel="Close"
        onConfirm={() => {
          setSuccessVisible(false);
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: 'Main', params: { screen: 'Bookings' } }],
            }),
          );
        }}
        onCancel={() => setSuccessVisible(false)}
      />
    </MainScreenLayout>
  );
}
