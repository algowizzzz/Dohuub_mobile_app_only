import React from 'react';
import { Image, ScrollView, Text, TouchableOpacity } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';
import MainScreenLayout from '../../components/layout/MainScreenLayout';
import SubScreenHeader from '../../components/layout/SubScreenHeader';
import { categoryBeauty, commerceFood, commerceGrocery } from '../../assets/images';
import { colors } from '../../styles';
import { StyleSheet, Platform } from 'react-native';

type Props = NativeStackScreenProps<RootStackParamList, 'CommerceChoice'>;

export default function CommerceChoiceScreen({ navigation, route }: Props) {
  const mode = route.params?.mode || 'groceries';
  const categoryId = route.params?.categoryId;
  const isBeauty = mode === 'beauty';
  const options = isBeauty
    ? [
        {
          key: 'beauty-services',
          title: 'Beauty Services',
          description: 'Book professional beauty services at your doorstep',
          image: categoryBeauty,
          onPress: () =>
            categoryId
              ? navigation.navigate('Services', { categoryId })
              : navigation.goBack(),
        },
        {
          key: 'beauty-products',
          title: 'Beauty Products',
          description: 'Shop cosmetics, skincare and beauty essentials',
          image: commerceGrocery,
          onPress: () => navigation.navigate('CommerceStores', { kind: 'beauty' }),
        },
      ]
    : [
        {
          key: 'food',
          title: 'Food',
          description: 'Order from restaurants and get food delivered to your door',
          image: commerceFood,
          onPress: () => navigation.navigate('CommerceStores', { kind: 'food' }),
        },
        {
          key: 'grocery',
          title: 'Grocery',
          description: 'Shop fresh groceries and household essentials',
          image: commerceGrocery,
          onPress: () => navigation.navigate('CommerceStores', { kind: 'grocery' }),
        },
      ];

  return (
    <MainScreenLayout edges={['top', 'bottom']}>
      <SubScreenHeader
        title={isBeauty ? 'Beauty Services and Products' : 'Groceries & Food'}
        subtitle={isBeauty ? 'Choose your preference' : 'Choose your category'}
        onBack={() => navigation.goBack()}
      />
      <ScrollView contentContainerStyle={styles.scroll}>
        {options.map(opt => (
          <TouchableOpacity
            key={opt.key}
            style={styles.card}
            activeOpacity={0.88}
            onPress={opt.onPress}
          >
            <Image source={opt.image} style={styles.hero} resizeMode="contain" />
            <Text style={styles.title}>{opt.title}</Text>
            <Text style={styles.desc}>{opt.description}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </MainScreenLayout>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 32,
    gap: 16,
  },
  card: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 24,
    paddingVertical: 28,
    paddingHorizontal: 24,
    borderWidth: 1,
    borderColor: 'rgba(46, 122, 217, 0.1)',
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#0f172a',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 14,
      },
      android: { elevation: 3 },
    }),
  },
  hero: {
    width: 96,
    height: 96,
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textHeading,
    marginBottom: 8,
    textAlign: 'center',
  },
  desc: {
    fontSize: 14,
    lineHeight: 21,
    color: colors.textMuted,
    textAlign: 'center',
    maxWidth: 280,
  },
});
