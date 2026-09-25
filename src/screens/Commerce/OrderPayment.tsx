import React, { useCallback, useEffect, useState } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { CommonActions, useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';
import MainScreenLayout from '../../components/layout/MainScreenLayout';
import SubScreenHeader from '../../components/layout/SubScreenHeader';
import PrimaryButton from '../../components/ui/PrimaryButton';
import LoadingState from '../../components/ui/LoadingState';
import ErrorState from '../../components/ui/ErrorState';
import ErrorBanner from '../../components/ui/ErrorBanner';
import SecondaryButton from '../../components/ui/SecondaryButton';
import { colors } from '../../styles';
import { usePaymentCardStore } from '../../store/paymentCardStore';
import { useCommerceStore } from '../../store/commerceStore';
import type { ApiCheckout, ApiCommerceOrder } from '../../services/commerceApi';
import { CircleCheckBig, Store } from 'lucide-react-native';
import { styles } from '../Payment/styles';
import { commerceStyles } from './styles';
import { cartStyles } from './cartStyles';

type Props = NativeStackScreenProps<RootStackParamList, 'OrderPayment'>;

/** What this screen pays: a multi-store checkout, or one legacy order. */
type Payable = {
  kind: 'checkout' | 'order';
  id: string;
  reference: string;
  orders: ApiCommerceOrder[];
  totalAmount: number;
  paid: boolean;
};

const fromCheckout = (checkout: ApiCheckout): Payable => ({
  kind: 'checkout',
  id: checkout.id,
  reference: checkout.reference,
  orders: checkout.orders || [],
  totalAmount: Number(checkout.totalAmount || 0),
  paid: checkout.status === 'paid' || checkout.paymentStatus === 'paid',
});

const fromOrder = (order: ApiCommerceOrder): Payable => ({
  kind: 'order',
  id: order.id,
  reference: order.reference,
  orders: [order],
  totalAmount: Number(order.totalAmount || 0),
  paid: order.paymentStatus === 'paid',
});

const sum = (orders: ApiCommerceOrder[], pick: (o: ApiCommerceOrder) => unknown) =>
  orders.reduce((acc, o) => acc + (Number(pick(o)) || 0), 0);

export default function OrderPaymentScreen({ navigation, route }: Props) {
  const cards = usePaymentCardStore(state => state.cards);
  const loadCards = usePaymentCardStore(state => state.load);
  const getOrder = useCommerceStore(state => state.getOrder);
  const payOrder = useCommerceStore(state => state.payOrder);
  const getCheckout = useCommerceStore(state => state.getCheckout);
  const payCheckout = useCommerceStore(state => state.payCheckout);
  const { orderId, checkoutId } = route.params ?? {};

  const [payable, setPayable] = useState<Payable | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [pickingCard, setPickingCard] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);

  /** An order that belongs to a checkout is paid through that checkout. */
  const fetchPayable = useCallback(async (): Promise<Payable> => {
    if (checkoutId) return fromCheckout(await getCheckout(checkoutId));
    if (!orderId) throw new Error('Order not found');
    const found = await getOrder(orderId);
    if (found.checkoutId && found.paymentStatus !== 'paid') {
      return fromCheckout(await getCheckout(found.checkoutId));
    }
    return fromOrder(found);
  }, [checkoutId, orderId, getCheckout, getOrder]);

  const load = useCallback(() => {
    setLoading(true);
    setLoadError(null);
    fetchPayable()
      .then(setPayable)
      .catch(err => setLoadError((err as Error).message))
      .finally(() => setLoading(false));
  }, [fetchPayable]);

  useEffect(load, [load]);

  /** Leave the flow without keeping payment screens on the back stack. */
  const exitTo = (screen: 'Home' | 'Bookings') =>
    navigation.dispatch(
      CommonActions.reset({ index: 0, routes: [{ name: 'Main', params: { screen } }] }),
    );

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
        <SubScreenHeader title="Confirm Order" onBack={() => navigation.goBack()} />
        <LoadingState />
      </MainScreenLayout>
    );
  }

  if (loadError || !payable) {
    return (
      <MainScreenLayout edges={['top', 'bottom']}>
        <SubScreenHeader title="Confirm Order" onBack={() => navigation.goBack()} />
        <ErrorState message={loadError || 'Order not found'} onRetry={load} />
      </MainScreenLayout>
    );
  }

  const orders = payable.orders;

  if (payable.paid) {
    return (
      <MainScreenLayout edges={['top', 'bottom']}>
        <SubScreenHeader title="Order Placed" onBack={() => exitTo('Home')} />
        <ScrollView contentContainerStyle={cartStyles.scrollContent} testID="checkout-success">
          <View style={cartStyles.successHero}>
            <View style={cartStyles.successIcon}>
              <CircleCheckBig size={40} color={colors.success} />
            </View>
            <Text style={cartStyles.successTitle}>Payment successful</Text>
            <Text style={cartStyles.successText}>
              {orders.length > 1
                ? `We sent ${orders.length} orders to ${orders.length} stores. Each store prepares and delivers its own order.`
                : 'Your order is confirmed.'}
            </Text>
          </View>
          <View style={cartStyles.card}>
            <View style={cartStyles.rowBetween}>
              <Text style={cartStyles.sectionTitle}>
                {orders.length > 1 ? 'Your orders' : 'Your order'}
              </Text>
              <Text style={cartStyles.orderRef}>{payable.reference}</Text>
            </View>
            {orders.map((o, index) => (
              <TouchableOpacity
                key={o.id}
                testID={`checkout-success-order-${o.id}`}
                style={[cartStyles.orderRow, index > 0 ? cartStyles.itemRowDivider : null]}
                onPress={() => navigation.navigate('OrderDetail', { orderId: o.id })}
              >
                <View style={cartStyles.storeLogo}>
                  {o.store?.image || o.vendor?.image ? (
                    <Image
                      source={{ uri: (o.store?.image || o.vendor?.image) as string }}
                      style={cartStyles.storeLogoImg}
                    />
                  ) : (
                    <Store size={20} color={colors.primary} />
                  )}
                </View>
                <View style={cartStyles.storeInfo}>
                  <Text style={cartStyles.storeName} numberOfLines={1}>
                    {o.store?.name || o.vendor?.businessName || 'Store'}
                  </Text>
                  <Text style={cartStyles.orderRef}>
                    {o.reference} · {o.itemCount} item{o.itemCount === 1 ? '' : 's'}
                  </Text>
                </View>
                <Text style={cartStyles.itemTotal}>${Number(o.totalAmount).toFixed(2)}</Text>
              </TouchableOpacity>
            ))}
            <View style={[cartStyles.summaryRow, cartStyles.totalRow]}>
              <Text style={cartStyles.totalLabel}>Total paid</Text>
              <Text style={cartStyles.totalValue}>${payable.totalAmount.toFixed(2)}</Text>
            </View>
          </View>
          <PrimaryButton
            testID="checkout-success-view-orders"
            label="View orders"
            onPress={() => exitTo('Bookings')}
          />
          <SecondaryButton
            testID="checkout-success-done"
            label="Back to home"
            onPress={() => exitTo('Home')}
            style={cartStyles.buttonGap}
          />
        </ScrollView>
      </MainScreenLayout>
    );
  }

  const order = orders[0];
  const selectedCard = cards.find(card => card.id === selectedCardId) || null;
  const address = order?.deliveryAddress;
  const addressLine = address
    ? [address.address, address.city, address.state, address.zipCode].filter(Boolean).join(', ')
    : '';
  const addressType = (address?.type || 'Home').replace(/^./, c => c.toUpperCase());
  const itemCount = orders.reduce(
    (n, o) => n + (o.itemCount || (o.items || []).reduce((m, item) => m + item.quantity, 0)),
    0,
  );
  const totalAmount = payable.totalAmount;
  const discountAmount = sum(orders, o => o.discountAmount);

  const runPay = async () => {
    if (!selectedCardId) return;
    setSubmitting(true);
    setPayError(null);
    try {
      const opts = { paymentMethodId: selectedCardId, confirmNow: true };
      if (payable.kind === 'checkout') await payCheckout(payable.id, opts);
      else await payOrder(payable.id, opts);
      const updated = await fetchPayable();
      if (updated.paid) {
        // Rebuild the stack as Home → success so Back never returns to payment.
        navigation.dispatch(
          CommonActions.reset({
            index: 1,
            routes: [
              { name: 'Main', params: { screen: 'Home' } },
              {
                name: 'OrderPayment',
                params:
                  updated.kind === 'checkout' ? { checkoutId: updated.id } : { orderId: updated.id },
              },
            ],
          }),
        );
        return;
      }
      setPayable(updated);
      setPayError('Payment is still processing. Check Orders shortly.');
    } catch (err) {
      setPayError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <MainScreenLayout edges={['top', 'bottom']}>
      <SubScreenHeader title="Confirm Order" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {payError ? <ErrorBanner message={payError} /> : null}

        <View style={commerceStyles.confirmSection}>
          <View style={commerceStyles.confirmSectionHead}>
            <Text style={commerceStyles.confirmSectionTitle}>Delivery Address</Text>
            {/* The order is already placed with this address and the API has no
                way to change it, so there is no "Change" here — the address is
                picked on the checkout screen before the order exists. */}
          </View>
          <View style={commerceStyles.deliveryAddressCard}>
            <Icon name="location" size={18} color={colors.primary} />
            <View style={commerceStyles.deliveryAddressText}>
              <Text style={commerceStyles.deliveryAddressType}>{addressType}</Text>
              <Text style={commerceStyles.deliveryAddressLine}>
                {addressLine || 'No delivery address on this order'}
              </Text>
            </View>
          </View>
        </View>

        <View style={commerceStyles.confirmSection}>
          <View style={commerceStyles.confirmSectionHead}>
            <Text style={commerceStyles.confirmSectionTitle}>Payment Method</Text>
            <TouchableOpacity
              onPress={() => {
                if (cards.length === 0) navigation.navigate('PaymentMethods');
                else setPickingCard(value => !value);
              }}
            >
              <Text style={commerceStyles.linkBtnText}>{pickingCard ? 'Done' : 'Change'}</Text>
            </TouchableOpacity>
          </View>
          {selectedCard ? (
            <View style={commerceStyles.paymentMethodCard}>
              <LinearGradient
                colors={[colors.gradientCtaStart, colors.gradientCtaEnd]}
                style={commerceStyles.paymentMethodIcon}
              >
                <Icon name="card" size={18} color="#fff" />
              </LinearGradient>
              <View style={commerceStyles.deliveryAddressText}>
                <Text style={commerceStyles.deliveryAddressType}>
                  {(selectedCard.brand || 'Card').replace(/^./, c => c.toUpperCase())} ••••{' '}
                  {selectedCard.last4}
                </Text>
                <Text style={commerceStyles.deliveryAddressLine}>
                  {selectedCard.cardHolderName ||
                    `Expires ${selectedCard.expMonth}/${selectedCard.expYear}`}
                </Text>
              </View>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.addCardButton}
              onPress={() => navigation.navigate('PaymentMethods')}
            >
              <Icon name="add" size={16} color={colors.primary} />
              <Text style={styles.addCardLabel}>Add a card</Text>
            </TouchableOpacity>
          )}
          {pickingCard ? (
            <View style={commerceStyles.cardPicker}>
              {cards.map(card => {
                const selected = card.id === selectedCardId;
                return (
                  <TouchableOpacity
                    key={card.id}
                    style={[styles.cardRow, selected && styles.cardRowSelected]}
                    onPress={() => {
                      setSelectedCardId(card.id);
                      setPickingCard(false);
                    }}
                  >
                    <LinearGradient
                      colors={[colors.gradientCtaStart, colors.gradientCtaEnd]}
                      style={styles.cardIconWrap}
                    >
                      <Icon name="card" size={20} color="#fff" />
                    </LinearGradient>
                    <Text style={styles.cardLabel}>
                      {(card.brand || 'Card').toUpperCase()} •••• {card.last4}
                    </Text>
                    {selected ? (
                      <Icon name="checkmark-circle" size={22} color={colors.primary} />
                    ) : null}
                  </TouchableOpacity>
                );
              })}
              <TouchableOpacity
                style={styles.addCardButton}
                onPress={() => navigation.navigate('PaymentMethods')}
              >
                <Icon name="add" size={16} color={colors.primary} />
                <Text style={styles.addCardLabel}>Add a card</Text>
              </TouchableOpacity>
            </View>
          ) : null}
        </View>

        <View style={commerceStyles.confirmSection}>
          <Text style={commerceStyles.confirmSectionTitle}>Order Summary</Text>
          <View style={styles.summaryCard}>
            {orders.map(o => (
              <View key={o.id} style={styles.summaryRow}>
                <Text style={styles.summaryLabel} numberOfLines={1}>
                  {o.store?.name || o.vendor?.businessName || 'Store'}
                </Text>
                <Text style={styles.summaryValue}>${Number(o.totalAmount).toFixed(2)}</Text>
              </View>
            ))}
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Items</Text>
              <Text style={styles.summaryValue}>
                {itemCount} item{itemCount === 1 ? '' : '(s)'}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>${sum(orders, o => o.subtotal).toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Delivery Fee</Text>
              <Text style={styles.summaryValue}>
                ${sum(orders, o => o.deliveryFee).toFixed(2)}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Tax</Text>
              <Text style={styles.summaryValue}>${sum(orders, o => o.taxAmount).toFixed(2)}</Text>
            </View>
            {discountAmount > 0 ? (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Points Discount</Text>
                <Text style={styles.summaryDiscount}>
                  -${discountAmount.toFixed(2)}
                </Text>
              </View>
            ) : null}
            <View style={styles.divider} />
            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={[styles.totalValue, { color: colors.primary }]}>
                ${totalAmount.toFixed(2)}
              </Text>
            </View>
          </View>
        </View>

        <PrimaryButton
          testID="checkout-pay"
          label={`Place Order • $${totalAmount.toFixed(2)}`}
          loading={submitting}
          disabled={!selectedCardId}
          onPress={runPay}
          style={{ marginTop: 8 }}
        />
      </ScrollView>
    </MainScreenLayout>
  );
}
