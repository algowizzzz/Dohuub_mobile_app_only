import React, { useEffect, useState } from 'react';
import { Modal, ScrollView, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../styles';
import {
  COUNTRIES,
  countryFromIso,
  digitsOnly,
  isValidNationalNumber,
  localeCountryIso,
  splitE164,
  type CountryDial,
} from '../../constants/countries';
import { useServiceLocationStore } from '../../store/serviceLocationStore';
import { styles } from './PhoneField.styles';

type Props = {
  label?: string;
  value: string;
  onChange: (e164: string, valid: boolean) => void;
  error?: string | null;
  required?: boolean;
};

export default function PhoneField({
  label = 'Phone Number',
  value,
  onChange,
  error,
  required = true,
}: Props) {
  const initial = splitE164(value);
  const detectedIso = useServiceLocationStore(state => state.countryIso);
  const [country, setCountry] = useState<CountryDial>(
    detectedIso ? countryFromIso(detectedIso) : initial.country.dial ? initial.country : countryFromIso(localeCountryIso()),
  );
  const [local, setLocal] = useState(initial.local);
  const [pickerVisible, setPickerVisible] = useState(false);

  useEffect(() => {
    if (!value && detectedIso) {
      setCountry(countryFromIso(detectedIso));
    }
  }, [detectedIso, value]);

  const emit = (nextCountry: CountryDial, nextLocal: string) => {
    const digits = digitsOnly(nextLocal);
    const e164 = digits ? `${nextCountry.dial}${digits}` : '';
    const valid =
      digits.length === 0 ? !required : isValidNationalNumber(nextCountry, digits);
    onChange(e164, valid);
  };

  return (
    <View style={styles.wrap}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={styles.row}>
        <TouchableOpacity style={styles.codeButton} onPress={() => setPickerVisible(true)} activeOpacity={0.8}>
          <Text style={styles.codeLabel}>{country.dial}</Text>
          <Icon name="chevron-down" size={14} color={colors.textMuted} />
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          value={local}
          onChangeText={text => {
            const digits = digitsOnly(text).slice(0, country.max);
            setLocal(digits);
            emit(country, digits);
          }}
          placeholder={`${country.min} digits`}
          placeholderTextColor={colors.textMuted}
          keyboardType="number-pad"
          inputMode="numeric"
          textContentType="telephoneNumber"
          maxLength={country.max}
        />
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Modal visible={pickerVisible} transparent animationType="slide" onRequestClose={() => setPickerVisible(false)}>
        <TouchableWithoutFeedback onPress={() => setPickerVisible(false)}>
          <View style={styles.overlay}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <View style={styles.sheet}>
                <Text style={styles.sheetTitle}>Country code</Text>
                <ScrollView style={styles.sheetList} keyboardShouldPersistTaps="handled">
                  {COUNTRIES.map(item => (
                    <TouchableOpacity
                      key={`${item.iso}-${item.dial}`}
                      style={[styles.sheetOption, country.iso === item.iso && styles.sheetOptionActive]}
                      onPress={() => {
                        setCountry(item);
                        setPickerVisible(false);
                        emit(item, local);
                      }}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.sheetOptionLabel}>
                        {item.name}  {item.dial}
                      </Text>
                      {country.iso === item.iso ? (
                        <Icon name="checkmark" size={18} color={colors.primary} />
                      ) : null}
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}
