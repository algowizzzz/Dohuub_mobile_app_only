import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { CommonActions } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../navigation/types';
import { colors } from '../../../styles';
import ScreenStatusBar from '../../../components/layout/ScreenStatusBar';
import { useServiceLocationStore } from '../../../store/serviceLocationStore';
import { useCurrentLocation } from '../../../hooks/useCurrentLocation';
import { countryIsoFromCoords } from '../../../utils/geocode';
import { styles } from './styles';

type Props = NativeStackScreenProps<RootStackParamList, 'EnableLocation'>;

export default function EnableLocationScreen({ navigation }: Props) {
  const { getCurrentLocation, loading } = useCurrentLocation();
  const setLastCoords = useServiceLocationStore(state => state.setLastCoords);
  const setCountryIso = useServiceLocationStore(state => state.setCountryIso);
  const [requesting, setRequesting] = useState(false);

  const goNext = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'CompleteProfile' }],
      }),
    );
  };

  const handleAllow = async () => {
    if (requesting) return;
    setRequesting(true);
    const coords = await getCurrentLocation();
    if (coords) {
      const lat = Number(coords.lat);
      const lng = Number(coords.lng);
      setLastCoords({ lat, lng });
      const iso = await countryIsoFromCoords(lat, lng);
      if (iso) setCountryIso(iso);
    }
    setRequesting(false);
    goNext();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScreenStatusBar backgroundColor={colors.background} barStyle="dark-content" />

      <View style={styles.body}>
        <View style={styles.iconWrap}>
          <Icon name="location-outline" size={48} color={colors.primary} />
        </View>

        <Text style={styles.title}>Enable Location Services</Text>
        <Text style={styles.subtitle}>
          DoHuub uses your location to show nearby services and providers
        </Text>

        <TouchableOpacity
          style={styles.allowButton}
          onPress={handleAllow}
          disabled={requesting || loading}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={[colors.gradientCtaStart, colors.gradientCtaEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.allowButtonGradient}
          >
            <Text style={styles.allowLabel}>
              {requesting || loading ? 'Requesting…' : 'Allow Location Access'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity onPress={goNext} hitSlop={8} disabled={requesting}>
          <Text style={styles.skipLabel}>Skip</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
