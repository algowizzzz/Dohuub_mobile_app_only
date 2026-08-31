import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { CardField, useConfirmSetupIntent, type CardFieldInput } from '@stripe/stripe-react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../../styles';
import { cardsApi } from '../../../services/accountApi';
import { ApiError } from '../../../services/ApiError';
import ErrorBanner from '../../../components/ui/ErrorBanner';
import ScreenStatusBar from '../../../components/layout/ScreenStatusBar';
import SubScreenHeader from '../../../components/layout/SubScreenHeader';
import { styles } from './AddCardModal.styles';

export type SavedCardResult = {
  paymentMethodId: string;
  cardHolderName: string;
  setAsDefault: boolean;
};

type Props = {
  visible: boolean;
  onCancel: () => void;
  onSave: (result: SavedCardResult) => void;
};

function capitalizeBrand(value?: string): string {
  if (!value) return 'Card';
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export default function AddCardModal({ visible, onCancel, onSave }: Props) {
  const [nameOnCard, setNameOnCard] = useState('');
  const [cardComplete, setCardComplete] = useState(false);
  const [last4, setLast4] = useState('');
  const [brand, setBrand] = useState('');
  const [expiryMonth, setExpiryMonth] = useState<number | null>(null);
  const [expiryYear, setExpiryYear] = useState<number | null>(null);
  const [setAsDefault, setSetAsDefault] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldKey, setFieldKey] = useState(0);
  const { confirmSetupIntent } = useConfirmSetupIntent();

  const canSave = nameOnCard.trim().length > 0 && cardComplete && !submitting;

  const resetForm = () => {
    setNameOnCard('');
    setCardComplete(false);
    setLast4('');
    setBrand('');
    setExpiryMonth(null);
    setExpiryYear(null);
    setSetAsDefault(false);
    setError(null);
    setFieldKey(key => key + 1);
  };

  const handleCancel = () => {
    resetForm();
    onCancel();
  };

  const handleCardChange = (details: CardFieldInput.Details) => {
    setCardComplete(details.complete);
    setLast4(details.last4 ?? '');
    setBrand(details.brand ?? '');
    setExpiryMonth(details.expiryMonth ?? null);
    setExpiryYear(details.expiryYear ?? null);
  };

  const handleSave = async () => {
    if (!canSave) return;
    setSubmitting(true);
    setError(null);

    try {
      const { clientSecret } = await cardsApi.createSetupIntent();
      const { setupIntent, error: confirmError } = await confirmSetupIntent(clientSecret, {
        paymentMethodType: 'Card',
        paymentMethodData: { billingDetails: { name: nameOnCard.trim() } },
      });

      if (confirmError || !setupIntent?.paymentMethodId) {
        throw new Error(confirmError?.message || 'Could not confirm card details with Stripe.');
      }

      onSave({
        paymentMethodId: setupIntent.paymentMethodId,
        cardHolderName: nameOnCard.trim(),
        setAsDefault,
      });
      resetForm();
    } catch (err) {
      setError(ApiError.messageOf(err, 'Could not save this card.'));
    } finally {
      setSubmitting(false);
    }
  };

  const previewNumber = last4 ? `•••• •••• •••• ${last4}` : '•••• •••• •••• ••••';
  const previewExpiry =
    expiryMonth && expiryYear
      ? `${String(expiryMonth).padStart(2, '0')}/${String(expiryYear).slice(-2)}`
      : 'MM/YY';

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen" onRequestClose={handleCancel}>
      <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
        <ScreenStatusBar backgroundColor={colors.white} barStyle="dark-content" />
        <SubScreenHeader title="Add Payment Card" onBack={handleCancel} />

        <View style={styles.body}>
          <KeyboardAvoidingView
            style={styles.flex}
            behavior="padding"
          >
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
                  <Text style={styles.previewBrand}>{capitalizeBrand(brand)}</Text>
                </View>
                <Text style={styles.previewNumber}>{previewNumber}</Text>
                <View style={styles.previewBottom}>
                  <View>
                    <Text style={styles.previewLabel}>Cardholder Name</Text>
                    <Text style={styles.previewValue}>
                      {nameOnCard.trim() ? nameOnCard.trim().toUpperCase() : 'FULL NAME'}
                    </Text>
                  </View>
                  <View style={styles.previewExpiryCol}>
                    <Text style={styles.previewLabel}>Expires</Text>
                    <Text style={styles.previewValue}>{previewExpiry}</Text>
                  </View>
                </View>
              </LinearGradient>

              <Text style={styles.label}>Cardholder Name *</Text>
              <TextInput
                style={styles.input}
                value={nameOnCard}
                onChangeText={text => setNameOnCard(text.toUpperCase())}
                placeholder="JOHN DOE"
                placeholderTextColor={colors.textMuted}
                autoCapitalize="characters"
              />

              <Text style={styles.label}>Card details *</Text>
              <CardField
                key={fieldKey}
                postalCodeEnabled={false}
                placeholders={{ number: '1234 5678 9012 3456' }}
                cardStyle={{
                  backgroundColor: colors.white,
                  borderColor: colors.border,
                  borderWidth: 1,
                  borderRadius: 12,
                  textColor: colors.text,
                  placeholderColor: colors.textMuted,
                  fontSize: 16,
                }}
                style={styles.cardField}
                onCardChange={handleCardChange}
              />
              <Text style={styles.helper}>
                Number, expiry and CVV stay with Stripe. They never reach DoHuub.
              </Text>

              <TouchableOpacity
                style={styles.checkboxRow}
                onPress={() => setSetAsDefault(prev => !prev)}
                activeOpacity={0.7}
              >
                <View style={[styles.checkbox, setAsDefault && styles.checkboxChecked]}>
                  {setAsDefault ? <Icon name="checkmark" size={14} color={colors.white} /> : null}
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
                style={[styles.addButtonWrap, !canSave && styles.addButtonDisabled]}
                onPress={handleSave}
                disabled={!canSave}
                activeOpacity={0.85}
              >
                <LinearGradient
                  colors={[colors.gradientStart, colors.gradientEnd]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.addButton}
                >
                  <Text style={styles.addButtonLabel}>{submitting ? 'Saving…' : 'Add Card'}</Text>
                </LinearGradient>
              </TouchableOpacity>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </SafeAreaView>
    </Modal>
  );
}