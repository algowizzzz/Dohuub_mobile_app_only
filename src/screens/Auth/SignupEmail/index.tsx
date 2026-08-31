import React, { useState } from 'react';
import { KeyboardAvoidingView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CommonActions } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../navigation/types';
import { colors } from '../../../styles';
import ScreenStatusBar from '../../../components/layout/ScreenStatusBar';
import SubScreenHeader from '../../../components/layout/SubScreenHeader';
import TextField from '../../../components/ui/TextField';
import PhoneField from '../../../components/ui/PhoneField';
import PasswordField from '../../../components/ui/PasswordField';
import PrimaryButton from '../../../components/ui/PrimaryButton';
import GoogleSignInButton from '../../../components/ui/GoogleSignInButton';
import { useAuthStore } from '../../../store/authStore';
import { ApiError } from '../../../services/ApiError';
import ErrorBanner from '../../../components/ui/ErrorBanner';
import SignupFooterLinks from './components/SignupFooterLinks';
import { styles } from './styles';

type Props = NativeStackScreenProps<RootStackParamList, 'SignupEmail'>;

export default function SignupEmailScreen({ navigation }: Props) {
  const signUp = useAuthStore(state => state.signUp);
  const signInWithGoogle = useAuthStore(state => state.signInWithGoogle);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [phoneValid, setPhoneValid] = useState(true);
  const [referralCode, setReferralCode] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [googleBusy, setGoogleBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit =
    fullName.trim().length > 0 && email.trim().length > 0 && password.length > 0 && phoneValid && !submitting;

  const handleSendOtp = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    setError(null);
    try {
      await signUp({
        fullName: fullName.trim(),
        email: email.trim(),
        password,
        phone: phone.trim() || undefined,
        referralCode: referralCode.trim() || undefined,
      });
      navigation.navigate('VerifyOtp', { email: email.trim() });
    } catch (err) {
      setError(ApiError.messageOf(err, 'Could not create your account.'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSignUp = async () => {
    if (googleBusy) return;
    setGoogleBusy(true);
    setError(null);
    try {
      const customer = await signInWithGoogle(referralCode.trim() || undefined);
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [
            customer.profileComplete
              ? { name: 'Main', params: { screen: 'Home' } }
              : { name: 'EnableLocation' },
          ],
        }),
      );
    } catch (err) {
      if (err instanceof ApiError && err.isCancelled) return;
      setError(ApiError.messageOf(err, 'Could not sign up with Google.'));
    } finally {
      setGoogleBusy(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScreenStatusBar backgroundColor={colors.surface} barStyle="dark-content" />
      <SubScreenHeader title="Sign Up" onBack={() => navigation.goBack()} />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior="padding"
        keyboardVerticalOffset={0}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          automaticallyAdjustKeyboardInsets
        >
          <View style={styles.iconCircle}>
            <Icon name="mail-outline" size={40} color={colors.primary} />
          </View>

          <Text style={styles.title}>Enter Your Details</Text>
          <Text style={styles.subtitle}>We'll send you a verification code</Text>

          <View style={styles.form}>
            <TextField
              label="Full name"
              value={fullName}
              onChangeText={setFullName}
              placeholder="Alex Morgan"
              autoCapitalize="words"
              textContentType="name"
            />
            <TextField
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="your.email@example.com"
              keyboardType="email-address"
              textContentType="emailAddress"
            />
            <PasswordField
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              textContentType="newPassword"
            />
            <Text style={styles.passwordHint}>
              At least 8 characters, with uppercase, lowercase and a number.
            </Text>
            <PhoneField
              label="Phone number (optional)"
              value={phone}
              required={false}
              onChange={(next, valid) => {
                setPhone(next);
                setPhoneValid(valid);
              }}
            />
            <TextField
              label="Referral code (optional)"
              value={referralCode}
              onChangeText={setReferralCode}
              placeholder="e.g. ALEX-7F3K"
              autoCapitalize="characters"
            />

            {error ? <ErrorBanner message={error} /> : null}

            <PrimaryButton
              label={submitting ? 'Creating account…' : 'Send OTP'}
              onPress={handleSendOtp}
              disabled={!canSubmit}
              loading={submitting}
              style={styles.submitButton}
            />

            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            <GoogleSignInButton onPress={handleGoogleSignUp} busy={googleBusy} label="Continue with Google" />
          </View>
        </ScrollView>

        <SignupFooterLinks onSignIn={() => navigation.navigate('Welcome')} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
