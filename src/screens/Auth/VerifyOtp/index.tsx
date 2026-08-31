import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CommonActions } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../navigation/types';
import { colors } from '../../../styles';
import ScreenStatusBar from '../../../components/layout/ScreenStatusBar';
import PrimaryButton from '../../../components/ui/PrimaryButton';
import { useAuthStore } from '../../../store/authStore';
import { ApiError } from '../../../services/ApiError';
import ErrorBanner from '../../../components/ui/ErrorBanner';
import OtpInput, { CODE_LENGTH } from './components/OtpInput';
import { styles } from './styles';

// Matches the PWA's RESEND_COOLDOWN_SECONDS (constants/vendor.js).
const RESEND_COOLDOWN_SECONDS = 60;

type Props = NativeStackScreenProps<RootStackParamList, 'VerifyOtp'>;

export default function VerifyOtpScreen({ navigation, route }: Props) {
  const { email } = route.params;
  const verifyEmailOtp = useAuthStore(state => state.verifyEmailOtp);
  const requestEmailOtp = useAuthStore(state => state.requestEmailOtp);
  const [code, setCode] = useState<string[]>(Array(CODE_LENGTH).fill(''));
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN_SECONDS);

  useEffect(() => {
    if (cooldown <= 0) return undefined;
    const timer = setTimeout(() => setCooldown(n => n - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const isComplete = code.every(digit => digit.length === 1);

  const handleVerify = async () => {
    if (!isComplete) return;
    setSubmitting(true);
    setError(null);
    try {
      const { signedIn } = await verifyEmailOtp(code.join(''), email);
      if (signedIn) {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'EnableLocation' }],
          }),
        );
      } else {
        navigation.dispatch(
          CommonActions.reset({ index: 0, routes: [{ name: 'Login' }] }),
        );
      }
    } catch (err) {
      setError(ApiError.messageOf(err, 'That code was not accepted.'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0 || resending) return;
    setResending(true);
    setError(null);
    try {
      await requestEmailOtp(email);
      setCode(Array(CODE_LENGTH).fill(''));
      setCooldown(RESEND_COOLDOWN_SECONDS);
    } catch (err) {
      setError(ApiError.messageOf(err, 'Could not resend the code.'));
    } finally {
      setResending(false);
    }
  };

  const mmss = `${String(Math.floor(cooldown / 60)).padStart(2, '0')}:${String(cooldown % 60).padStart(2, '0')}`;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScreenStatusBar backgroundColor={colors.background} barStyle="dark-content" />

      {navigation.canGoBack() ? (
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} hitSlop={8}>
          <Icon name="arrow-back" size={24} color={colors.textMuted} />
        </TouchableOpacity>
      ) : null}

      <KeyboardAvoidingView style={styles.content} behavior="padding">
        <View style={styles.iconCircle}>
          <Icon name="shield-checkmark-outline" size={40} color={colors.primary} />
        </View>

        <Text style={styles.title}>Verify Your Email</Text>
        <Text style={styles.subtitle}>
          Enter the 6-digit code sent to <Text style={styles.email}>{email}</Text>
        </Text>

        <View style={styles.otpWrap}>
          <OtpInput value={code} onChange={setCode} />
        </View>

        {error ? <ErrorBanner message={error} /> : null}

        <View style={styles.resendRow}>
          {cooldown > 0 ? (
            <Text style={styles.resendWait}>Resend code in {mmss}</Text>
          ) : (
            <TouchableOpacity onPress={handleResend} disabled={resending} hitSlop={8}>
              <Text style={styles.resendText}>{resending ? 'Resending…' : 'Resend OTP'}</Text>
            </TouchableOpacity>
          )}
        </View>

        <PrimaryButton
          label={submitting ? 'Verifying…' : 'Verify'}
          onPress={handleVerify}
          disabled={!isComplete || submitting}
          loading={submitting}
          style={[styles.cta, styles.verifyButton]}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
