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
import { logo } from '../../../assets/images';
import { useAuthStore } from '../../../store/authStore';
import { ApiError } from '../../../services/ApiError';
import ErrorBanner from '../../../components/ui/ErrorBanner';
import { styles } from './styles';

type Props = NativeStackScreenProps<RootStackParamList, 'Welcome'>;

export default function WelcomeScreen({ navigation }: Props) {
  const signInWithGoogle = useAuthStore(state => state.signInWithGoogle);
  const [googleBusy, setGoogleBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const goToMain = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Main', params: { screen: 'Home' } }],
      }),
    );
  };

  const handleGoogleSignIn = async () => {
    if (googleBusy) return;
    setGoogleBusy(true);
    setError(null);
    try {
      const customer = await signInWithGoogle();
      if (!customer.profileComplete) {
        navigation.dispatch(
          CommonActions.reset({ index: 0, routes: [{ name: 'EnableLocation' }] }),
        );
        return;
      }
      goToMain();
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
        <Image source={logo} style={styles.logo} resizeMode="contain" />
        {/* <Text style={styles.wordmark}>DoHuub</Text>
        <Text style={styles.tagline}>INFINITE SERVICE</Text> */}

        <View style={styles.actions}>
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

          <TouchableOpacity
            style={styles.emailButton}
            onPress={() => navigation.navigate('Login')}
            activeOpacity={0.85}
          >
            <Icon name="mail-outline" size={18} color={colors.white} />
            <Text style={styles.emailLabel}>Sign In with Email</Text>
          </TouchableOpacity>

          {error ? <ErrorBanner message={error} onDark /> : null}
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
