import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { CommonActions } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../navigation/types';
import { colors } from '../../../styles';
import ScreenStatusBar from '../../../components/layout/ScreenStatusBar';
import PrimaryButton from '../../../components/ui/PrimaryButton';
import { referralsApi } from '../../../services/engagementApi';
import { ApiError } from '../../../services/ApiError';
import ErrorBanner from '../../../components/ui/ErrorBanner';
import { styles } from './styles';

type Props = NativeStackScreenProps<RootStackParamList, 'SignupReferral'>;

export default function SignupReferralScreen({ navigation }: Props) {
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const goNext = () => {
    navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: 'SignupAddresses' }] }));
  };

  const handleContinue = async () => {
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) {
      goNext();
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await referralsApi.attach(trimmed);
      goNext();
    } catch (err) {
      if (err instanceof ApiError && err.code === 'REFERRAL_ALREADY_ATTACHED') {
        goNext();
        return;
      }
      setError(ApiError.messageOf(err, 'That referral code is not valid.'));
    } finally {
      setBusy(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScreenStatusBar backgroundColor={colors.background} barStyle="dark-content" />
      <KeyboardAvoidingView style={styles.flex} behavior="padding">
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          automaticallyAdjustKeyboardInsets
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.kicker}>Almost Done!</Text>
          <View style={styles.giftCircle}>
            <Icon name="gift-outline" size={48} color="#F59E0B" />
          </View>
          <Text style={styles.title}>Have a Referral Code?</Text>
          <Text style={styles.subtitle}>
            Enter your referral code to earn bonus rewards when you complete your first booking
          </Text>

          <TextInput
            style={[styles.codeInput, error ? styles.codeInputError : null]}
            value={code}
            onChangeText={text => {
              setCode(text.toUpperCase());
              setError(null);
            }}
            placeholder="Enter referral code"
            placeholderTextColor={colors.textMuted}
            autoCapitalize="characters"
            autoCorrect={false}
          />
          {error ? <ErrorBanner message={error} /> : null}

          <View style={styles.bonusBox}>
            <Text style={styles.bonusText}>
              🎉 You earn <Text style={styles.bonusStrong}>250 bonus points</Text> and your friend earns{' '}
              <Text style={styles.bonusStrong}>500</Text> when you complete your first booking!
            </Text>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <PrimaryButton
            label={busy ? 'Applying…' : code.trim() ? 'Apply & Continue' : 'Continue'}
            onPress={handleContinue}
            loading={busy}
            disabled={busy}
          />
          <TouchableOpacity onPress={goNext} disabled={busy} hitSlop={8}>
            <Text style={styles.skip}>Skip for now</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
