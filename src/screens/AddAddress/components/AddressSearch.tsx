import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../../styles';
import {
  autocompletePlaces,
  createPlacesSessionToken,
  resolvePlace,
  type PlaceSuggestion,
  type ResolvedAddress,
} from '../../../services/placesApi';
import { styles } from './AddressSearch.styles';

const DEBOUNCE_MS = 280;

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  onSelect: (address: ResolvedAddress) => void;
  onError?: (message: string | null) => void;
};

export default function AddressSearch({ value, onChangeText, onSelect, onError }: Props) {
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const [searching, setSearching] = useState(false);
  const sessionTokenRef = useRef(createPlacesSessionToken());
  const skipNextSearchRef = useRef(false);
  const requestIdRef = useRef(0);

  useEffect(() => {
    if (skipNextSearchRef.current) {
      skipNextSearchRef.current = false;
      setSuggestions([]);
      return undefined;
    }

    const query = value.trim();
    if (query.length < 2) {
      setSuggestions([]);
      setSearching(false);
      return undefined;
    }

    const timer = setTimeout(() => {
      const requestId = ++requestIdRef.current;
      setSearching(true);
      autocompletePlaces(query, sessionTokenRef.current)
        .then(results => {
          if (requestId !== requestIdRef.current) return;
          setSuggestions(results);
        })
        .catch(() => {
          if (requestId !== requestIdRef.current) return;
          setSuggestions([]);
        })
        .finally(() => {
          if (requestId === requestIdRef.current) setSearching(false);
        });
    }, DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [value]);

  const handleSelect = async (suggestion: PlaceSuggestion) => {
    setSearching(true);
    setSuggestions([]);
    onError?.(null);
    try {
      const resolved = await resolvePlace(suggestion.placeId, sessionTokenRef.current);
      sessionTokenRef.current = createPlacesSessionToken();
      if (!resolved) {
        onError?.('Could not load that address. Try another suggestion.');
        return;
      }
      skipNextSearchRef.current = true;
      onSelect(resolved);
    } catch {
      onError?.('Could not load that address. Check your connection and try again.');
    } finally {
      setSearching(false);
    }
  };

  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>Street Address</Text>
      <View style={styles.inputRow}>
        <Icon name="search-outline" size={18} color={colors.textMuted} style={styles.searchIcon} />
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder="Search for an address or place"
          placeholderTextColor={colors.textMuted}
          autoCorrect={false}
          autoCapitalize="words"
          returnKeyType="search"
        />
        {searching ? <ActivityIndicator size="small" color={colors.primary} /> : null}
      </View>

      {suggestions.length > 0 ? (
        <View style={styles.dropdown}>
          {suggestions.map((item, index) => (
            <TouchableOpacity
              key={item.placeId}
              style={[styles.row, index === suggestions.length - 1 && styles.rowLast]}
              onPress={() => handleSelect(item)}
              activeOpacity={0.75}
            >
              <View style={styles.rowIcon}>
                <Icon name="location-outline" size={16} color={colors.primary} />
              </View>
              <View style={styles.rowText}>
                <Text style={styles.primary} numberOfLines={1}>
                  {item.primary}
                </Text>
                {item.secondary ? (
                  <Text style={styles.secondary} numberOfLines={1}>
                    {item.secondary}
                  </Text>
                ) : null}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      ) : null}

      <Text style={styles.hint}>Start typing — pick a suggestion and we fill in city, state, zip and the map.</Text>
    </View>
  );
}
