import React from 'react';
import { Image, Linking, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';
import { colors } from '../../styles';
import MainScreenLayout from '../../components/layout/MainScreenLayout';
import SubScreenHeader from '../../components/layout/SubScreenHeader';
import {
  AboutBroom,
  AboutCart,
  AboutGlobe,
  AboutHeart,
  AboutHouse,
  AboutInstagram,
  AboutMail,
  AboutScissors,
  AboutTiktok,
  AboutWrench,
} from '../../components/icons/AboutIcons';
import { logoBlue } from '../../assets/images';
import { styles } from './styles';

type Props = NativeStackScreenProps<RootStackParamList, 'AboutDoHuub'>;

const SUPPORT_EMAIL = 'support@dohuub.com';

const OFFERS = [
  { title: 'Cleaning Services', subtitle: 'Professional home and office cleaning', Icon: AboutBroom },
  { title: 'Handyman Services', subtitle: 'Expert repairs and maintenance', Icon: AboutWrench },
  { title: 'Groceries & Food', subtitle: 'Fresh groceries and meals delivered', Icon: AboutCart },
  { title: 'Beauty on Demand', subtitle: 'Salon services at your location', Icon: AboutScissors },
  { title: 'Rental Properties', subtitle: 'Find your perfect home', Icon: AboutHouse },
  { title: 'Caregiving Services', subtitle: 'Ride assistance and companionship', Icon: AboutHeart },
];

const REASONS = [
  'Verified and trusted service providers',
  'Secure and seamless payment processing',
  'Real-time order tracking and updates',
  '24/7 AI-powered customer support',
  'Flexible scheduling and instant booking',
  'Transparent pricing with no hidden fees',
];

export default function AboutDoHuubScreen({ navigation }: Props) {
  return (
    <MainScreenLayout edges={['top', 'bottom']}>
      <SubScreenHeader title="About DoHuub" onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.logoWrap}>
          <Image source={logoBlue} style={styles.logo} resizeMode="cover" />
        </View>

        <Text style={styles.sectionTitle}>Our Mission</Text>
        <Text style={styles.body}>
          DoHuub is your all-in-one lifestyle super-app, designed to simplify your daily life by
          connecting you with trusted service providers. From cleaning and handyman services to
          beauty treatments and caregiving support, we bring infinite services right to your
          fingertips.
        </Text>

        <Text style={styles.sectionTitle}>What We Offer</Text>
        {OFFERS.map(item => (
          <View key={item.title} style={styles.offerCard}>
            <View style={styles.offerIcon}>
              <item.Icon />
            </View>
            <Text style={styles.offerTitle}>{item.title}</Text>
            <Text style={styles.offerSubtitle}>{item.subtitle}</Text>
          </View>
        ))}

        <Text style={styles.sectionTitle}>Why Choose DoHuub?</Text>
        {REASONS.map(reason => (
          <View key={reason} style={styles.reasonRow}>
            <View style={styles.bullet} />
            <Text style={styles.reasonText}>{reason}</Text>
          </View>
        ))}

        <View style={styles.contactCard}>
          <Text style={styles.contactTitle}>Contact Us</Text>
          <View style={styles.contactItem}>
            <View style={styles.contactIcon}>
              <AboutMail />
            </View>
            <Text style={styles.contactValue} onPress={() => Linking.openURL(`mailto:${SUPPORT_EMAIL}`)}>
              {SUPPORT_EMAIL}
            </Text>
          </View>
          <View style={styles.contactItem}>
            <View style={styles.contactIcon}>
              <AboutGlobe />
            </View>
            <Text style={styles.contactValue} onPress={() => Linking.openURL('https://www.dohuub.com')}>
              www.dohuub.com
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Follow Us</Text>
        <View style={styles.socialRow}>
          <TouchableOpacity
            style={styles.socialButton}
            onPress={() => Linking.openURL('https://instagram.com/dohuub')}
          >
            <AboutInstagram />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.socialButton}
            onPress={() => Linking.openURL('https://www.tiktok.com/@dohuub')}
          >
            <AboutTiktok />
          </TouchableOpacity>
        </View>

        <Text style={styles.footerLove}>Made with ❤️ for our community</Text>
        <Text style={styles.footerCopy}>© 2026 DoHuub, Inc. All rights reserved.</Text>
      </ScrollView>
    </MainScreenLayout>
  );
}
