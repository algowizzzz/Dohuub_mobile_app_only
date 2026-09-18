import React, { useEffect } from 'react';
import { Image, StatusBar, View, useWindowDimensions } from 'react-native';
import { CommonActions } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';
import { splash } from '../../assets/images';
import { useAuthStore } from '../../store/authStore';
import { store } from '../../store/redux/store';
import { styles } from './styles';

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

const MIN_SPLASH_MS = 1500;

function waitForReduxHydration(): Promise<void> {
  if (store.getState().session.hasHydrated) return Promise.resolve();
  return new Promise(resolve => {
    const unsubscribe = store.subscribe(() => {
      if (store.getState().session.hasHydrated) {
        unsubscribe();
        resolve();
      }
    });
  });
}

export default function SplashScreen({ navigation }: Props) {
  const { width, height } = useWindowDimensions();

  useEffect(() => {
    let cancelled = false;

    const boot = async () => {
      const minDelay = new Promise<void>(resolve => setTimeout(() => resolve(), MIN_SPLASH_MS));
      await Promise.all([waitForReduxHydration(), minDelay]);
      if (cancelled) return;

      // Session first — signed-in users never re-run onboarding / set-profile
      // just because local carousel flag was missing.
      const isAuthenticated = await useAuthStore.getState().restore();
      if (cancelled) return;

      if (isAuthenticated) {
        const user = useAuthStore.getState().user;
        const done = Boolean(user?.hasCompletedOnboarding || user?.profileComplete);
        useAuthStore.getState().setHasOnboarded(true);
        if (done) {
          useAuthStore.getState().completeOnboarding().catch(() => {});
        }
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [
              done
                ? { name: 'Main', params: { screen: 'Home' } }
                : { name: 'CompleteProfile' },
            ],
          }),
        );
        return;
      }

      const hasOnboarded = useAuthStore.getState().hasOnboarded;
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: hasOnboarded ? 'Welcome' : 'Onboarding' }],
        }),
      );
    };

    boot();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <Image source={splash} style={{ width, height }} resizeMode="cover" />
    </View>
  );
}
