import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Image, ScrollView, Switch, Text, TouchableOpacity, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';
import MainScreenLayout from '../../components/layout/MainScreenLayout';
import SubScreenHeader from '../../components/layout/SubScreenHeader';
import PrimaryButton from '../../components/ui/PrimaryButton';
import LoadingState from '../../components/ui/LoadingState';
import ErrorBanner from '../../components/ui/ErrorBanner';
import { colors } from '../../styles';
import { useAddressStore } from '../../store/addressStore';
import { useServiceLocationStore } from '../../store/serviceLocationStore';
import { useCommerceStore } from '../../store/commerceStore';
import { useRewardsStore } from '../../store/rewardsStore';
import { commerceStyles as styles } from './styles';

type Props = NativeStackScreenProps<RootStackParamList, 'CommerceCheckout'>;

export default function CommerceCheckoutScreen({ navigation, route }: Props) {
  const kind = route.params?.kind || 'food';
  const cart = useCommerceStore(s => s.cart);
  const loadCart = useCommerceStore(s => s.loadCart);
  const preview = useCommerceStore(s => s.preview);
  const createOrder = useCommerceStore(s => s.createOrder);
  const setQuantity = useCommerceStore(s => s.setQuantity);

  const addresses = useAddressStore(s => s.addresses);
  const loadAddresses = useAddressStore(s => s.load);
  const selectedAddressId = useServiceLocationStore(s => s.selectedAddressId);
  const setSelectedAddressId = useServiceLocationStore(s => s.setSelectedAddressId);

  const balance = useRewardsStore(s => s.balance);
  const loadBalance = useRewardsStore(s => s.loadBalance);

  const [quote, setQuote] = useState<any>(null);
  const [redeem, setRedeem] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [choosingAddress, setChoosingAddress] = useState(false);

  const addressId =
    selectedAddressId ||
    addresses.find(a => a.isDefault)?.id ||
    addresses[0]?.id;

  const pointsBalance = Number((balance as any)?.balance ?? balance ?? 0);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      Promise.all([loadCart(), loadAddresses(), loadBalance().catch(() => {})])
        .catch(() => {})
        .finally(() => setLoading(false));
    }, [loadCart, loadAddresses, loadBalance]),
  );

  useEffect(() => {
    if (!cart?.items?.length) {
      setQuote(null);
      return;
    }
    const pts = redeem ? Math.floor(pointsBalance / 100) * 100 : 0;
    preview({ deliveryAddressId: addressId, pointsToRedeem: pts || undefined })
      .then(setQuote)
      .catch(err => setError((err as Error).message));
  }, [cart, addressId, redeem, pointsBalance, preview]);

  const selectedAddress = useMemo(
    () => addresses.find(a => a.id === addressId),
    [addresses, addressId],
  );

  const total = Number(quote?.totalAmount ?? cart?.subtotal ?? 0);
  const powered = Boolean(cart?.vendor?.poweredByDoHuub);

  const placeOrder = async () => {
    if (!addressId) {
      setError('Add a delivery address first');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const order = await createOrder({
        deliveryAddressId: addressId,
        pointsToRedeem: quote?.pointsToRedeem || undefined,
      });
      navigation.replace('OrderPayment', { orderId: order.id });
    } catch (err) {
      setError((err as Error).message);
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <MainScreenLayout edges={['top', 'bottom']}>
        <SubScreenHeader title="Checkout" onBack={() => navigation.goBack()} />
        <LoadingState />
      </MainScreenLayout>
    );
  }

  if (!cart?.items?.length) {
    return (
      <MainScreenLayout edges={['top', 'bottom']}>
        <SubScreenHeader title="Checkout" onBack={() => navigation.goBack()} />
        <View style={styles.emptyWrap}>
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <TouchableOpacity
            style={[styles.primaryBtn, { marginTop: 16, paddingHorizontal: 24 }]}
            onPress={() => navigation.navigate('CommerceStores', { kind })}
          >
            <Text style={styles.primaryBtnText}>Browse stores</Text>
          </TouchableOpacity>
        </View>
      </MainScreenLayout>
    );
  }

  return (
    <MainScreenLayout edges={['top', 'bottom']}>
      <SubScreenHeader title="Checkout" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {error ? <ErrorBanner message={error} /> : null}

        <View style={styles.card}>
          <View style={styles.cardTitleRow}>
            <Text style={styles.cardTitle}>Delivery Address</Text>
            {addresses.length > 1 ? (
              <TouchableOpacity onPress={() => setChoosingAddress(value => !value)}>
                <Text style={styles.linkBtnText}>{choosingAddress ? 'Done' : 'Change'}</Text>
              </TouchableOpacity>
            ) : null}
          </View>
          {addresses.length === 0 ? (
            <TouchableOpacity
              style={styles.linkBtn}
              onPress={() => navigation.navigate('AddAddress')}
            >
              <Text style={styles.linkBtnText}>Add address</Text>
            </TouchableOpacity>
          ) : selectedAddress ? (
            <View style={styles.deliveryAddressCard}>
              <Icon name="location-outline" size={18} color={colors.primary} />
              <View style={styles.deliveryAddressText}>
                <Text style={styles.deliveryAddressType}>{selectedAddress.type || 'Home'}</Text>
                <Text style={styles.deliveryAddressLine}>
                  {[selectedAddress.address, selectedAddress.city, selectedAddress.state, selectedAddress.zipCode]
                    .filter(Boolean)
                    .join(', ')}
                </Text>
              </View>
            </View>
          ) : null}
          {choosingAddress ? (
            <View style={styles.addressChoiceList}>
              {addresses.map(a => (
                <TouchableOpacity
                  key={a.id}
                  onPress={() => {
                    setSelectedAddressId(a.id);
                    setChoosingAddress(false);
                  }}
                  style={[
                    styles.addressRow,
                    { borderColor: a.id === addressId ? colors.primary : colors.border },
                  ]}
                >
                  <Text style={styles.addressChoiceText}>
                    {[a.address, a.city, a.state].filter(Boolean).join(', ')}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : null}
        </View>

        <Text style={styles.sectionLabel}>Order Items</Text>
        <View style={styles.card}>
          {cart.items.map(item => (
            (() => {
              const previewItem = quote?.cart?.items?.find(
                (row: { productId: string }) => row.productId === item.productId,
              );
              const product = item.product ?? previewItem?.product ?? {};
              const image = product.image ?? item.image ?? previewItem?.image;
              return (
                <View key={item.id} style={styles.checkoutItemRow}>
                  {image ? (
                    <Image source={{ uri: image }} style={styles.checkoutItemImage} />
                  ) : (
                    <View style={styles.checkoutItemImageFallback}>
                      <Icon name="cube-outline" size={22} color={colors.primary} />
                    </View>
                  )}
                  <View style={styles.checkoutItemInfo}>
                    <Text style={styles.checkoutItemName}>{product.name || 'Item'}</Text>
                    <Text style={styles.checkoutItemUnit}>${Number(item.unitPrice).toFixed(2)}</Text>
                    <View style={styles.checkoutQty}>
                      <TouchableOpacity onPress={() => setQuantity(item.productId, item.quantity - 1)}>
                        <Text style={styles.checkoutQtyText}>−</Text>
                      </TouchableOpacity>
                      <Text style={styles.checkoutQtyNum}>{item.quantity}</Text>
                      <TouchableOpacity onPress={() => setQuantity(item.productId, item.quantity + 1)}>
                        <Text style={styles.checkoutQtyText}>+</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={styles.checkoutItemSide}>
                    <Text style={styles.checkoutItemTotal}>${Number(item.lineTotal).toFixed(2)}</Text>
                    <Text style={styles.removeLink} onPress={() => setQuantity(item.productId, 0)}>
                      Remove
                    </Text>
                  </View>
                </View>
              );
            })()
          ))}
        </View>

        {powered ? (
          <View style={styles.card}>
            <View style={[styles.summaryRow, { marginBottom: 0 }]}>
              <Text style={{ color: colors.text, flex: 1 }}>
                Redeem points ({pointsBalance} available)
              </Text>
              <Switch value={redeem} onValueChange={setRedeem} />
            </View>
          </View>
        ) : null}

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Price details</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>
              ${Number(quote?.subtotal ?? cart.subtotal).toFixed(2)}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Delivery</Text>
            <Text style={styles.summaryValue}>
              ${Number(quote?.deliveryFee ?? cart.vendor?.deliveryFee ?? 0).toFixed(2)}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tax</Text>
            <Text style={styles.summaryValue}>${Number(quote?.taxAmount ?? 0).toFixed(2)}</Text>
          </View>
          {quote?.discountAmount > 0 ? (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Points discount</Text>
              <Text style={styles.summaryValue}>-${Number(quote.discountAmount).toFixed(2)}</Text>
            </View>
          ) : null}
          <View style={[styles.summaryRow, styles.summaryTotal]}>
            <Text style={{ fontWeight: '700', color: colors.text }}>Total</Text>
            <Text style={{ fontWeight: '700', color: colors.primary }}>${total.toFixed(2)}</Text>
          </View>
          {quote?.pointsYouEarn > 0 ? (
            <Text style={styles.note}>Earn ~{quote.pointsYouEarn} points after delivery</Text>
          ) : null}
        </View>

        <PrimaryButton
          label={`Place order · $${total.toFixed(2)}`}
          loading={submitting}
          disabled={!addressId}
          onPress={placeOrder}
          style={{ marginTop: 8 }}
        />
      </ScrollView>
    </MainScreenLayout>
  );
}
