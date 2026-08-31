import React, { useRef, useState } from 'react';
import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';
import ScreenStatusBar from '../../components/layout/ScreenStatusBar';
import { useAuthStore } from '../../store/authStore';
import OnboardingSlide from './components/OnboardingSlide';
import NextButton from './components/NextButton';
import { ONBOARDING_SLIDES } from './slides';
import { styles } from './styles';

type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;

const GRADIENT_COLORS = ['#4CA6FA', '#1D4ADD'];

export default function OnboardingScreen({ navigation }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const listRef = useRef<FlatList>(null);
  const { width } = useWindowDimensions();
  const setHasOnboarded = useAuthStore(state => state.setHasOnboarded);

  const isLastSlide = activeIndex === ONBOARDING_SLIDES.length - 1;

  const finishOnboarding = () => {
    setHasOnboarded(true);
    navigation.replace('Welcome');
  };

  const handleNext = () => {
    if (isLastSlide) {
      finishOnboarding();
      return;
    }
    listRef.current?.scrollToIndex({ index: activeIndex + 1 });
  };

  const handleBack = () => {
    if (activeIndex === 0) {
      return;
    }
    listRef.current?.scrollToIndex({ index: activeIndex - 1 });
  };

  const handleMomentumScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setActiveIndex(index);
  };

  return (
    <LinearGradient
      colors={GRADIENT_COLORS}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <ScreenStatusBar backgroundColor={GRADIENT_COLORS[1]} barStyle="light-content" />

        <View style={styles.skipRow}>
          <TouchableOpacity onPress={finishOnboarding} activeOpacity={0.7}>
            <Text style={styles.skipLabel}>Skip</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          ref={listRef}
          style={styles.list}
          contentContainerStyle={styles.listContent}
          data={ONBOARDING_SLIDES}
          keyExtractor={item => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleMomentumScrollEnd}
          getItemLayout={(_, index) => ({ length: width, offset: width * index, index })}
          renderItem={({ item }) => (
            <OnboardingSlide
              width={width}
              icon={item.icon}
              title={item.title}
              description={item.description}
              slideCount={ONBOARDING_SLIDES.length}
              activeIndex={activeIndex}
            />
          )}
        />

        <View style={styles.footer}>
          <NextButton
            label={isLastSlide ? 'Get Started' : 'Next'}
            onPress={handleNext}
            showBack={activeIndex > 0}
            onBackPress={handleBack}
          />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
