import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';
import { colors } from '../../styles';
import MainScreenLayout from '../../components/layout/MainScreenLayout';
import LoadingState from '../../components/ui/LoadingState';
import { useChatStore } from '../../store/chatStore';
import type { ApiConversation } from '../../services/engagementApi';
import ChatDetailHeader from './components/ChatDetailHeader';
import MessageBubble from './components/MessageBubble';
import TypingIndicator from './components/TypingIndicator';
import ChatInputBar from './components/ChatInputBar';
import { toChatMessage, type ChatMessage } from './messages';
import { styles } from './styles';

type Props = NativeStackScreenProps<RootStackParamList, 'ChatDetail'>;

export default function ChatDetailScreen({ navigation, route }: Props) {
  const getConversation = useChatStore(state => state.getConversation);
  const createConversation = useChatStore(state => state.createConversation);
  const sendMessageApi = useChatStore(state => state.sendMessage);

  const [conversationId, setConversationId] = useState<string | null>(
    route.params?.conversationId ?? null,
  );
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const listRef = useRef<FlatList>(null);
  const isMounted = useRef(true);

  const applyConversation = useCallback((conversation: ApiConversation) => {
    setMessages(conversation.messages.map(toChatMessage));
  }, []);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isTyping) return;

      setDraft('');
      setIsTyping(true);

      try {
        const conversation = conversationId
          ? await sendMessageApi(conversationId, trimmed)
          : await createConversation(trimmed);

        if (!isMounted.current) return;
        if (!conversationId) setConversationId(conversation.id);
        applyConversation(conversation);
      } catch {
        // best-effort: leave prior messages, drop the typing state
      } finally {
        if (isMounted.current) setIsTyping(false);
      }
    },
    [conversationId, isTyping, applyConversation, createConversation, sendMessageApi],
  );

  useEffect(() => {
    isMounted.current = true;

    const init = async () => {
      const initialMessage = route.params?.initialMessage;
      const existingId = route.params?.conversationId;

      if (existingId) {
        try {
          const conversation = await getConversation(existingId);
          if (isMounted.current) applyConversation(conversation);
        } catch {
          // fall through to empty thread
        }
      }

      setInitializing(false);

      if (initialMessage) {
        sendMessage(initialMessage);
      }
    };

    init();

    return () => {
      isMounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scrollToEnd = useCallback((animated: boolean) => {
    requestAnimationFrame(() => listRef.current?.scrollToEnd({ animated }));
  }, []);

  useEffect(() => {
    if (messages.length > 0 || isTyping) {
      scrollToEnd(true);
    }
  }, [messages, isTyping, scrollToEnd]);

  return (
    <MainScreenLayout edges={['top', 'bottom']}>

      <ChatDetailHeader onBack={() => navigation.goBack()} />

      {initializing ? (
        <LoadingState />
      ) : (
        <KeyboardAvoidingView
          style={styles.flex}
          behavior="padding"
          keyboardVerticalOffset={Platform.OS === 'ios' ? 8 : 0}
        >
          <FlatList
            ref={listRef}
            style={styles.list}
            contentContainerStyle={styles.listContent}
            data={messages}
            keyExtractor={item => item.id}
            renderItem={({ item }) => <MessageBubble message={item} />}
            ListFooterComponent={isTyping ? <TypingIndicator /> : null}
            keyboardShouldPersistTaps="handled"
            onContentSizeChange={() => scrollToEnd(false)}
            initialNumToRender={20}
            removeClippedSubviews={Platform.OS === 'android'}
          />

          <View style={styles.inputWrap}>
            <ChatInputBar value={draft} onChangeText={setDraft} onSend={() => sendMessage(draft)} />
          </View>
        </KeyboardAvoidingView>
      )}
    </MainScreenLayout>
  );
}
