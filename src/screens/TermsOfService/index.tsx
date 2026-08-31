import React from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';
import LegalPageLayout from '../../components/layout/LegalPageLayout';

type Props = NativeStackScreenProps<RootStackParamList, 'TermsOfService'>;

export default function TermsOfServiceScreen({ navigation }: Props) {
  return (
    <LegalPageLayout title="Terms of Service" kind="terms" onBack={() => navigation.goBack()} />
  );
}
