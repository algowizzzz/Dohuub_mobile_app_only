import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, type StyleProp, type ViewStyle } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ShoppingCart } from 'lucide-react-native';
import { colors, fontFamily } from '../../styles';
import { useIsSignedIn } from '../../hooks/useRequireAuth';
import { useCommerceStore } from '../../store/commerceStore';

type Props = {
  style?: StyleProp<ViewStyle>;
  size?: number;
  testID?: string;
};

/** Header cart icon with a count badge; renders nothing while the cart is empty. */
export default function CartButton({ style, size = 22, testID = 'cart-button' }: Props) {
  const navigation = useNavigation();
  const signedIn = useIsSignedIn();
  const count = useCommerceStore(state => state.itemCount);

  if (!signedIn || count <= 0) return null;

  return (
    <TouchableOpacity
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={`Cart, ${count} item${count === 1 ? '' : 's'}`}
      hitSlop={8}
      style={[styles.button, style]}
      onPress={() => navigation.navigate('CommerceCheckout')}
    >
      <ShoppingCart size={size} color={colors.text} />
      <CartBadge count={count} />
    </TouchableOpacity>
  );
}

export function CartBadge({ count, inverted }: { count: number; inverted?: boolean }) {
  return (
    <View
      testID="cart-count-badge"
      style={[styles.badge, inverted ? styles.badgeInverted : null]}
    >
      <Text style={[styles.badgeText, inverted ? styles.badgeTextInverted : null]}>
        {count > 99 ? '99+' : count}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: 2,
    right: 0,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    paddingHorizontal: 4,
    backgroundColor: colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: colors.white,
  },
  badgeInverted: {
    backgroundColor: colors.white,
    borderColor: colors.primary,
  },
  badgeText: {
    color: colors.white,
    fontSize: 10,
    fontFamily: fontFamily.medium,
  },
  badgeTextInverted: {
    color: colors.primary,
  },
});
