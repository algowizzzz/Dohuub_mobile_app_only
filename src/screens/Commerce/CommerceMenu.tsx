import React, { useCallback, useMemo, useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';
import MainScreenLayout from '../../components/layout/MainScreenLayout';
import SubScreenHeader from '../../components/layout/SubScreenHeader';
import LoadingState from '../../components/ui/LoadingState';
import ErrorState from '../../components/ui/ErrorState';
import { colors } from '../../styles';
import { commerceApi, type ApiProduct } from '../../services/commerceApi';
import { storesApi, vendorsApi } from '../../services/catalogApi';
import { useCommerceStore } from '../../store/commerceStore';
import WishlistHeart from '../../components/commerce/WishlistHeart';
import { requireAuth, useIsSignedIn } from '../../hooks/useRequireAuth';
import { styles as serviceStyles } from '../Services/styles';
import { commerceStyles as styles } from './styles';
import { cartStyles } from './cartStyles';

type Props = NativeStackScreenProps<RootStackParamList, 'CommerceMenu'>;

/**
 * iOS clips text inside LinearGradient + overflow:hidden wrappers.
 * Use a solid primary fill for compact CTA chips instead.
 */
export default function CommerceMenuScreen({ navigation, route }: Props) {
  const { vendorId, kind } = route.params;
  const insets = useSafeAreaInsets();
  const carts = useCommerceStore(s => s.carts);
  const cartItemCount = useCommerceStore(s => s.itemCount);
  const cartTotal = useCommerceStore(s => s.subtotal);
  const loadCart = useCommerceStore(s => s.loadCart);
  const setQuantity = useCommerceStore(s => s.setQuantity);
  const signedIn = useIsSignedIn();

  const [storeName, setStoreName] = useState('Store');
  const [powered, setPowered] = useState(false);
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [cat, setCat] = useState('All');
  const [busyId, setBusyId] = useState<string | null>(null);

  const subtitle = kind === 'food' ? 'Browse menu' : 'Browse products';

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    Promise.all([
      // The store list hands over a store's id (the route param kept its old
      // name); older links may still carry a vendor id, hence the fallback.
      storesApi
        .get(vendorId)
        .then(store => ({
          businessName: store.name,
          poweredByDoHuub: Boolean((store as any).vendor?.poweredByDoHuub),
          isStore: true,
        }))
        .catch(() => vendorsApi.get(vendorId).catch(() => null)),
      commerceApi.listProducts({ vendorId, kind, limit: 100 }),
      // The cart is account-bound; guests browse the catalogue only.
      signedIn ? loadCart().catch(() => null) : null,
    ])
      .then(([vendorRes, productPage]) => {
        const vendor = (vendorRes as any)?.vendor ?? vendorRes;
        if (vendor?.businessName) setStoreName(vendor.businessName);
        setPowered(Boolean(vendor?.poweredByDoHuub));
        setProducts(productPage.items);
      })
      .catch(err => setError((err as Error).message))
      .finally(() => setLoading(false));
  }, [vendorId, kind, loadCart, signedIn]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const categories = useMemo(() => {
    const set = new Set(products.map(p => p.menuCategory).filter(Boolean));
    return ['All', ...set];
  }, [products]);

  const items = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter(
      p =>
        (cat === 'All' || p.menuCategory === cat) &&
        (!q ||
          p.name.toLowerCase().includes(q) ||
          (p.description || '').toLowerCase().includes(q)),
    );
  }, [products, query, cat]);

  const qtyFor = (productId: string) => {
    if (!signedIn) return 0;
    for (const c of carts) {
      const line = c.items.find(i => i.productId === productId);
      if (line) return line.quantity;
    }
    return 0;
  };

  const changeQty = async (productId: string, next: number) => {
    if (!requireAuth('Sign in to add items to your cart and check out.')) return;
    setBusyId(productId);
    try {
      // Carts are per store, so adding from another store simply starts a second cart.
      await setQuantity(productId, next);
    } catch (err) {
      Alert.alert('Cart', (err as Error).message);
    } finally {
      setBusyId(null);
    }
  };

  const cartCount = signedIn ? cartItemCount : 0;
  const cartSubtotal = signedIn ? cartTotal : 0;
  const cartBottom = Math.max(insets.bottom, 8) + 10;

  const headerRight = (
    <View style={styles.headerActions}>
      {powered ? (
        <View style={styles.poweredBadge}>
          <Text style={styles.poweredBadgeText} numberOfLines={1}>
            Powered by DoHuub
          </Text>
        </View>
      ) : null}
      {cartCount > 0 ? (
        <TouchableOpacity
          testID="cart-button"
          style={styles.headerCart}
          onPress={() => navigation.navigate('CommerceCheckout', { kind })}
        >
          <Icon name="cart-outline" size={22} color={colors.text} />
          <View style={styles.headerCartBadge}>
            <Text style={styles.headerCartBadgeText}>{cartCount}</Text>
          </View>
        </TouchableOpacity>
      ) : null}
    </View>
  );

  if (loading && products.length === 0) {
    return (
      <MainScreenLayout edges={['top']}>
        <SubScreenHeader title="Menu" onBack={() => navigation.goBack()} />
        <LoadingState />
      </MainScreenLayout>
    );
  }

  if (error && products.length === 0) {
    return (
      <MainScreenLayout edges={['top']}>
        <SubScreenHeader title="Menu" onBack={() => navigation.goBack()} />
        <ErrorState message={error} onRetry={load} />
      </MainScreenLayout>
    );
  }

  return (
    <MainScreenLayout edges={['top']}>
      <SubScreenHeader
        title={storeName}
        subtitle={subtitle}
        onBack={() => navigation.goBack()}
        right={headerRight}
      />
      <View style={[serviceStyles.searchWrap, styles.menuSearchWrap]}>
        <Icon name="search" size={18} color={colors.textMuted} />
        <TextInput
          style={serviceStyles.searchInput}
          value={query}
          onChangeText={setQuery}
          placeholder="Search products..."
          placeholderTextColor={colors.textMuted}
        />
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.chipRow}
        contentContainerStyle={{ alignItems: 'center', paddingVertical: 4 }}
      >
        {categories.map(c => {
          const on = c === cat;
          return (
            <TouchableOpacity
              key={c}
              onPress={() => setCat(c)}
              style={[
                styles.chip,
                on
                  ? styles.chipActive
                  : { backgroundColor: colors.white, borderColor: 'rgba(46, 122, 217, 0.12)' },
              ]}
            >
              <Text style={[styles.chipText, { color: on ? '#fff' : colors.textMuted }]}>{c}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: 8, paddingBottom: cartCount ? cartBottom + 72 : 24 },
        ]}
      >
        {items.length === 0 ? (
          <Text style={[styles.emptyText, { marginTop: 24 }]}>No products in this category</Text>
        ) : (
          <>
            {powered ? (
              <View style={styles.pointsBanner}>
                <View style={styles.pointsIcon}>
                  <Icon name="gift-outline" size={20} color="#B45309" />
                </View>
                <View style={styles.pointsText}>
                  <Text style={styles.pointsTitle}>Earn points on this purchase</Text>
                  <Text style={styles.pointsSub}>
                    1 point per $1 spent • Points added after delivery
                  </Text>
                </View>
              </View>
            ) : null}
            {items.map(item => {
              const qty = qtyFor(item.id);
              const price = Number(item.effectivePrice ?? item.discountedPrice ?? item.price) || 0;
              const out = (item.stockQty ?? 0) <= 0;
              return (
                <View key={item.id} style={styles.productCard}>
                  {item.image ? (
                    <Image source={{ uri: item.image }} style={styles.productImage} />
                  ) : (
                    <View style={styles.productImageFallback}>
                      <Icon name="cube-outline" size={28} color={colors.primary} />
                    </View>
                  )}
                  <View style={styles.productBody}>
                    <View style={cartStyles.titleRow}>
                      <Text style={[styles.itemName, cartStyles.flex]}>{item.name}</Text>
                      <WishlistHeart productId={item.id} variant="plain" size={18} />
                    </View>
                    <Text style={styles.itemDesc} numberOfLines={2}>
                      {item.description || item.menuCategory || '—'}
                    </Text>
                    <View style={styles.productFooter}>
                      <View style={{ flexShrink: 1 }}>
                        <Text style={styles.itemPrice}>${price.toFixed(2)}</Text>
                        {item.unitLabel ? (
                          <Text style={styles.unitLabel}>{item.unitLabel}</Text>
                        ) : null}
                      </View>
                      {out ? (
                        <Text style={styles.outLabel}>Out</Text>
                      ) : qty > 0 ? (
                        <View style={styles.qtyRow}>
                          <TouchableOpacity
                            style={styles.qtyBtn}
                            disabled={busyId === item.id}
                            onPress={() => changeQty(item.id, qty - 1)}
                          >
                            <Text style={styles.qtyBtnText}>−</Text>
                          </TouchableOpacity>
                          <Text style={styles.qtyNum}>{qty}</Text>
                          <TouchableOpacity
                            style={[styles.qtyBtn, styles.qtyBtnPlus]}
                            disabled={busyId === item.id}
                            onPress={() => changeQty(item.id, qty + 1)}
                          >
                            <Text style={[styles.qtyBtnText, { color: '#fff' }]}>+</Text>
                          </TouchableOpacity>
                        </View>
                      ) : (
                        <TouchableOpacity
                          onPress={() => changeQty(item.id, 1)}
                          disabled={busyId === item.id}
                          style={styles.addLabelBtn}
                        >
                          <Icon name="add" size={16} color="#fff" />
                          <Text style={styles.addLabelBtnText}>Add</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                </View>
              );
            })}
          </>
        )}
      </ScrollView>
      {cartCount > 0 ? (
        <View style={[styles.cartBar, { bottom: cartBottom }]}>
          <Text style={styles.cartBarText} numberOfLines={1}>
            {cartCount} item{cartCount === 1 ? '' : 's'} · ${cartSubtotal.toFixed(2)}
          </Text>
          <TouchableOpacity
            testID="cart-bar-checkout"
            style={styles.cartCheckout}
            onPress={() => navigation.navigate('CommerceCheckout', { kind })}
          >
            <Text style={styles.cartCheckoutText}>View cart</Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </MainScreenLayout>
  );
}
