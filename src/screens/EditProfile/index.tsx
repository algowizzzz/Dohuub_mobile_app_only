import React, { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  launchCamera,
  launchImageLibrary,
  type Asset,
  type ImagePickerResponse,
} from 'react-native-image-picker';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';
import { colors } from '../../styles';
import MainScreenLayout from '../../components/layout/MainScreenLayout';
import SubScreenHeader from '../../components/layout/SubScreenHeader';
import PrimaryButton from '../../components/ui/PrimaryButton';
import PhotoSourceSheet from '../../components/ui/PhotoSourceSheet';
import PhoneField from '../../components/ui/PhoneField';
import { useAuthStore } from '../../store/authStore';
import { ApiError } from '../../services/ApiError';
import ErrorBanner from '../../components/ui/ErrorBanner';
import { styles } from './styles';

type Props = NativeStackScreenProps<RootStackParamList, 'EditProfile'>;

function pickAsset(response: ImagePickerResponse): Asset | null {
  if (response.didCancel || response.errorCode) return null;
  return response.assets?.[0] ?? null;
}

export default function EditProfileScreen({ navigation }: Props) {
  const user = useAuthStore(state => state.user);
  const updateProfile = useAuthStore(state => state.updateProfile);
  const uploadAvatar = useAuthStore(state => state.uploadAvatar);
  const [fullName, setFullName] = useState(user?.fullName ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [phoneValid, setPhoneValid] = useState(Boolean(user?.phone));
  const [avatarPreview, setAvatarPreview] = useState(user?.avatarUrl ?? null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const [photoSheetVisible, setPhotoSheetVisible] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSave = fullName.trim().length > 0 && phoneValid && !saving;

  const handleAsset = async (asset: Asset | null) => {
    if (!asset?.uri) return;
    setAvatarError(null);
    setAvatarPreview(asset.uri);
    setUploadingAvatar(true);
    try {
      const url = await uploadAvatar({
        uri: asset.uri,
        name: asset.fileName || 'avatar.jpg',
        type: asset.type || 'image/jpeg',
      });
      if (url) setAvatarPreview(url);
    } catch (err) {
      setAvatarError(ApiError.messageOf(err, 'Could not upload your photo.'));
      setAvatarPreview(user?.avatarUrl ?? null);
    } finally {
      setUploadingAvatar(false);
    }
  };

  const openLibrary = () => {
    setPhotoSheetVisible(false);
    launchImageLibrary({ mediaType: 'photo', quality: 0.8, selectionLimit: 1 }, response => {
      handleAsset(pickAsset(response));
    });
  };

  const openCamera = () => {
    setPhotoSheetVisible(false);
    launchCamera({ mediaType: 'photo', quality: 0.8, saveToPhotos: false }, response => {
      handleAsset(pickAsset(response));
    });
  };

  const handlePickImage = () => {
    if (uploadingAvatar) return;
    setPhotoSheetVisible(true);
  };

  const handleSave = async () => {
    if (!canSave) return;
    setSaving(true);
    setError(null);
    try {
      await updateProfile({
        fullName: fullName.trim(),
        phone: phone.trim() || undefined,
      });
      navigation.goBack();
    } catch (err) {
      setError(ApiError.messageOf(err, 'Could not save your changes.'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <MainScreenLayout edges={['top', 'bottom']}>
      <SubScreenHeader title="Edit Profile" onBack={() => navigation.goBack()} />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior="padding"
      >
        <View style={styles.body}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            automaticallyAdjustKeyboardInsets
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.avatarWrap}>
              {avatarPreview ? (
                <Image source={{ uri: avatarPreview }} style={styles.avatarImage} />
              ) : (
                <View style={[styles.avatar, styles.avatarPlaceholder]}>
                  <Icon name="person" size={48} color={colors.primary} />
                </View>
              )}
              {uploadingAvatar ? (
                <View style={styles.avatarUploading}>
                  <ActivityIndicator color={colors.white} />
                </View>
              ) : null}
              <TouchableOpacity
                style={styles.cameraButton}
                activeOpacity={0.85}
                onPress={handlePickImage}
                disabled={uploadingAvatar}
              >
                <LinearGradient
                  colors={[colors.gradientStart, colors.gradientEnd]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.cameraButtonFill}
                >
                  <Icon name="camera" size={16} color={colors.white} />
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {avatarError ? <ErrorBanner message={avatarError} /> : null}

            <View style={styles.field}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={styles.input}
                value={fullName}
                onChangeText={setFullName}
                placeholder="Your full name"
                placeholderTextColor={colors.textMuted}
              />
            </View>

            <View style={styles.field}>
              <PhoneField
                value={phone}
                onChange={(next, valid) => {
                  setPhone(next);
                  setPhoneValid(valid);
                }}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Email</Text>
              <View style={styles.disabledInput}>
                <Text style={styles.disabledInputText}>{user?.email}</Text>
              </View>
              <Text style={styles.hint}>Email cannot be changed</Text>
            </View>

            {error ? <ErrorBanner message={error} /> : null}
          </ScrollView>
        </View>

        <View style={styles.footer}>
          <PrimaryButton
            label={saving ? 'Saving…' : 'Save Changes'}
            onPress={handleSave}
            disabled={!canSave}
            loading={saving}
          />
        </View>
      </KeyboardAvoidingView>

      <PhotoSourceSheet
        visible={photoSheetVisible}
        subtitle="Take a new photo or choose one from your library"
        onTakePhoto={openCamera}
        onChooseFromLibrary={openLibrary}
        onCancel={() => setPhotoSheetVisible(false)}
      />
    </MainScreenLayout>
  );
}
