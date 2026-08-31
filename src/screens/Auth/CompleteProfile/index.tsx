import React, { useState } from 'react';
import { KeyboardAvoidingView, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { CommonActions } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../navigation/types';
import { colors } from '../../../styles';
import ScreenStatusBar from '../../../components/layout/ScreenStatusBar';
import PrimaryButton from '../../../components/ui/PrimaryButton';
import PhoneField from '../../../components/ui/PhoneField';
import { useAuthStore } from '../../../store/authStore';
import { ApiError } from '../../../services/ApiError';
import ErrorBanner from '../../../components/ui/ErrorBanner';
import { styles } from './styles';

type Props = NativeStackScreenProps<RootStackParamList, 'CompleteProfile'>;

export default function CompleteProfileScreen({ navigation }: Props) {
  const user = useAuthStore(state => state.user);
  const updateProfile = useAuthStore(state => state.updateProfile);
  const [fullName, setFullName] = useState(user?.fullName ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [phoneValid, setPhoneValid] = useState(Boolean(user?.phone));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSave = fullName.trim().length > 0 && phoneValid && !saving;

  const goNext = () => {
    navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: 'SignupReferral' }] }));
  };

  const handleSave = async () => {
    if (!canSave) return;
    setSaving(true);
    setError(null);
    try {
      await updateProfile({ fullName: fullName.trim(), phone: phone.trim() });
      goNext();
    } catch (err) {
      setError(ApiError.messageOf(err, 'Could not save your details.'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScreenStatusBar backgroundColor={colors.background} barStyle="dark-content" />

      <KeyboardAvoidingView style={styles.flex} behavior="padding">
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled" automaticallyAdjustKeyboardInsets>
          <View style={styles.iconCircle}>
            <Icon name="person-add-outline" size={40} color={colors.primary} />
          </View>

          <Text style={styles.title}>Complete Your Profile</Text>
          <Text style={styles.subtitle}>
            Just a couple more details so we can keep you updated on your bookings.
          </Text>

          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            value={fullName}
            onChangeText={setFullName}
            placeholder="Your full name"
            placeholderTextColor={colors.textMuted}
          />

          <PhoneField
            value={phone}
            onChange={(next, valid) => {
              setPhone(next);
              setPhoneValid(valid);
            }}
          />

          {error ? <ErrorBanner message={error} /> : null}

          <PrimaryButton
            label={saving ? 'Saving…' : 'Continue'}
            onPress={handleSave}
            disabled={!canSave}
            loading={saving}
            style={styles.saveButton}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
