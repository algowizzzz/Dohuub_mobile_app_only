import React, { useState } from 'react';
import { KeyboardAvoidingView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CommonActions } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../navigation/types';
import { colors } from '../../../styles';
import ScreenStatusBar from '../../../components/layout/ScreenStatusBar';
import TextField from '../../../components/ui/TextField';
import PasswordField from '../../../components/ui/PasswordField';
import PrimaryButton from '../../../components/ui/PrimaryButton';
import { useAuthStore } from '../../../store/authStore';
import { ApiError } from '../../../services/ApiError';
import ErrorBanner from '../../../components/ui/ErrorBanner';
import AuthFooterLinks from './components/AuthFooterLinks';
import { styles } from './styles';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const signIn = useAuthStore(state => state.signIn);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = email.trim().length > 0 && password.length > 0 && !submitting;

  const goToMain = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Main', params: { screen: 'Home' } }],
      }),
    );
  };

  const handleSignIn = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    setError(null);
    try {
      await signIn({ email: email.trim(), password });
      goToMain();
    } catch (err) {
      setError(ApiError.messageOf(err, 'Could not sign in. Please try again.'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScreenStatusBar backgroundColor={colors.background} barStyle="dark-content" />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior="padding"
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          automaticallyAdjustKeyboardInsets
        >
          {navigation.canGoBack() ? (
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
              hitSlop={8}
            >
              <Icon name="arrow-back" size={20} color={colors.textMuted} />
              <Text style={styles.backLabel}>Back</Text>
            </TouchableOpacity>
          ) : null}

          <Text style={styles.title}>Sign In</Text>
          <Text style={styles.subtitle}>Enter your credentials to continue</Text>

          <View style={styles.form}>
            <TextField
              label="Email Address"
              value={email}
              onChangeText={setEmail}
              placeholder="your.email@example.com"
              keyboardType="email-address"
              textContentType="emailAddress"
              iconLeft={<Icon name="mail-outline" size={20} color={colors.textMuted} />}
            />
            <PasswordField
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              textContentType="password"
              iconLeft={<Icon name="lock-closed-outline" size={20} color={colors.textMuted} />}
            />

            <TouchableOpacity
              onPress={() => navigation.navigate('ForgotPassword')}
              hitSlop={8}
              style={styles.forgotWrap}
            >
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>

            {error ? <ErrorBanner message={error} /> : null}

            <PrimaryButton
              label={submitting ? 'Signing in…' : 'Sign In'}
              onPress={handleSignIn}
              disabled={!canSubmit}
              loading={submitting}
              style={styles.signInButton}
            />
          </View>
        </ScrollView>

        <AuthFooterLinks onCreateAccount={() => navigation.navigate('Signup')} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
