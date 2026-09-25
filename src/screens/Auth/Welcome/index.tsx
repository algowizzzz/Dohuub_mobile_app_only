import React, { useState } from 'react';
import { ActivityIndicator, Image, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { CommonActions } from '@react-navigation/native';
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

type Props = NativeStackScreenProps<RootStackParamList, 'Welcome'>;

export default function WelcomeScreen({ navigation }: Props) {
  const signInWithGoogle = useAuthStore(state => state.signInWithGoogle);
  const signInWithApple = useAuthStore(state => state.signInWithApple);
  const continueAsGuest = useAuthStore(state => state.continueAsGuest);
  const [googleBusy, setGoogleBusy] = useState(false);
  const [appleBusy, setAppleBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reached from the "Sign in required" prompt: the app is still underneath.
  const openedFromApp = Boolean(
    navigation.getState()?.routes.some(route => route.name === 'Main'),
  );

  const handleAppleSignIn = async () => {
    if (appleBusy || googleBusy) return;
    setAppleBusy(true);
    setError(null);
    try {
      const customer = await signInWithApple();
      navigateAfterAuth(navigation, customer);
    } catch (err) {
      if (err instanceof ApiError && err.isCancelled) return;
      setError(ApiError.messageOf(err, 'Could not sign in with Apple.'));
    } finally {
      setAppleBusy(false);
    }
  };

  const handleContinueAsGuest = () => {
    if (openedFromApp) {
      navigation.goBack();
      return;
    }
    continueAsGuest();
    navigation.dispatch(
      CommonActions.reset({ index: 0, routes: [{ name: 'Main', params: { screen: 'Home' } }] }),
    );
  };

  const handleGoogleSignIn = async () => {
    if (googleBusy) return;
    setGoogleBusy(true);
    setError(null);
    try {
      const customer = await signInWithGoogle();
      navigateAfterAuth(navigation, customer);
    } catch (err) {
      if (err instanceof ApiError && err.isCancelled) return;
      setError(ApiError.messageOf(err, 'Could not sign in with Google.'));
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
        {/* <Text style={styles.wordmark}>DoHuub</Text>
        <Text style={styles.tagline}>INFINITE SERVICE</Text> */}

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.emailButton}
            onPress={() => navigation.navigate('Login')}
            activeOpacity={0.85}
          >
            <Icon name="mail-outline" size={18} color={colors.white} />
            <Text style={styles.emailLabel}>Sign In with Email</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.googleButton, googleBusy && styles.googleButtonDisabled]}
            onPress={handleGoogleSignIn}
            disabled={googleBusy}
            activeOpacity={0.85}
          >
            {googleBusy ? (
              <ActivityIndicator size="small" color={colors.text} />
            ) : (
              <GoogleIcon size={18} />
            )}
            <Text style={styles.googleLabel}>
              {googleBusy ? 'Signing in…' : 'Sign In with Google'}
            </Text>
          </TouchableOpacity>

          <AppleSignInButton onPress={handleAppleSignIn} busy={appleBusy} variant="white" />

          {error ? <ErrorBanner message={error} onDark /> : null}

          <TouchableOpacity
            style={styles.guestButton}
            onPress={handleContinueAsGuest}
            hitSlop={8}
            accessibilityRole="button"
          >
            <Text style={styles.guestLabel}>
              {openedFromApp ? 'Keep browsing as guest' : 'Continue as Guest'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Don't have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Signup')} hitSlop={8}>
          <Text style={styles.footerLink}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
