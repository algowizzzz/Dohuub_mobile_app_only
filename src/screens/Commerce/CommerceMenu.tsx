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
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';
import MainScreenLayout from '../../components/layout/MainScreenLayout';
import SubScreenHeader from '../../components/layout/SubScreenHeader';
import LoadingState from '../../components/ui/LoadingState';
import ErrorState from '../../components/ui/ErrorState';
import { colors } from '../../styles';
import { commerceApi, type ApiProduct } from '../../services/commerceApi';
import { vendorsApi } from '../../services/catalogApi';
import { useCommerceStore } from '../../store/commerceStore';
import { ApiError } from '../../services/ApiError';
import { styles as serviceStyles } from '../Services/styles';
import { commerceStyles as styles } from './styles';

type Props = NativeStackScreenProps<RootStackParamList, 'CommerceMenu'>;

export default function CommerceMenuScreen({ navigation, route }: Props) {
  const { vendorId, kind } = route.params;
  const cart = useCommerceStore(s => s.cart);
  const loadCart = useCommerceStore(s => s.loadCart);
  const setQuantity = useCommerceStore(s => s.setQuantity);

  const [storeName, setStoreName] = useState('Store');
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [cat, setCat] = useState('All');
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    Promise.all([
      vendorsApi.get(vendorId).catch(() => null),
      commerceApi.listProducts({ vendorId, kind, limit: 100 }),
      loadCart().catch(() => null),
    ])
      .then(([vendorRes, productPage]) => {
        const vendor = (vendorRes as any)?.vendor ?? vendorRes;
        if (vendor?.businessName) setStoreName(vendor.businessName);
        setProducts(productPage.items);
      })
      .catch(err => setError((err as Error).message))
      .finally(() => setLoading(false));
  }, [vendorId, kind, loadCart]);

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
    if (!cart?.items || cart.vendorId !== vendorId) return 0;
    return cart.items.find(i => i.productId === productId)?.quantity || 0;
  };

  const changeQty = async (productId: string, next: number) => {
    setBusyId(productId);
    try {
      await setQuantity(productId, next, { replaceVendor: false });
    } catch (err) {
      if (err instanceof ApiError && err.code === 'CART_VENDOR_MISMATCH') {
        Alert.alert('Replace cart?', 'Your cart has items from another store.', [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Replace',
            onPress: () => setQuantity(productId, next, { replaceVendor: true }).catch(() => {}),
          },
        ]);
      } else {
        Alert.alert('Cart', (err as Error).message);
      }
    } finally {
      setBusyId(null);
    }
  };

  const cartCount = cart?.vendorId === vendorId ? cart.itemCount || 0 : 0;
  const cartSubtotal = cart?.vendorId === vendorId ? cart.subtotal || 0 : 0;

  if (loading && products.length === 0) {
    return (
      <MainScreenLayout edges={['top', 'bottom']}>
        <SubScreenHeader title="Menu" onBack={() => navigation.goBack()} />
        <LoadingState />
      </MainScreenLayout>
    );
  }

  if (error && products.length === 0) {
    return (
      <MainScreenLayout edges={['top', 'bottom']}>
        <SubScreenHeader title="Menu" onBack={() => navigation.goBack()} />
        <ErrorState message={error} onRetry={load} />
      </MainScreenLayout>
    );
  }

  return (
    <MainScreenLayout edges={['top', 'bottom']}>
      <SubScreenHeader title={storeName} onBack={() => navigation.goBack()} />
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
          { paddingTop: 8, paddingBottom: cartCount ? 100 : 24 },
        ]}
      >
        {items.length === 0 ? (
          <Text style={[styles.emptyText, { marginTop: 24 }]}>No products in this category</Text>
        ) : (
          <>
            <View style={styles.pointsBanner}>
              <View style={styles.pointsIcon}>
                <Icon name="gift-outline" size={20} color="#B45309" />
              </View>
              <View style={styles.pointsText}>
                <Text style={styles.pointsTitle}>
                  Earn points on this {kind === 'food' ? 'service' : 'purchase'}
                </Text>
                <Text style={styles.pointsSub}>
                  1 point per $1 spent • Points added after delivery
                </Text>
              </View>
            </View>
            {items.map(item => {
            const qty = qtyFor(item.id);
            const price = Number(item.effectivePrice ?? item.discountedPrice ?? item.price) || 0;
            const out = (item.stockQty ?? 0) <= 0;
            return (
              <View key={item.id} style={styles.itemRow}>
                {item.image ? (
                  <Image source={{ uri: item.image }} style={styles.itemTile} />
                ) : (
                  <View style={styles.itemTileFallback}>
                    <Icon name="cube-outline" size={22} color={colors.primary} />
                  </View>
                )}
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemDesc} numberOfLines={2}>
                    {[item.unitLabel, item.description].filter(Boolean).join(' · ') ||
                      item.menuCategory}
                  </Text>
                  <Text style={styles.itemPrice}>${price.toFixed(2)}</Text>
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
                      <LinearGradient
                        colors={[colors.gradientCtaStart, colors.gradientCtaEnd]}
                        style={styles.qtyBtnFill}
                      >
                        <Text style={[styles.qtyBtnText, { color: '#fff' }]}>+</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity
                    onPress={() => changeQty(item.id, 1)}
                    disabled={busyId === item.id}
                    style={styles.addBtn}
                  >
                    <LinearGradient
                      colors={[colors.gradientCtaStart, colors.gradientCtaEnd]}
                      style={styles.addBtnFill}
                    >
                      <Text style={{ color: '#fff', fontWeight: '700', fontSize: 18 }}>+</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                )}
              </View>
            );
            })}
          </>
        )}
      </ScrollView>
      {cartCount > 0 ? (
        <View style={styles.cartBar}>
          <LinearGradient
            colors={[colors.gradientCtaStart, colors.gradientCtaEnd]}
            style={styles.cartBarFill}
          >
            <Text style={styles.cartBarText}>
              {cartCount} items · ${cartSubtotal.toFixed(2)}
            </Text>
            <TouchableOpacity
              style={styles.cartCheckout}
              onPress={() => navigation.navigate('CommerceCheckout', { kind })}
            >
              <Text style={styles.cartCheckoutText}>Checkout</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      ) : null}
    </MainScreenLayout>
  );
}
