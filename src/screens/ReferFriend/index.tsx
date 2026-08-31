import React, { useCallback, useState } from 'react';
import { ScrollView, Share, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import Clipboard from '@react-native-clipboard/clipboard';
import Icon from 'react-native-vector-icons/Ionicons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';
import { colors } from '../../styles';
import ScreenStatusBar from '../../components/layout/ScreenStatusBar';
import SubScreenHeader from '../../components/layout/SubScreenHeader';
import LoadingState from '../../components/ui/LoadingState';
import ErrorState from '../../components/ui/ErrorState';
import { useRewardsStore } from '../../store/rewardsStore';
import HowItWorksStep from './components/HowItWorksStep';
import ReferralStatCard from './components/ReferralStatCard';
import ReferralHistoryRow from './components/ReferralHistoryRow';
import { styles } from './styles';

type Props = NativeStackScreenProps<RootStackParamList, 'ReferFriend'>;

export default function ReferFriendScreen({ navigation }: Props) {
  const referral = useRewardsStore(state => state.referral);
  const loading = useRewardsStore(state => state.loading);
  const error = useRewardsStore(state => state.error);
  const loadReferral = useRewardsStore(state => state.loadReferral);
  const [copied, setCopied] = useState<'code' | 'link' | null>(null);

  useFocusEffect(
    useCallback(() => {
      loadReferral().catch(() => {});
    }, [loadReferral]),
  );

  if (loading && !referral) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <SubScreenHeader title="Refer a Friend" onBack={() => navigation.goBack()} />
        <LoadingState />
      </SafeAreaView>
    );
  }

  if (error && !referral) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <SubScreenHeader title="Refer a Friend" onBack={() => navigation.goBack()} />
        <ErrorState message={error} onRetry={() => loadReferral()} />
      </SafeAreaView>
    );
  }

  if (!referral) return null;

  const shareMessage = `Join me on DoHuub! Use my code ${referral.referralCode} to get points on your first order.`;

  const markCopied = (kind: 'code' | 'link') => {
    setCopied(kind);
    setTimeout(() => setCopied(null), 1800);
  };

  const handleCopyCode = () => {
    Clipboard.setString(referral.referralCode);
    markCopied('code');
  };

  const handleCopyLink = () => {
    Clipboard.setString(shareMessage);
    markCopied('link');
  };

  const handleShare = () => {
    Share.share({ message: shareMessage });
  };

  const youPts = referral.rewards.referrerPoints;
  const theyPts = referral.rewards.refereePoints;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScreenStatusBar backgroundColor={colors.white} barStyle="dark-content" />
      <SubScreenHeader title="Refer a Friend" onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.heroIconWrap}>
            <Icon name="gift" size={40} color="rgb(147, 51, 234)" />
          </View>
          <Text style={styles.heroTitle}>Share & Earn Points</Text>
          <Text style={styles.heroSubtitle}>Invite friends to DoHuub and you both earn rewards!</Text>

          <View style={styles.codeCard}>
            <Text style={styles.codeLabel}>Your Referral Code</Text>
            <View style={styles.codeRow}>
              <Text style={styles.codeValue}>{referral.referralCode}</Text>
              <TouchableOpacity onPress={handleCopyCode} hitSlop={8} style={styles.copyIconButton}>
                <Icon
                  name={copied === 'code' ? 'checkmark-circle' : 'copy-outline'}
                  size={20}
                  color={copied === 'code' ? colors.success : colors.textMuted}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.codeActions}>
              <TouchableOpacity style={styles.shareButton} onPress={handleShare} activeOpacity={0.85}>
                <Icon name="share-social-outline" size={18} color={colors.white} />
                <Text style={styles.shareButtonLabel}>Share Link</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.copyButton} onPress={handleCopyLink} activeOpacity={0.85}>
                <Icon name="copy-outline" size={18} color={colors.text} />
                <Text style={styles.copyButtonLabel}>{copied === 'link' ? 'Copied!' : 'Copy Link'}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.howItWorksCard}>
            <Text style={styles.howItWorksTitle}>How it Works</Text>
            <HowItWorksStep
              icon="people-outline"
              title="Share your code"
              description="Send your unique code to friends"
            />
            <HowItWorksStep
              icon="checkmark-circle-outline"
              title="They sign up & order"
              description="Friend joins and completes their first order"
            />
            <HowItWorksStep
              icon="gift-outline"
              title="You both get rewarded!"
              description={`You get ${youPts} pts • They get ${theyPts} pts`}
              isLast
            />
          </View>

          <View style={styles.statsRow}>
            <ReferralStatCard
              value={String(referral.summary.invited)}
              label="Total Referrals"
              tone="neutral"
            />
            <ReferralStatCard
              value={String(referral.summary.pending)}
              label="Pending"
              tone="pending"
            />
            <ReferralStatCard
              value={String(referral.summary.pointsEarned)}
              label="Points Earned"
              tone="success"
            />
          </View>

          <Text style={styles.sectionTitle}>Referral History</Text>
          {referral.invites.length === 0 ? (
            <Text style={styles.emptyText}>No referrals yet. Share your code to start earning!</Text>
          ) : (
            referral.invites.map(entry => <ReferralHistoryRow key={entry.id} entry={entry} />)
          )}
        </ScrollView>
    </SafeAreaView>
  );
}