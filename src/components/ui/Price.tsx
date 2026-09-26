import React, { useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import { useCurrencyStore, useDisplayCurrency } from '../../store/currencyStore';
import { convertAmount, formatMoney, normalizeCurrency } from '../../utils/currency';
import { colors, fontFamily } from '../../styles';

type Props = {
  amount: number | string | null | undefined;
  /** The listing's own currency — what is actually charged. */
  currency: string | null | undefined;
  /** Style of the real price line. */
  style?: StyleProp<TextStyle>;
  /** Style of the smaller "≈ USD 12.40" line. */
  convertedStyle?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  /** Text placed before the amount, e.g. "-" for a discount. */
  prefix?: string;
  /** Rendered inside the price line after the amount, e.g. " / night". */
  suffix?: React.ReactNode;
  align?: 'left' | 'right' | 'center';
  /** Drop ".00" on whole amounts. */
  compact?: boolean;
  /** Show only the real price (e.g. a struck-through original price). */
  hideConverted?: boolean;
  testID?: string;
  numberOfLines?: number;
};

/**
 * A price in the currency it is charged in, plus — when that differs from the
 * buyer's display currency and a rate is known — an approximate conversion.
 * The conversion is display-only; charges never change.
 */
export default function Price({
  amount,
  currency,
  style,
  convertedStyle,
  containerStyle,
  prefix = '',
  suffix,
  align = 'left',
  compact,
  hideConverted,
  testID,
  numberOfLines,
}: Props) {
  const display = useDisplayCurrency();
  const rates = useCurrencyStore(state => state.rates);
  const loadRates = useCurrencyStore(state => state.loadRates);
  const code = normalizeCurrency(currency);
  const value = Number(amount) || 0;

  useEffect(() => {
    if (!hideConverted && code !== display) loadRates().catch(() => {});
  }, [code, display, hideConverted, loadRates]);

  const converted =
    hideConverted || code === display ? null : convertAmount(value, code, display, rates);

  const main = (
    <Text style={style} numberOfLines={numberOfLines} testID={testID}>
      {prefix}
      {formatMoney(value, code, { displayCurrency: display, compact })}
      {suffix}
    </Text>
  );

  if (converted == null) return main;

  const alignItems = align === 'right' ? 'flex-end' : align === 'center' ? 'center' : 'flex-start';
  return (
    <View style={[{ alignItems }, containerStyle]}>
      {main}
      <Text
        testID="price-converted"
        style={[styles.converted, { textAlign: align }, convertedStyle]}
        numberOfLines={1}
      >
        ≈ {prefix}
        {formatMoney(converted, display, { codeOnly: true, compact })}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  converted: {
    fontFamily: fontFamily.regular,
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 1,
  },
});
