import React from 'react';
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { fontFamily } from '../../styles';
import type { ApiRentalTerm } from '../../services/catalogApi';

/** The vendor form's "Rental Type" options, in display order. */
export const RENTAL_TERMS: { value: ApiRentalTerm; label: string }[] = [
  { value: 'short_term', label: 'Short Term' },
  { value: 'long_term', label: 'Long Term' },
  { value: 'commercial', label: 'Commercial' },
];

const LABELS: Record<string, string> = Object.fromEntries(
  RENTAL_TERMS.map(t => [t.value, t.label]),
);

/** Known terms only, in display order, whatever order the API sent them in. */
export function normalizeRentalTerms(terms: readonly string[] | null | undefined): ApiRentalTerm[] {
  const set = new Set(terms ?? []);
  return RENTAL_TERMS.map(t => t.value).filter(v => set.has(v));
}

export const rentalTermLabel = (term: string) => LABELS[term] ?? term;

/** Small teal pills — one per rental term the listing is offered under. */
export function RentalTermPills({
  terms,
  style,
  testIDPrefix = 'rental-term-pill',
}: {
  terms: readonly string[];
  style?: StyleProp<ViewStyle>;
  testIDPrefix?: string;
}) {
  if (!terms.length) return null;
  return (
    <View style={[pillStyles.row, style]}>
      {terms.map(term => (
        <View key={term} style={pillStyles.pill} testID={`${testIDPrefix}-${term}`}>
          <Text style={pillStyles.text}>{rentalTermLabel(term)}</Text>
        </View>
      ))}
    </View>
  );
}

/** Spacing presets for where the pills sit on each screen. */
export const rentalTermSpacing = StyleSheet.create({
  card: { marginBottom: 8 },
  detail: { marginTop: 8 },
});

const pillStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  pill: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 999,
    backgroundColor: 'rgba(20, 184, 166, 0.12)',
  },
  text: {
    fontFamily: fontFamily.regular,
    fontSize: 12,
    color: '#0F766E',
  },
});
