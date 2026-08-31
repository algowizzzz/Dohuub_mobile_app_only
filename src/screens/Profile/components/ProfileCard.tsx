import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../../styles';
import { styles } from './ProfileCard.styles';

type Props = {
  name: string;
  email: string;
  avatarUrl?: string | null;
  onEditProfile: () => void;
};

// Ported from the PWA's MProfileScreen .profileRow — a flat avatar + text
// row (no gradient hero card): 80px avatar circle, name/email, Edit Profile
// as an inline text link rather than a pill button.
export default function ProfileCard({ name, email, avatarUrl, onEditProfile }: Props) {
  return (
    <View style={styles.row}>
      {avatarUrl ? (
        <Image source={{ uri: avatarUrl }} style={styles.avatar} />
      ) : (
        <View style={styles.avatar}>
          <Icon name="person" size={28} color={colors.primary} />
        </View>
      )}

      <View style={styles.info}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.email} numberOfLines={1}>
          {email}
        </Text>

        <TouchableOpacity style={styles.editLink} onPress={onEditProfile} activeOpacity={0.7}>
          <Text style={styles.editLinkText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
