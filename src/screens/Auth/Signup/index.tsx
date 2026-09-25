import React, { useState } from 'react';
import { ActivityIndicator, Image, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../navigation/types';
import { colors } from '../../../styles';
import ScreenStatusBar from '../../../components/layout/ScreenStatusBar';
import GoogleIcon from '../../../components/ui/GoogleIcon';
import AppleSignInButton from '../../../components/ui/AppleSignInButton';
import { authLogo } from '../../../assets/images';
import { useAuthStore } from '../../../store/authStore';
import { ApiError } from '../../../services/ApiError';
import ErrorBanner from '../../../components/ui/ErrorBanner';
import { navigateAfterAuth } from '../../../navigation/postAuthRoute';
import { styles } from './styles';

type Props = NativeStackScreenProps<RootStackParamList, 'Signup'>;

export default function SignupScreen({ navigation }: Props) {
  const signInWithGoogle = useAuthStore(state => state.signInWithGoogle);
  const signInWithApple = useAuthStore(state => state.signInWithApple);
  const [googleBusy, setGoogleBusy] = useState(false);
  const [appleBusy, setAppleBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAppleSignUp = async () => {
    if (appleBusy || googleBusy) return;
    setAppleBusy(true);
    setError(null);
    try {
      const customer = await signInWithApple();
      navigateAfterAuth(navigation, customer);
    } catch (err) {
      if (err instanceof ApiError && err.isCancelled) return;
      setError(ApiError.messageOf(err, 'Could not sign up with Apple.'));
    } finally {
      setAppleBusy(false);
    }
  };

  const handleGoogleSignUp = async () => {
    if (googleBusy) return;
    setGoogleBusy(true);
    setError(null);
    try {
      const customer = await signInWithGoogle();
      navigateAfterAuth(navigation, customer);
    } catch (err) {
      if (err instanceof ApiError && err.isCancelled) return;
      setError(ApiError.messageOf(err, 'Could not sign up with Google.'));
    } finally {
      setGoogleBusy(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScreenStatusBar backgroundColor={colors.primary} barStyle="light-content" />

      {navigation.canGoBack() ? (
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} hitSlop={8}>
          <Icon name="arrow-back" size={20} color={colors.white} />
          <Text style={styles.backLabel}>Back</Text>
        </TouchableOpacity>
      ) : null}

      <View style={styles.body}>
        <Image source={authLogo} style={styles.logo} resizeMode="contain" />
        <Text style={styles.tagline}>Create Your Account</Text>

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.emailButton}
            onPress={() => navigation.navigate('SignupEmail')}
            activeOpacity={0.85}
          >
            <Icon name="mail-outline" size={18} color={colors.white} />
            <Text style={styles.emailLabel}>Sign Up with Email</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.googleButton, googleBusy && styles.googleButtonDisabled]}
            onPress={handleGoogleSignUp}
            disabled={googleBusy}
            activeOpacity={0.85}
          >
            {googleBusy ? (
              <ActivityIndicator size="small" color={colors.text} />
            ) : (
              <GoogleIcon size={18} />
            )}
            <Text style={styles.googleLabel}>
              {googleBusy ? 'Signing up…' : 'Sign Up with Google'}
            </Text>
          </TouchableOpacity>

          <AppleSignInButton onPress={handleAppleSignUp} busy={appleBusy} variant="white" type="sign-up" />

          {error ? <ErrorBanner message={error} onDark /> : null}
        </View>

        <View style={styles.switchRow}>
          <Text style={styles.switchText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Welcome')} hitSlop={8}>
            <Text style={styles.switchLink}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>By continuing, you agree to our</Text>
        <View style={styles.footerLinkRow}>
          <TouchableOpacity onPress={() => navigation.navigate('TermsOfService')} hitSlop={8}>
            <Text style={styles.footerLink}>Terms of Service</Text>
          </TouchableOpacity>
          <Text style={styles.footerText}> and </Text>
          <TouchableOpacity onPress={() => navigation.navigate('PrivacyPolicy')} hitSlop={8}>
            <Text style={styles.footerLink}>Privacy Policy</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
