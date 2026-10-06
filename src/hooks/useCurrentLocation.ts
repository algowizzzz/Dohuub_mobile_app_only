import { useState } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import Geolocation from '@react-native-community/geolocation';

type Coordinates = {
  lat: string;
  lng: string;
};

async function requestAndroidPermission(): Promise<boolean> {
  const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  );
  return granted === PermissionsAndroid.RESULTS.GRANTED;
}

export function useCurrentLocation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  /** True once the user has declined location — screens offer a link to Settings. */
  const [denied, setDenied] = useState(false);

  const getCurrentLocation = (): Promise<Coordinates | null> => {
    return new Promise(resolve => {
      setLoading(true);
      setError(null);
      setDenied(false);

      const fetchPosition = (highAccuracy: boolean, fallback: boolean) => {
        Geolocation.getCurrentPosition(
          position => {
            setLoading(false);
            resolve({
              lat: position.coords.latitude.toFixed(6),
              lng: position.coords.longitude.toFixed(6),
            });
          },
          error => {
            if (fallback && highAccuracy) {
              fetchPosition(false, false);
              return;
            }
            setLoading(false);
            if (error.code === 1) setDenied(true);
            const message =
              error.code === 1
                ? 'Location is turned off for DoHuub. You can turn it on in Settings, or enter your address manually.'
                : error.code === 3
                  ? 'Location timed out. Try again outdoors, or turn on GPS.'
                  : 'Could not get your location. Check your device settings.';
            setError(message);
            resolve(null);
          },
          {
            enableHighAccuracy: highAccuracy,
            timeout: highAccuracy ? 12000 : 20000,
            maximumAge: highAccuracy ? 5000 : 60000,
          },
        );
      };

      if (Platform.OS === 'android') {
        requestAndroidPermission().then(granted => {
          if (!granted) {
            setLoading(false);
            setDenied(true);
            setError('Location is turned off for DoHuub. You can turn it on in Settings, or enter your address manually.');
            resolve(null);
            return;
          }
          fetchPosition(true, true);
        });
      } else {
        fetchPosition(true, true);
      }
    });
  };

  return { getCurrentLocation, loading, error, denied };
}
