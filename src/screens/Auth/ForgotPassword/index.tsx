import React, { useState } from 'react';
import { KeyboardAvoidingView, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../navigation/types';
import { colors } from '../../../styles';
import ScreenStatusBar from '../../../components/layout/ScreenStatusBar';
import SubScreenHeader from '../../../components/layout/SubScreenHeader';
import TextField from '../../../components/ui/TextField';
import PrimaryButton from '../../../components/ui/PrimaryButton';
import { useAuthStore } from '../../../store/authStore';
import { ApiError } from '../../../services/ApiError';
import ErrorBanner from '../../../components/ui/ErrorBanner';
import { styles } from './styles';

type Props = NativeStackScreenProps<RootStackParamList, 'ForgotPassword'>;

export default function ForgotPasswordScreen({ navigation }: Props) {
  const forgotPassword = useAuthStore(state => state.forgotPassword);
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const canSubmit = email.trim().length > 0 && !submitting;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    setError(null);
    try {
      await forgotPassword(email.trim());
      setSent(true);
    } catch (err) {
      setError(ApiError.messageOf(err, 'Could not send the reset link.'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScreenStatusBar backgroundColor={colors.background} barStyle="dark-content" />
      <SubScreenHeader title="Forgot password" onBack={() => navigation.goBack()} />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior="padding"
      >
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled" automaticallyAdjustKeyboardInsets>
          {sent ? (
            <View style={styles.successWrap}>
              <View style={styles.successIconWrap}>
                <Icon name="mail-outline" size={28} color={colors.primary} />
              </View>
              <Text style={styles.successTitle}>Check your email</Text>
              <Text style={styles.successBody}>
                If an account exists for {email.trim()}, we've sent a link to reset your password.
              </Text>
              <PrimaryButton
                label="Back to sign in"
                onPress={() => navigation.navigate('Login')}
                style={styles.backButton}
              />
            </View>
          ) : (
            <>
              <Text style={styles.title}>Reset your password</Text>
              <Text style={styles.subtitle}>
                Enter your email and we'll send you a link to reset your password.
              </Text>

              <TextField
                label="Email Address"
                value={email}
                onChangeText={setEmail}
                placeholder="your.email@example.com"
                keyboardType="email-address"
                textContentType="emailAddress"
                iconLeft={<Icon name="mail-outline" size={20} color={colors.textMuted} />}
              />

              {error ? <ErrorBanner message={error} /> : null}

              <PrimaryButton
                label={submitting ? 'Sending…' : 'Send reset link'}
                onPress={handleSubmit}
                disabled={!canSubmit}
                loading={submitting}
                style={styles.submitButton}
              />
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
