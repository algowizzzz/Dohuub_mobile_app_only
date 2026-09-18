import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FlatList, Keyboard, Platform, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { RootStackParamList } from '../../navigation/types';
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
  const insets = useSafeAreaInsets();
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
  const [keyboardHeight, setKeyboardHeight] = useState(0);
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

  useEffect(() => {
    // Manual keyboard offset is more reliable than KeyboardAvoidingView for
    // chat composers on iOS (KAV often leaves the input behind the keyboard).
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSub = Keyboard.addListener(showEvent, event => {
      // Android already resizes the window (adjustResize) — don't double-pad.
      if (Platform.OS === 'ios') {
        setKeyboardHeight(event.endCoordinates.height);
      }
      scrollToEnd(true);
    });
    const hideSub = Keyboard.addListener(hideEvent, () => {
      setKeyboardHeight(0);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, [scrollToEnd]);

  const composerPadBottom =
    keyboardHeight > 0 ? keyboardHeight : Math.max(insets.bottom, 8);

  return (
    <MainScreenLayout edges={['top']}>
      <ChatDetailHeader onBack={() => navigation.goBack()} />

      {initializing ? (
        <LoadingState />
      ) : (
        <View style={styles.flex}>
          <FlatList
            ref={listRef}
            style={styles.list}
            contentContainerStyle={styles.listContent}
            data={messages}
            keyExtractor={item => item.id}
            renderItem={({ item }) => <MessageBubble message={item} />}
            ListFooterComponent={isTyping ? <TypingIndicator /> : null}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="interactive"
            onContentSizeChange={() => scrollToEnd(false)}
            initialNumToRender={20}
            removeClippedSubviews={Platform.OS === 'android'}
          />

          <View style={[styles.inputWrap, { paddingBottom: composerPadBottom }]}>
            <ChatInputBar value={draft} onChangeText={setDraft} onSend={() => sendMessage(draft)} />
          </View>
        </View>
      )}
    </MainScreenLayout>
  );
}
