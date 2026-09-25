import React, { useCallback, useMemo, useState } from 'react';
import { Alert, Image, RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Heart, Package, Plus, ShoppingCart, Sparkles, Trash } from 'lucide-react-native';
import type { RootStackParamList } from '../../navigation/types';
import MainScreenLayout from '../../components/layout/MainScreenLayout';
import SubScreenHeader from '../../components/layout/SubScreenHeader';
import LoadingState from '../../components/ui/LoadingState';
import ErrorState from '../../components/ui/ErrorState';
import PrimaryButton from '../../components/ui/PrimaryButton';
import CartButton from '../../components/commerce/CartButton';
import { colors } from '../../styles';
import { useWishlistStore } from '../../store/wishlistStore';
import { useCommerceStore } from '../../store/commerceStore';
import { isRentalListing } from '../../services/catalogApi';
import type { ApiWishlistItem } from '../../services/wishlistApi';
import { styles } from './styles';

type Props = NativeStackScreenProps<RootStackParamList, 'ShoppingList'>;

const money = (value: unknown) => `$${(Number(value) || 0).toFixed(2)}`;

/** Saved products and services ("Shopping List"), opened from Profile. */
export default function ShoppingListScreen({ navigation }: Props) {
  const items = useWishlistStore(s => s.items);
  const loading = useWishlistStore(s => s.itemsLoading);
  const error = useWishlistStore(s => s.error);
  const loadItems = useWishlistStore(s => s.loadItems);
  const removeItem = useWishlistStore(s => s.remove);
  const carts = useCommerceStore(s => s.carts);
  const setQuantity = useCommerceStore(s => s.setQuantity);

  const [loaded, setLoaded] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(() => {
    loadItems()
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, [loadItems]);

  useFocusEffect(load);

  const refresh = () => {
    setRefreshing(true);
    loadItems()
      .catch(() => {})
      .finally(() => setRefreshing(false));
  };

  const products = useMemo(() => items.filter(i => i.type === 'product' && i.product), [items]);
  const services = useMemo(() => items.filter(i => i.type === 'service' && i.service), [items]);

  const cartQty = (productId: string) => {
    for (const c of carts) {
      const line = c.items.find(i => i.productId === productId);
      if (line) return line.quantity;
    }
    return 0;
  };

  const remove = (item: ApiWishlistItem) =>
    removeItem(item).catch(err => Alert.alert('Shopping List', (err as Error).message));

  const addToCart = async (productId: string) => {
    setBusyId(productId);
    try {
      await setQuantity(productId, cartQty(productId) + 1);
    } catch (err) {
      Alert.alert('Cart', (err as Error).message);
    } finally {
      setBusyId(null);
    }
  };

  const openService = (item: ApiWishlistItem) => {
    const service = item.service;
    if (!service) return;
    if (isRentalListing(service)) navigation.navigate('RentalDetail', { propertyId: service.id });
    else
      navigation.navigate('ServiceDetails', { vendorId: service.vendor.id, serviceId: service.id });
  };

  const header = (
    <SubScreenHeader
      title="Shopping List"
      subtitle={items.length ? `${items.length} saved` : undefined}
      onBack={() => navigation.goBack()}
      right={<CartButton />}
    />
  );

  let body: React.ReactNode;
  if (!loaded && loading && items.length === 0) {
    body = <LoadingState />;
  } else if (error && items.length === 0) {
    body = <ErrorState message={error} onRetry={load} />;
  } else if (items.length === 0) {
    body = (
      <View style={styles.emptyWrap} testID="shopping-list-empty">
        <View style={styles.emptyIcon}>
          <Heart size={32} color={colors.danger} />
        </View>
        <Text style={styles.emptyTitle}>Your Shopping List is empty</Text>
        <Text style={styles.emptyText}>
          Tap the heart on a product, service or rental to save it here for later.
        </Text>
        <PrimaryButton
          testID="shopping-list-browse"
          label="Start exploring"
          onPress={() => navigation.navigate('Main', { screen: 'Home' })}
          style={styles.emptyCta}
        />
      </View>
    );
  } else {
    body = (
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}
      >
        <View style={styles.sectionHead}>
          <Text style={styles.sectionTitle}>Products</Text>
          <Text style={styles.sectionCount}>{products.length}</Text>
        </View>
        {products.length === 0 ? (
          <Text style={styles.sectionEmpty}>No saved products yet.</Text>
        ) : (
          products.map(item => {
            const product = item.product!;
            const price = Number(product.effectivePrice ?? product.discountedPrice ?? product.price);
            const out = (product.stockQty ?? 0) <= 0 || product.isActive === false;
            const inCart = cartQty(product.id);
            const storeId = product.storeId ?? product.store?.id;
            const storeName = product.store?.name || product.vendor?.businessName;
            return (
              <TouchableOpacity
                key={item.id}
                testID={`shopping-list-item-${item.id}`}
                activeOpacity={0.85}
                style={styles.card}
                disabled={!storeId}
                onPress={() =>
                  storeId &&
                  navigation.navigate('CommerceMenu', { vendorId: storeId, kind: product.kind })
                }
              >
                {product.image ? (
                  <Image source={{ uri: product.image }} style={styles.image} />
                ) : (
                  <View style={styles.imageFallback}>
                    <Package size={26} color={colors.primary} />
                  </View>
                )}
                <View style={styles.body}>
                  <View style={styles.titleRow}>
                    <Text style={styles.name} numberOfLines={2}>
                      {product.name}
                    </Text>
                    <TouchableOpacity
                      testID={`shopping-list-remove-${item.id}`}
                      accessibilityLabel="Remove from Shopping List"
                      hitSlop={8}
                      onPress={() => remove(item)}
                    >
                      <Trash size={18} color={colors.textMuted} />
                    </TouchableOpacity>
                  </View>
                  {storeName ? (
                    <Text style={styles.meta} numberOfLines={1}>
                      {storeName}
                    </Text>
                  ) : null}
                  <View style={styles.footer}>
                    <Text style={styles.price}>
                      {money(price)}
                      {product.unitLabel ? (
                        <Text style={styles.priceUnit}> / {product.unitLabel}</Text>
                      ) : null}
                    </Text>
                    {out ? (
                      <Text style={styles.outText}>Out of stock</Text>
                    ) : inCart > 0 ? (
                      <TouchableOpacity
                        testID={`shopping-list-in-cart-${product.id}`}
                        style={styles.softBtn}
                        onPress={() => navigation.navigate('CommerceCheckout')}
                      >
                        <ShoppingCart size={14} color={colors.primaryDark} />
                        <Text style={styles.softBtnText}>In cart ({inCart})</Text>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        testID={`shopping-list-add-${product.id}`}
                        style={styles.actionBtn}
                        disabled={busyId === product.id}
                        onPress={() => addToCart(product.id)}
                      >
                        <Plus size={14} color={colors.white} />
                        <Text style={styles.actionBtnText}>Add to cart</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            );
          })
        )}

        <View style={styles.sectionHead}>
          <Text style={styles.sectionTitle}>Services</Text>
          <Text style={styles.sectionCount}>{services.length}</Text>
        </View>
        {services.length === 0 ? (
          <Text style={styles.sectionEmpty}>No saved services or rentals yet.</Text>
        ) : (
          services.map(item => {
            const service = item.service!;
            const rental = isRentalListing(service);
            const nightly = Number(service.rentalDetail?.pricePerNight ?? 0);
            const price = rental && nightly ? nightly : Number(service.discountedPrice ?? service.price);
            const provider = service.store?.name || service.vendor?.businessName;
            return (
              <TouchableOpacity
                key={item.id}
                testID={`shopping-list-item-${item.id}`}
                activeOpacity={0.85}
                style={styles.card}
                onPress={() => openService(item)}
              >
                {service.image ? (
                  <Image source={{ uri: service.image }} style={styles.image} />
                ) : (
                  <View style={styles.imageFallback}>
                    <Sparkles size={26} color={colors.primary} />
                  </View>
                )}
                <View style={styles.body}>
                  <View style={styles.titleRow}>
                    <Text style={styles.name} numberOfLines={2}>
                      {service.name}
                    </Text>
                    <TouchableOpacity
                      testID={`shopping-list-remove-${item.id}`}
                      accessibilityLabel="Remove from Shopping List"
                      hitSlop={8}
                      onPress={() => remove(item)}
                    >
                      <Trash size={18} color={colors.textMuted} />
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.meta} numberOfLines={1}>
                    {[rental ? 'Rental' : service.vendorCategory?.title, provider]
                      .filter(Boolean)
                      .join(' · ')}
                  </Text>
                  <View style={styles.footer}>
                    <Text style={styles.price}>
                      {money(price)}
                      {rental ? (
                        <Text style={styles.priceUnit}> / night</Text>
                      ) : service.pricingType === 'hourly' ? (
                        <Text style={styles.priceUnit}> / hour</Text>
                      ) : null}
                    </Text>
                    <TouchableOpacity
                      testID={`shopping-list-open-${service.id}`}
                      style={styles.softBtn}
                      onPress={() => openService(item)}
                    >
                      <Text style={styles.softBtnText}>{rental ? 'View rental' : 'View service'}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
    );
  }

  return (
    <MainScreenLayout edges={['top', 'bottom']}>
      <View style={styles.flex} testID="shopping-list-screen">
        {header}
        {body}
      </View>
    </MainScreenLayout>
  );
}
