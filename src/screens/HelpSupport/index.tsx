import React, { useCallback, useState } from 'react';
import { Linking, ScrollView, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';
import { colors } from '../../styles';
import MainScreenLayout from '../../components/layout/MainScreenLayout';
import SubScreenHeader from '../../components/layout/SubScreenHeader';
import LoadingState from '../../components/ui/LoadingState';
import ErrorState from '../../components/ui/ErrorState';
import { contentApi, type ApiFaq } from '../../services/contentApi';
import FaqItem from './components/FaqItem';
import ContactRow from './components/ContactRow';
import { styles } from './styles';

type Props = NativeStackScreenProps<RootStackParamList, 'HelpSupport'>;

const SUPPORT_EMAIL = 'dohuubsupport@gmail.com';

export default function HelpSupportScreen({ navigation }: Props) {
  const [faqs, setFaqs] = useState<ApiFaq[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    contentApi
      .listFaqs()
      .then(setFaqs)
      .catch(err => setError((err as Error).message))
      .finally(() => setLoading(false));
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const openSupportEmail = () => {
    Linking.openURL(`mailto:${SUPPORT_EMAIL}`).catch(() => {});
  };

  return (
    <MainScreenLayout edges={['top', 'bottom']}>
      <SubScreenHeader title="Help & Support" onBack={() => navigation.goBack()} />

      <View style={styles.body}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>

            {loading && faqs.length === 0 ? (
              <LoadingState />
            ) : error && faqs.length === 0 ? (
              <ErrorState message={error} onRetry={load} />
            ) : faqs.length === 0 ? (
              <Text style={styles.emptyText}>No help articles yet.</Text>
            ) : (
              faqs.map(faq => (
                <FaqItem
                  key={faq.id}
                  question={faq.question}
                  answer={faq.answer}
                  expanded={expandedId === faq.id}
                  onToggle={() => setExpandedId(prev => (prev === faq.id ? null : faq.id))}
                />
              ))
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Contact Us</Text>
            <ContactRow
              icon="mail-outline"
              title="Email Support"
              subtitle={SUPPORT_EMAIL}
              onPress={openSupportEmail}
            />
            <ContactRow
              icon="time-outline"
              title="AI Assistant Availability"
              subtitle="24/7 Support"
            />
          </View>
        </ScrollView>
      </View>
    </MainScreenLayout>
  );
}
