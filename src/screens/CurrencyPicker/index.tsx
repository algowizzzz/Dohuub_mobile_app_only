import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, Text, TextInput, TouchableOpacity, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Check, Search } from 'lucide-react-native';
import type { RootStackParamList } from '../../navigation/types';
import MainScreenLayout from '../../components/layout/MainScreenLayout';
import SubScreenHeader from '../../components/layout/SubScreenHeader';
import LoadingState from '../../components/ui/LoadingState';
import { useCurrencyStore, useDisplayCurrency } from '../../store/currencyStore';
import type { ApiCurrency } from '../../services/fxApi';
import { colors } from '../../styles';
import { styles } from './styles';

type Props = NativeStackScreenProps<RootStackParamList, 'CurrencyPicker'>;

/** Used when `/fx/currencies` can't be reached, so the picker still works offline. */
const FALLBACK: ApiCurrency[] = [
  { code: 'USD', name: 'US Dollar', symbol: '$', decimals: 2 },
  { code: 'JMD', name: 'Jamaican Dollar', symbol: 'J$', decimals: 2 },
  { code: 'EUR', name: 'Euro', symbol: '€', decimals: 2 },
  { code: 'GBP', name: 'British Pound', symbol: '£', decimals: 2 },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'CA$', decimals: 2 },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', decimals: 2 },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', decimals: 2 },
  { code: 'NGN', name: 'Nigerian Naira', symbol: '₦', decimals: 2 },
  { code: 'TTD', name: 'Trinidad & Tobago Dollar', symbol: 'TT$', decimals: 2 },
  { code: 'MXN', name: 'Mexican Peso', symbol: 'MX$', decimals: 2 },
];

type Row = { key: string; code: string | null; title: string; sub?: string };

export default function CurrencyPickerScreen({ navigation }: Props) {
  const override = useCurrencyStore(state => state.override);
  const deviceDefault = useCurrencyStore(state => state.deviceDefault);
  const currencies = useCurrencyStore(state => state.currencies);
  const loadCurrencies = useCurrencyStore(state => state.loadCurrencies);
  const setOverride = useCurrencyStore(state => state.setOverride);
  const current = useDisplayCurrency();
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(currencies.length === 0);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let alive = true;
    loadCurrencies()
      .catch(() => alive && setFailed(true))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [loadCurrencies]);

  const rows = useMemo<Row[]>(() => {
    const list = currencies.length ? currencies : failed ? FALLBACK : [];
    const q = query.trim().toLowerCase();
    const matches = list.filter(
      c => !q || c.code.toLowerCase().includes(q) || c.name.toLowerCase().includes(q),
    );
    const out: Row[] = [];
    if (!q) {
      out.push({
        key: 'auto',
        code: null,
        title: `Automatic (${deviceDefault})`,
        sub: 'Follows your device region',
      });
    }
    return out.concat(
      matches.map(c => ({
        key: c.code,
        code: c.code,
        title: c.name,
        sub: c.symbol && c.symbol !== c.code ? c.symbol : undefined,
      })),
    );
  }, [currencies, failed, query, deviceDefault]);

  const pick = (code: string | null) => {
    setOverride(code);
    navigation.goBack();
  };

  return (
    <MainScreenLayout edges={['top', 'bottom']}>
      <SubScreenHeader
        title="Display currency"
        subtitle={`Showing prices in ${current}`}
        onBack={() => navigation.goBack()}
      />

      <View style={styles.body} testID="currency-picker">
        <View style={styles.searchWrap}>
          <Search size={18} color={colors.textMuted} />
          <TextInput
            testID="currency-search"
            style={styles.searchInput}
            value={query}
            onChangeText={setQuery}
            placeholder="Search currency or code"
            placeholderTextColor={colors.textFaint}
            autoCapitalize="none"
            autoCorrect={false}
            clearButtonMode="while-editing"
          />
        </View>
        <Text style={styles.hint}>
          Converted prices are approximate. You are always charged in the seller's currency.
        </Text>

        {loading ? (
          <LoadingState />
        ) : (
          <FlatList
            data={rows}
            keyExtractor={r => r.key}
            contentContainerStyle={styles.listContent}
            keyboardShouldPersistTaps="handled"
            ListEmptyComponent={<Text style={styles.empty}>No currency matches “{query}”.</Text>}
            renderItem={({ item }) => {
              const selected = item.code === null ? override === null : override === item.code;
              return (
                <TouchableOpacity
                  testID={item.code ? `currency-option-${item.code}` : 'currency-option-auto'}
                  style={[styles.row, selected && styles.rowSelected]}
                  onPress={() => pick(item.code)}
                  activeOpacity={0.7}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                >
                  {item.code ? <Text style={styles.code}>{item.code}</Text> : null}
                  <View style={styles.nameCol}>
                    <Text style={styles.name}>{item.title}</Text>
                    {item.sub ? <Text style={styles.sub}>{item.sub}</Text> : null}
                  </View>
                  {selected ? <Check size={18} color={colors.primary} /> : null}
                </TouchableOpacity>
              );
            }}
          />
        )}
      </View>
    </MainScreenLayout>
  );
}
