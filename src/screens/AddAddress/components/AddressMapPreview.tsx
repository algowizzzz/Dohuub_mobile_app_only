import React, { useState } from 'react';
import { Image, Linking, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../../styles';
import { staticMapUrl } from '../../../services/placesApi';
import { styles } from './AddressMapPreview.styles';

type Props = {
  latitude: number;
  longitude: number;
  label?: string;
};

export default function AddressMapPreview({ latitude, longitude, label }: Props) {
  const [imageFailed, setImageFailed] = useState(false);
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;

  const openMaps = () => {
    Linking.openURL(mapsUrl).catch(() => {});
  };

  return (
    <TouchableOpacity style={styles.wrap} onPress={openMaps} activeOpacity={0.9}>
      {imageFailed ? (
        <View style={styles.fallback}>
          <Icon name="map-outline" size={28} color={colors.primary} />
          <Text style={styles.fallbackTitle}>Location pinned</Text>
          <Text style={styles.fallbackMeta}>
            {latitude.toFixed(5)}, {longitude.toFixed(5)}
          </Text>
        </View>
      ) : (
        <Image
          source={{ uri: staticMapUrl(latitude, longitude) }}
          style={styles.map}
          resizeMode="cover"
          onError={() => setImageFailed(true)}
        />
      )}
      <View style={styles.caption}>
        <Icon name="navigate-outline" size={14} color={colors.primary} />
        <Text style={styles.captionText} numberOfLines={1}>
          {label || 'Pinned on the map'}
        </Text>
        <Text style={styles.openLabel}>Open</Text>
      </View>
    </TouchableOpacity>
  );
}
