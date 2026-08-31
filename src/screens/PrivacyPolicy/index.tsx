import React from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';
import LegalPageLayout from '../../components/layout/LegalPageLayout';

type Props = NativeStackScreenProps<RootStackParamList, 'PrivacyPolicy'>;

export default function PrivacyPolicyScreen({ navigation }: Props) {
  return (
    <LegalPageLayout title="Privacy Policy" kind="privacy" onBack={() => navigation.goBack()} />
  );
}
