import React, { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../styles';
import { contentApi, type ContentDocumentKind } from '../../services/contentApi';
import MainScreenLayout from './MainScreenLayout';
import SubScreenHeader from './SubScreenHeader';
import LoadingState from '../ui/LoadingState';
import ErrorState from '../ui/ErrorState';
import { styles } from './LegalPageLayout.styles';

type Props = {
  title: string;
  kind: ContentDocumentKind;
  onBack: () => void;
  showContactCard?: boolean;
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

export default function LegalPageLayout({ title, kind, onBack, showContactCard = false }: Props) {
  const [body, setBody] = useState('');
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    setError(null);
    contentApi
      .getDocument(kind)
      .then(doc => {
        setBody(doc.content);
        setLastUpdated(doc.updatedAt);
      })
      .catch(err => setError((err as Error).message))
      .finally(() => setLoading(false));
  };

  useEffect(load, [kind]);

  return (
    <MainScreenLayout edges={['top', 'bottom']}>
      <SubScreenHeader title={title} onBack={onBack} />

      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState message={error} onRetry={load} />
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {lastUpdated ? (
            <Text style={styles.lastUpdated}>Last updated {formatDate(lastUpdated)}</Text>
          ) : null}
          <Text style={styles.body}>{body}</Text>

          {showContactCard ? (
            <View style={styles.contactCard}>
              <View style={styles.iconWrap}>
                <Icon name="mail-outline" size={18} color={colors.primary} />
              </View>
              <View>
                <Text style={styles.contactTitle}>Questions?</Text>
                <Text style={styles.contactSubtitle}>dohuubsupport@gmail.com</Text>
              </View>
            </View>
          ) : null}
        </ScrollView>
      )}
    </MainScreenLayout>
  );
}
