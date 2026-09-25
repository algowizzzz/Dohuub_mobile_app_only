import React, { useState } from 'react';
import { Alert, StyleSheet, TouchableOpacity, type StyleProp, type ViewStyle } from 'react-native';
import { Heart } from 'lucide-react-native';
import { colors } from '../../styles';
import { requireAuth, useIsSignedIn } from '../../hooks/useRequireAuth';
import { useWishlistStore } from '../../store/wishlistStore';

type Props = {
  productId?: string;
  serviceId?: string;
  size?: number;
  /** `overlay` draws a white circle so the heart reads on top of photos. */
  variant?: 'overlay' | 'plain';
  /** Pin to the top-right corner of a positioned parent (photo overlays). */
  floating?: boolean;
  style?: StyleProp<ViewStyle>;
};

const HEART_RED = '#EF4444';

/** Saves a product or service to the customer's Shopping List. */
export default function WishlistHeart({
  productId,
  serviceId,
  size = 18,
  variant = 'overlay',
  floating = false,
  style,
}: Props) {
  const signedIn = useIsSignedIn();
  const id = productId ?? serviceId ?? '';
  const saved = useWishlistStore(state =>
    productId ? Boolean(state.productIds[productId]) : Boolean(serviceId && state.serviceIds[serviceId]),
  );
  const toggle = useWishlistStore(state => state.toggle);
  const [busy, setBusy] = useState(false);
  const on = signedIn && saved;

  if (!id) return null;

  const onPress = async () => {
    if (!requireAuth('Sign in to save items to your Shopping List.')) return;
    setBusy(true);
    try {
      await toggle(productId ? { productId } : { serviceId: serviceId as string });
    } catch (err) {
      Alert.alert('Shopping List', (err as Error).message || 'Could not update your list.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <TouchableOpacity
      testID={`wishlist-toggle-${id}`}
      accessibilityRole="button"
      accessibilityLabel={on ? 'Remove from Shopping List' : 'Save to Shopping List'}
      accessibilityState={{ selected: on, busy }}
      hitSlop={8}
      disabled={busy}
      onPress={onPress}
      style={[
        variant === 'overlay' ? styles.overlay : styles.plain,
        floating ? styles.floating : null,
        style,
      ]}
    >
      <Heart
        size={size}
        color={on ? HEART_RED : variant === 'overlay' ? colors.text : colors.textMuted}
        fill={on ? HEART_RED : 'transparent'}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  overlay: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  floating: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  plain: {
    padding: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
