import React, { useEffect, useState } from 'react';
import { AppState, StyleSheet, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ShoppingCart } from 'lucide-react-native';
import { colors } from '../../styles';
import { navigationRef } from '../../navigation/navigationRef';
import { useIsSignedIn } from '../../hooks/useRequireAuth';
import { useCommerceStore } from '../../store/commerceStore';
import { useWishlistStore } from '../../store/wishlistStore';
import { CartBadge } from './CartButton';

/**
 * Browse screens that show the floating cart. Tab screens carry the cart icon
 * in their HomeHeader instead, CommerceMenu has its own header cart and bar,
 * and checkout/booking/auth flows stay uncluttered.
 */
const FAB_ROUTES = new Set<string>([
  'Services',
  'CommerceChoice',
  'CommerceStores',
  'VendorStore',
  'Vendor',
  'VendorReviews',
  'RentalsList',
  'RentalDetail',
  'ServiceDetails',
  'OrderDetail',
  'BookingDetail',
  'RewardsWallet',
  'PointsHistory',
  'ReferFriend',
  'HelpSupport',
]);

/**
 * Keeps the cart (and Shopping List ids) loaded for the signed-in customer and
 * renders a floating cart button on browse screens whenever the cart has items.
 * Mounted once inside the NavigationContainer.
 */
export default function GlobalCartFab() {
  const insets = useSafeAreaInsets();
  const signedIn = useIsSignedIn();
  const count = useCommerceStore(state => state.itemCount);
  const [routeName, setRouteName] = useState<string | undefined>();

  // Load on app start / sign-in, clear on sign-out, refresh on foreground.
  useEffect(() => {
    if (!signedIn) {
      useCommerceStore.getState().resetCart();
      useWishlistStore.getState().reset();
      return;
    }
    const refresh = () => {
      useCommerceStore.getState().loadCart().catch(() => {});
      useWishlistStore.getState().loadIds().catch(() => {});
    };
    refresh();
    const sub = AppState.addEventListener('change', next => {
      if (next === 'active') refresh();
    });
    return () => sub.remove();
  }, [signedIn]);

  useEffect(() => {
    const update = () => {
      if (navigationRef.isReady()) setRouteName(navigationRef.getCurrentRoute()?.name);
    };
    update();
    return navigationRef.addListener('state', update);
  }, []);

  if (!signedIn || count <= 0 || !routeName || !FAB_ROUTES.has(routeName)) return null;

  return (
    <View pointerEvents="box-none" style={[styles.host, { bottom: insets.bottom + 96 }]}>
      <TouchableOpacity
        testID="cart-button"
        accessibilityRole="button"
        accessibilityLabel={`Cart, ${count} item${count === 1 ? '' : 's'}`}
        activeOpacity={0.85}
        onPress={() => navigationRef.navigate('CommerceCheckout')}
        style={styles.fab}
      >
        <View style={styles.fill}>
          <LinearGradient
            colors={[colors.gradientCtaStart, colors.gradientCtaEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          <ShoppingCart size={24} color={colors.white} />
        </View>
        <CartBadge count={count} />
      </TouchableOpacity>
    </View>
  );
}

const SIZE = 56;

const styles = StyleSheet.create({
  host: {
    position: 'absolute',
    right: 16,
  },
  fab: {
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    shadowColor: '#1D4AAD',
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  fill: {
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
