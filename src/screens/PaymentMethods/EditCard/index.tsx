import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../navigation/types';
import { colors } from '../../../styles';
import ScreenStatusBar from '../../../components/layout/ScreenStatusBar';
import SubScreenHeader from '../../../components/layout/SubScreenHeader';
import LoadingState from '../../../components/ui/LoadingState';
import ErrorState from '../../../components/ui/ErrorState';
import ErrorBanner from '../../../components/ui/ErrorBanner';
import { ApiError } from '../../../services/ApiError';
import { usePaymentCardStore } from '../../../store/paymentCardStore';
import { styles } from './styles';

type Props = NativeStackScreenProps<RootStackParamList, 'EditPaymentCard'>;

function capitalizeBrand(value?: string): string {
  if (!value) return 'Card';
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function formatMonth(month: number): string {
  if (!month) return '';
  return String(month).padStart(2, '0');
}

function formatYear(year: number): string {
  if (!year) return '';
  return year < 100 ? String(2000 + year) : String(year);
}

function FieldLabel({ children }: { children: string }) {
  return (
    <Text style={styles.label}>
      {children} <Text style={styles.asterisk}>*</Text>
    </Text>
  );
}

export default function EditPaymentCardScreen({ navigation, route }: Props) {
  const cardId = route.params.cardId;
  const cards = usePaymentCardStore(state => state.cards);
  const loading = usePaymentCardStore(state => state.loading);
  const load = usePaymentCardStore(state => state.load);
  const setDefault = usePaymentCardStore(state => state.setDefault);
  const card = cards.find(item => item.id === cardId);

  const [isDefault, setIsDefault] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      if (!card) {
        load().catch(() => {});
      }
    }, [card, load]),
  );

  useEffect(() => {
    if (card) {
      setIsDefault(card.isDefault);
    }
  }, [card]);

  const handleSave = async () => {
    if (!card || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      if (isDefault && !card.isDefault) {
        await setDefault(card.id);
      }
      navigation.goBack();
    } catch (err) {
      setError(ApiError.messageOf(err, 'Could not save changes.'));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading && !card) {
    return (
      <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
        <ScreenStatusBar backgroundColor={colors.white} barStyle="dark-content" />
        <SubScreenHeader title="Edit Payment Card" onBack={() => navigation.goBack()} />
        <LoadingState />
      </SafeAreaView>
    );
  }

  if (!card) {
    return (
      <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
        <ScreenStatusBar backgroundColor={colors.white} barStyle="dark-content" />
        <SubScreenHeader title="Edit Payment Card" onBack={() => navigation.goBack()} />
        <ErrorState message="This card is no longer saved." />
      </SafeAreaView>
    );
  }

  const month = formatMonth(card.expMonth);
  const year = formatYear(card.expYear);
  const holderName = (card.cardHolderName || '').toUpperCase();
  const maskedNumber = card.last4 ? `•••• •••• •••• ${card.last4}` : '•••• •••• •••• ••••';

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <ScreenStatusBar backgroundColor={colors.white} barStyle="dark-content" />
      <SubScreenHeader title="Edit Payment Card" onBack={() => navigation.goBack()} />

      <View style={styles.body}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <LinearGradient
            colors={[colors.gradientStart, colors.gradientEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.preview}
          >
            <View style={styles.previewTop}>
              <View style={styles.chip} />
              <Text style={styles.previewBrand}>{capitalizeBrand(card.brand)}</Text>
            </View>
            <Text style={styles.previewNumber}>{maskedNumber}</Text>
            <View style={styles.previewBottom}>
              <View>
                <Text style={styles.previewLabel}>Cardholder Name</Text>
                <Text style={styles.previewValue}>{holderName || 'FULL NAME'}</Text>
              </View>
              <View style={styles.previewExpiryCol}>
                <Text style={styles.previewLabel}>Expires</Text>
                <Text style={styles.previewValue}>
                  {month && year ? `${month}/${year}` : 'MM/YYYY'}
                </Text>
              </View>
            </View>
          </LinearGradient>

          <View style={styles.field}>
            <FieldLabel>Card Number</FieldLabel>
            <TextInput
              style={styles.input}
              value={maskedNumber}
              editable={false}
              caretHidden
            />
          </View>

          <View style={styles.field}>
            <FieldLabel>Cardholder Name</FieldLabel>
            <TextInput
              style={styles.input}
              value={holderName}
              editable={false}
              caretHidden
              placeholder="JOHN DOE"
              placeholderTextColor={colors.textMuted}
            />
          </View>

          <View style={styles.row}>
            <View style={styles.rowHalf}>
              <FieldLabel>Expiry Date</FieldLabel>
              <View style={styles.expiryInputs}>
                <TextInput
                  style={[styles.input, styles.expiryInput]}
                  value={month}
                  editable={false}
                  caretHidden
                  placeholder="MM"
                  placeholderTextColor={colors.textMuted}
                />
                <Text style={styles.expirySlash}>/</Text>
                <TextInput
                  style={[styles.input, styles.expiryInput]}
                  value={year}
                  editable={false}
                  caretHidden
                  placeholder="YYYY"
                  placeholderTextColor={colors.textMuted}
                />
              </View>
            </View>
            <View style={styles.rowHalf}>
              <FieldLabel>CVV</FieldLabel>
              <TextInput
                style={styles.input}
                value="•••"
                editable={false}
                caretHidden
                placeholder="123"
                placeholderTextColor={colors.textMuted}
              />
            </View>
          </View>

          <TouchableOpacity
            style={styles.checkboxRow}
            onPress={() => setIsDefault(prev => !prev)}
            activeOpacity={0.7}
          >
            <View style={[styles.checkbox, isDefault && styles.checkboxChecked]}>
              {isDefault ? <Icon name="checkmark" size={14} color={colors.white} /> : null}
            </View>
            <Text style={styles.checkboxLabel}>Set as default payment method</Text>
          </TouchableOpacity>

          {error ? <ErrorBanner message={error} /> : null}

          <LinearGradient
            colors={[colors.gradientStart, colors.gradientEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.secureBar}
          >
            <Icon name="lock-closed" size={16} color={colors.white} />
            <Text style={styles.secureBarLabel}>Secured by Stripe</Text>
          </LinearGradient>

          <TouchableOpacity
            style={[styles.saveButtonWrap, submitting && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={submitting}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={[colors.gradientStart, colors.gradientEnd]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.saveButton}
            >
              <Text style={styles.saveButtonLabel}>{submitting ? 'Saving…' : 'Save Changes'}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
