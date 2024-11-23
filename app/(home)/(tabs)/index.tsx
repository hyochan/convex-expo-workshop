import {useCallback, useEffect, useRef, useState} from 'react';
import {KeyboardAvoidingView, Platform, Pressable, View} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import styled, {css} from '@emotion/native';
import {FlashList} from '@shopify/flash-list';
import {Icon, LoadingIndicator, Typography, useDooboo} from 'dooboo-ui';
import {Image} from 'expo-image';
import {Stack} from 'expo-router';

import {IC_AI_CHAT} from '../../../src/icons';
import {ChatMessage} from '../../../src/types';
import {openURL} from '../../../src/utils/common';
import ChatMessageListItem from '../../../src/uis/ChatMessageListItem';
import ChatInput from '../../../src/uis/ChatInput';
import {t} from '../../../src/STRINGS';
import {sendMessage} from '../../../src/apis/openai';
import {useMutation, usePaginatedQuery} from 'convex/react';
import {api} from '../../../convex/_generated/api';

const EmptyContainer = styled.SafeAreaView`
  padding: 20px;
  justify-content: center;
  align-items: center;
`;

const LogoImage = styled(Image)`
  width: 100px;
  height: 100px;
`;

const Container = styled.View`
  flex: 1;
  background-color: ${({theme}) => theme.bg.basic};
`;

const EMPTY_CONTENT_MARGIN_TOP = 220;

export default function Chat(): JSX.Element {
  const {bottom} = useSafeAreaInsets();
  const {theme} = useDooboo();
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const listRef = useRef<FlashList<ChatMessage>>(null);
  const marginTopValue = useSharedValue(EMPTY_CONTENT_MARGIN_TOP);

  const animatedStyle = useAnimatedStyle(() => ({
    marginTop: marginTopValue.value,
  }));

  const saveChatMutation = useMutation(api.messages.saveMessage);

  const {results, status, loadMore} = usePaginatedQuery(
    api.messages.list,
    {paginationOpts: {initialNumItems: 5}},
    {initialNumItems: 3},
  );

  useEffect(() => {
    if (results) {
      setChatMessages(results);
    }
  }, [results]);

  const loadMoreMessages = () => {
    if (status === 'CanLoadMore') {
      loadMore(3);
    }
  };

  const sendChatMessage = useCallback(async (): Promise<void> => {
    if (!message.trim()) return;

    setLoading(true);

    try {
      const response = await sendMessage(message);
      const newMessage = {message, reply: response};
      const result = await saveChatMutation(newMessage);

      setChatMessages((prevMessages) => [result, ...prevMessages]);
    } catch (e) {
      console.error('Failed to send or save message:', e);
    } finally {
      setMessage('');
      setLoading(false);
    }
  }, [message, saveChatMutation]);

  if (status === 'LoadingFirstPage') {
    return (
      <LoadingIndicator
        style={css`
          flex: 1;
          align-self: stretch;
          justify-content: center;
          align-items: center;
        `}
      />
    );
  }

  return (
    <Container>
      <Stack.Screen
        options={{
          headerRight: () => (
            <Pressable
              onPress={() =>
                openURL('https://github.com/hyochan/convex-expo-workshop')
              }
              hitSlop={8}
              style={css`
                padding: 4px;
              `}
            >
              <View
                style={css`
                  border-radius: 24px;
                  border-width: 1px;
                  border-color: ${theme.text.basic};
                  padding: 4px;
                `}
              >
                <Icon color={theme.text.basic} name="GithubLogo" size={12} />
              </View>
            </Pressable>
          ),
        }}
      />

      <KeyboardAvoidingView
        behavior={Platform.select({ios: 'padding', default: undefined})}
        keyboardVerticalOffset={Platform.select({
          ios: bottom + 68,
          android: bottom + 80,
        })}
        style={css`
          flex: 1;
          align-self: stretch;
        `}
      >
        <FlashList
          ListEmptyComponent={
            <EmptyContainer>
              <Animated.View
                style={[
                  css`
                    justify-content: center;
                    align-items: center;
                  `,
                  animatedStyle,
                ]}
              >
                <LogoImage
                  source={IC_AI_CHAT}
                  style={css`
                    margin-bottom: 12px;
                  `}
                />
                <Typography.Heading4>{t('common.intro')}</Typography.Heading4>
              </Animated.View>
            </EmptyContainer>
          }
          data={chatMessages}
          estimatedItemSize={160}
          inverted={chatMessages.length !== 0}
          ref={listRef}
          renderItem={({item}) => <ChatMessageListItem item={item} />}
          onEndReached={loadMoreMessages}
          onEndReachedThreshold={0.5}
        />
        <ChatInput
          createChatMessage={sendChatMessage}
          message={message}
          disabled={message.length === 0}
          loading={loading}
          setMessage={setMessage}
          styles={{
            container: css`
              border-radius: 0;
              border-width: 0;
              border-top-width: 0.3px;
              padding-bottom: 2px;
            `,
          }}
        />
      </KeyboardAvoidingView>
    </Container>
  );
}
