import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { MapPin, Minus, Package, Plus, ShoppingCart, Store, Trash } from 'lucide-react-native';
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
import { cartStoreKey, useCommerceStore } from '../../store/commerceStore';
import { useRewardsStore } from '../../store/rewardsStore';
import type { ApiCart, ApiCheckoutPreview, ProductKind } from '../../services/commerceApi';
import { cartStyles as styles } from './cartStyles';

type Props = NativeStackScreenProps<RootStackParamList, 'CommerceCheckout'>;

const money = (value: unknown) => `$${(Number(value) || 0).toFixed(2)}`;

/**
 * The customer's cart across every store, grouped per store with its own
 * subtotal and delivery fee, and one checkout that pays for all of it.
 */
export default function CommerceCheckoutScreen({ navigation, route }: Props) {
  const kind = route.params?.kind || 'food';
  const carts = useCommerceStore(s => s.carts);
  const itemCount = useCommerceStore(s => s.itemCount);
  const cartSubtotal = useCommerceStore(s => s.subtotal);
  const loadCart = useCommerceStore(s => s.loadCart);
  const preview = useCommerceStore(s => s.preview);
  const createCheckout = useCommerceStore(s => s.createCheckout);
  const setQuantity = useCommerceStore(s => s.setQuantity);
  const clearCart = useCommerceStore(s => s.clearCart);

  const addresses = useAddressStore(s => s.addresses);
  const loadAddresses = useAddressStore(s => s.load);
  const selectedAddressId = useServiceLocationStore(s => s.selectedAddressId);
  const setSelectedAddressId = useServiceLocationStore(s => s.setSelectedAddressId);

  const balance = useRewardsStore(s => s.balance);
  const loadBalance = useRewardsStore(s => s.loadBalance);

  const [quote, setQuote] = useState<ApiCheckoutPreview | null>(null);
  const [redeem, setRedeem] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [choosingAddress, setChoosingAddress] = useState(false);

  const addressId =
    selectedAddressId || addresses.find(a => a.isDefault)?.id || addresses[0]?.id;
  const pointsBalance = Number(balance?.balance ?? 0);
  const anyPowered = carts.some(c => c.vendor?.poweredByDoHuub);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      Promise.all([loadCart(), loadAddresses(), loadBalance().catch(() => {})])
        .catch(err => setError((err as Error).message))
        .finally(() => setLoading(false));
    }, [loadCart, loadAddresses, loadBalance]),
  );

  useEffect(() => {
    if (!carts.length || !addressId) {
      setQuote(null);
      return;
    }
    let live = true;
    const pts = redeem ? Math.floor(pointsBalance / 100) * 100 : 0;
    preview({ deliveryAddressId: addressId, pointsToRedeem: pts || undefined })
      .then(q => {
        if (!live) return;
        setQuote(q);
        setError(null);
      })
      .catch(err => live && setError((err as Error).message));
    return () => {
      live = false;
    };
  }, [carts, addressId, redeem, pointsBalance, preview]);

  const selectedAddress = useMemo(
    () => addresses.find(a => a.id === addressId),
    [addresses, addressId],
  );

  const groupFor = (cart: ApiCart) =>
    quote?.groups?.find(g => g.storeId === cartStoreKey(cart)) ?? null;

  const deliveryFor = (cart: ApiCart) =>
    Number(groupFor(cart)?.deliveryFee ?? cart.store?.deliveryFee ?? cart.vendor?.deliveryFee ?? 0);

  const localDelivery = carts.reduce((sum, c) => sum + deliveryFor(c), 0);
  const subtotal = Number(quote?.subtotal ?? cartSubtotal);
  const deliveryFee = Number(quote?.deliveryFee ?? localDelivery);
  const taxAmount = Number(quote?.taxAmount ?? 0);
  const pointsDiscount = Number(quote?.pointsDiscount ?? 0);
  const total = Number(quote?.totalAmount ?? subtotal + deliveryFee);

  const changeQty = async (productId: string, next: number) => {
    setBusyId(productId);
    try {
      await setQuantity(productId, next);
    } catch (err) {
      Alert.alert('Cart', (err as Error).message);
    } finally {
      setBusyId(null);
    }
  };

  const confirmClear = (cart: ApiCart) => {
    const name = cart.store?.name || cart.vendor?.businessName || 'this store';
    Alert.alert('Remove store?', `Remove all items from ${name}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () =>
          clearCart(cartStoreKey(cart)).catch(err => Alert.alert('Cart', (err as Error).message)),
      },
    ]);
  };

  const proceed = async () => {
    if (!addressId) {
      setError('Add a delivery address first');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const { checkout, order } = await createCheckout({
        deliveryAddressId: addressId,
        pointsToRedeem: quote?.pointsToRedeem || undefined,
      });
      navigation.replace(
        'OrderPayment',
        checkout ? { checkoutId: checkout.id } : { orderId: order.id },
      );
    } catch (err) {
      setError((err as Error).message);
      setSubmitting(false);
    }
  };

  const header = (
    <SubScreenHeader
      title="My Cart"
      subtitle={
        itemCount > 0
          ? `${itemCount} item${itemCount === 1 ? '' : 's'} · ${carts.length} store${
              carts.length === 1 ? '' : 's'
            }`
          : undefined
      }
      onBack={() => navigation.goBack()}
    />
  );

  if (loading && carts.length === 0) {
    return (
      <MainScreenLayout edges={['top', 'bottom']}>
        <View style={styles.flex} testID="cart-screen">
          {header}
          <LoadingState />
        </View>
      </MainScreenLayout>
    );
  }

  if (!carts.length) {
    return (
      <MainScreenLayout edges={['top', 'bottom']}>
        <View style={styles.flex} testID="cart-screen">
          {header}
          <View style={styles.emptyWrap} testID="cart-empty">
            <View style={styles.emptyIcon}>
              <ShoppingCart size={32} color={colors.primary} />
            </View>
            <Text style={styles.emptyTitle}>Your cart is empty</Text>
            <Text style={styles.emptyText}>
              Add items from any food, grocery or beauty store. You can shop from several stores
              and pay once.
            </Text>
            <PrimaryButton
              testID="cart-browse-stores"
              label="Browse stores"
              onPress={() => navigation.navigate('CommerceStores', { kind })}
              style={styles.emptyCta}
            />
          </View>
        </View>
      </MainScreenLayout>
    );
  }

  return (
    <MainScreenLayout edges={['top', 'bottom']}>
      <View style={styles.flex} testID="cart-screen">
        {header}
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {error ? <ErrorBanner message={error} /> : null}

          <View style={styles.card}>
            <View style={styles.rowBetween}>
              <Text style={styles.sectionTitle}>Delivery Address</Text>
              {addresses.length > 1 ? (
                <TouchableOpacity
                  testID="cart-change-address"
                  onPress={() => setChoosingAddress(v => !v)}
                >
                  <Text style={styles.link}>{choosingAddress ? 'Done' : 'Change'}</Text>
                </TouchableOpacity>
              ) : null}
            </View>
            {addresses.length === 0 ? (
              <TouchableOpacity
                testID="cart-add-address"
                onPress={() => navigation.navigate('AddAddress')}
              >
                <Text style={styles.link}>Add a delivery address</Text>
              </TouchableOpacity>
            ) : selectedAddress ? (
              <View style={styles.addressRow}>
                <MapPin size={18} color={colors.primary} />
                <View style={styles.addressText}>
                  <Text style={styles.addressType}>
                    {(selectedAddress.type || 'Home').replace(/^./, c => c.toUpperCase())}
                  </Text>
                  <Text style={styles.addressLine}>
                    {[
                      selectedAddress.address,
                      selectedAddress.city,
                      selectedAddress.state,
                      selectedAddress.zipCode,
                    ]
                      .filter(Boolean)
                      .join(', ')}
                  </Text>
                </View>
              </View>
            ) : null}
            {choosingAddress
              ? addresses.map(a => (
                  <TouchableOpacity
                    key={a.id}
                    onPress={() => {
                      setSelectedAddressId(a.id);
                      setChoosingAddress(false);
                    }}
                    style={[
                      styles.addressChoice,
                      { borderColor: a.id === addressId ? colors.primary : colors.border },
                    ]}
                  >
                    <Text style={styles.addressLine}>
                      {[a.address, a.city, a.state].filter(Boolean).join(', ')}
                    </Text>
                  </TouchableOpacity>
                ))
              : null}
          </View>

          <Text style={styles.sectionTitle}>Items by store</Text>
          {carts.map(cart => {
            const storeId = cartStoreKey(cart);
            const group = groupFor(cart);
            const storeName = cart.store?.name || cart.vendor?.businessName || 'Store';
            const storeImage = cart.store?.image ?? cart.vendor?.image ?? null;
            const minutesMin = cart.store?.deliveryMinutesMin ?? cart.vendor?.deliveryMinutesMin;
            const minutesMax = cart.store?.deliveryMinutesMax ?? cart.vendor?.deliveryMinutesMax;
            const productKind = cart.items[0]?.product?.kind as ProductKind | undefined;
            const storeSubtotal = Number(group?.subtotal ?? cart.subtotal);
            const storeDelivery = deliveryFor(cart);
            return (
              <View key={cart.id} style={styles.card} testID={`cart-store-${storeId}`}>
                <View style={styles.storeHead}>
                  <View style={styles.storeLogo}>
                    {storeImage ? (
                      <Image source={{ uri: storeImage }} style={styles.storeLogoImg} />
                    ) : (
                      <Store size={20} color={colors.primary} />
                    )}
                  </View>
                  <View style={styles.storeInfo}>
                    <Text style={styles.storeName} numberOfLines={1}>
                      {storeName}
                    </Text>
                    <Text style={styles.storeMeta} numberOfLines={1}>
                      {cart.itemCount} item{cart.itemCount === 1 ? '' : 's'}
                      {minutesMin && minutesMax ? ` · ${minutesMin}-${minutesMax} min` : ''}
                    </Text>
                    {cart.vendor?.poweredByDoHuub ? (
                      <View style={styles.poweredPill}>
                        <Text style={styles.poweredPillText}>Powered by DoHuub</Text>
                      </View>
                    ) : null}
                  </View>
                  <View style={styles.itemSide}>
                    {productKind ? (
                      <TouchableOpacity
                        testID={`cart-store-add-more-${storeId}`}
                        onPress={() =>
                          navigation.navigate('CommerceMenu', {
                            vendorId: storeId,
                            kind: productKind,
                          })
                        }
                      >
                        <Text style={styles.link}>Add more</Text>
                      </TouchableOpacity>
                    ) : null}
                    <TouchableOpacity
                      testID={`cart-store-clear-${storeId}`}
                      onPress={() => confirmClear(cart)}
                    >
                      <Text style={styles.linkDanger}>Remove</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {cart.items.map((item, index) => {
                  const product = item.product;
                  const busy = busyId === item.productId;
                  return (
                    <View
                      key={item.id}
                      style={[styles.itemRow, index > 0 ? styles.itemRowDivider : null]}
                      testID={`cart-item-${item.productId}`}
                    >
                      {product?.image ? (
                        <Image source={{ uri: product.image }} style={styles.itemImage} />
                      ) : (
                        <View style={styles.itemImageFallback}>
                          <Package size={22} color={colors.primary} />
                        </View>
                      )}
                      <View style={styles.itemInfo}>
                        <Text style={styles.itemName} numberOfLines={2}>
                          {product?.name || 'Item'}
                        </Text>
                        <Text style={styles.itemUnit}>
                          {money(item.unitPrice)}
                          {product?.unitLabel ? ` · ${product.unitLabel}` : ''}
                        </Text>
                        <View style={styles.qty}>
                          <TouchableOpacity
                            testID={`cart-item-dec-${item.productId}`}
                            style={styles.qtyBtn}
                            disabled={busy}
                            onPress={() => changeQty(item.productId, item.quantity - 1)}
                          >
                            <Minus size={16} color={colors.text} />
                          </TouchableOpacity>
                          <Text style={styles.qtyNum} testID={`cart-item-qty-${item.productId}`}>
                            {item.quantity}
                          </Text>
                          <TouchableOpacity
                            testID={`cart-item-inc-${item.productId}`}
                            style={styles.qtyBtn}
                            disabled={busy}
                            onPress={() => changeQty(item.productId, item.quantity + 1)}
                          >
                            <Plus size={16} color={colors.text} />
                          </TouchableOpacity>
                        </View>
                      </View>
                      <View style={styles.itemSide}>
                        <Text style={styles.itemTotal}>{money(item.lineTotal)}</Text>
                        <TouchableOpacity
                          testID={`cart-item-remove-${item.productId}`}
                          hitSlop={8}
                          disabled={busy}
                          onPress={() => changeQty(item.productId, 0)}
                        >
                          <Trash size={18} color={colors.textMuted} />
                        </TouchableOpacity>
                      </View>
                    </View>
                  );
                })}

                <View style={styles.storeTotals}>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Subtotal</Text>
                    <Text style={styles.summaryValue}>{money(storeSubtotal)}</Text>
                  </View>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Delivery fee</Text>
                    <Text style={styles.summaryValue}>{money(storeDelivery)}</Text>
                  </View>
                  {group ? (
                    <>
                      <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Tax</Text>
                        <Text style={styles.summaryValue}>{money(group.taxAmount)}</Text>
                      </View>
                      <View style={styles.summaryRow}>
                        <Text style={styles.storeSubtotalLabel}>Store total</Text>
                        <Text style={styles.storeSubtotalValue}>{money(group.total)}</Text>
                      </View>
                    </>
                  ) : null}
                </View>
              </View>
            );
          })}

          {anyPowered && pointsBalance > 0 ? (
            <View style={styles.card}>
              <View style={styles.pointsRow}>
                <Text style={styles.pointsText}>
                  Redeem points ({pointsBalance.toLocaleString()} available)
                </Text>
                <Switch testID="cart-redeem-points" value={redeem} onValueChange={setRedeem} />
              </View>
              <Text style={styles.note}>Points apply to Powered by DoHuub stores.</Text>
            </View>
          ) : null}

          <View style={styles.card} testID="cart-totals">
            <Text style={styles.sectionTitle}>Price Details</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>{money(subtotal)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>
                Delivery fee{carts.length > 1 ? ` (${carts.length} stores)` : ''}
              </Text>
              <Text style={styles.summaryValue}>{money(deliveryFee)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Tax</Text>
              <Text style={styles.summaryValue}>{quote ? money(taxAmount) : '—'}</Text>
            </View>
            {pointsDiscount > 0 ? (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>
                  Points discount ({Number(quote?.pointsToRedeem || 0).toLocaleString()} pts)
                </Text>
                <Text style={styles.summaryDiscount}>-{money(pointsDiscount)}</Text>
              </View>
            ) : null}
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue} testID="cart-total">
                {money(total)}
              </Text>
            </View>
            {!quote && addressId ? (
              <Text style={styles.note}>Calculating tax and fees…</Text>
            ) : null}
            {Number(quote?.pointsYouEarn) > 0 ? (
              <Text style={styles.note}>Earn ~{quote?.pointsYouEarn} points after delivery</Text>
            ) : null}
            {carts.length > 1 ? (
              <Text style={styles.note}>
                One payment covers every store. Each store prepares and delivers its own order.
              </Text>
            ) : null}
          </View>

          <PrimaryButton
            testID="checkout-continue"
            label={`Continue to payment · ${money(total)}`}
            loading={submitting}
            disabled={!addressId || busyId !== null}
            onPress={proceed}
            style={styles.continueBtn}
          />
        </ScrollView>
      </View>
    </MainScreenLayout>
  );
}
