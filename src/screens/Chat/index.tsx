import React, { useCallback } from 'react';
import { Platform, ScrollView, Text, View } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { RootStackParamList } from '../../navigation/types';
import MainScreenLayout from '../../components/layout/MainScreenLayout';
import HomeHeader from '../Home/components/HomeHeader';
import { spacing } from '../../styles';
import { useChatStore } from '../../store/chatStore';
import ConciergeIntro from './components/ConciergeIntro';
import StartChatButton from './components/StartChatButton';
import SuggestionChips from './components/SuggestionChips';
import RecentChatsSection from './components/RecentChatsSection';
import { styles } from './styles';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const TAB_BAR_HEIGHT = Platform.OS === 'ios' ? 68 : 56;

export default function ChatScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();
  const conversations = useChatStore(state => state.conversations);
  const loadConversations = useChatStore(state => state.loadConversations);
  const hasRecents = conversations.length > 0;
  const bottomInset = TAB_BAR_HEIGHT + insets.bottom + spacing.md;

  useFocusEffect(
    useCallback(() => {
      loadConversations().catch(() => {});
    }, [loadConversations]),
  );

  return (
    <MainScreenLayout>
      <HomeHeader onAvatarPress={() => {}} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: bottomInset }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <ConciergeIntro compact={hasRecents} />

        <View style={styles.ctaBlock}>
          <StartChatButton onPress={() => navigation.navigate('ChatDetail')} />
          <Text style={styles.hint}>Tap to open a fresh conversation</Text>

          <Text style={styles.orStartTitle}>Or start with</Text>
          <SuggestionChips
            onSelect={suggestion => navigation.navigate('ChatDetail', { initialMessage: suggestion })}
          />
        </View>

        {hasRecents ? (
          <RecentChatsSection
            conversations={conversations}
            onSelect={id => navigation.navigate('ChatDetail', { conversationId: id })}
          />
        ) : null}
      </ScrollView>
    </MainScreenLayout>
  );
}
