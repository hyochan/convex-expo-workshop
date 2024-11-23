import {startTransition, useCallback, useRef, useState} from 'react';
import {KeyboardAvoidingView, Platform, Pressable, View} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import styled, {css} from '@emotion/native';
import {FlashList} from '@shopify/flash-list';
import {Icon, Typography, useDooboo} from 'dooboo-ui';
import {Image} from 'expo-image';
import {Stack} from 'expo-router';

import {IC_AI_CHAT} from '../../../src/icons';
import {ChatMessage} from '../../../src/types';
import {openURL} from '../../../src/utils/common';
import ChatMessageListItem from '../../../src/uis/ChatMessageListItem';
import ChatInput from '../../../src/uis/ChatInput';
import {t} from '../../../src/STRINGS';

const EmptyContainer = styled.SafeAreaView`
  padding: 20px;

  justify-content: center;
  align-items: center;
`;

const LogoImage = styled(Image)`
  width: 100px;
  height: 100px;
`;

const EMPTY_CONTENT_MARGIN_TOP = 220;

export const Container = styled.View`
  flex: 1;
  background-color: ${({theme}) => theme.bg.basic};
`;

export default function Chat(): JSX.Element {
  const {bottom} = useSafeAreaInsets();
  const {theme} = useDooboo();
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const listRef = useRef<FlashList<ChatMessage>>(null);
  const marginTopValue = useSharedValue(EMPTY_CONTENT_MARGIN_TOP);

  const animatedStyle = useAnimatedStyle(() => {
    return {marginTop: marginTopValue.value};
  });

  const sendChatMessage = useCallback(async (): Promise<void> => {
    const randomReplies = [
      'Hey! I am a bot. I am not capable of understanding your message.',
      'What can I help you with?',
      'Are you a human?',
      'Nice to meet you!',
      'How are you doing?',
      'I am a bot. I am not capable of understanding your message.',
    ];

    setChatMessages((prevMessages) => [
      {
        message,
        answer: randomReplies[Math.floor(Math.random() * randomReplies.length)],
      },
      ...prevMessages,
    ]);
    setMessage('');
  }, [message]);

  return (
    <Container>
      <Stack.Screen
        options={{
          headerRight: () => (
            <Pressable
              onPress={() => {
                openURL('https://github.com/hyochan/convex-expo-workshop');
              }}
              style={css`
                padding: 12px;
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
        style={[
          css`
            flex: 1;
            align-self: stretch;
          `,
        ]}
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
          //? Issue on inverted flashlist
          // https://github.com/facebook/react-native/issues/21196
          inverted={chatMessages.length !== 0}
          onEndReached={() => {
            // loadNext(LIST_CNT);
          }}
          onEndReachedThreshold={0.1}
          ref={listRef}
          renderItem={({item}) => <ChatMessageListItem item={item} />}
        />
        <ChatInput
          createChatMessage={sendChatMessage}
          message={message}
          disabled={message.length === 0}
          setMessage={(txt) => {
            setMessage(txt);
          }}
          styles={{
            container: css`
              border-radius: 0;
              border-width: 0px;
              border-top-width: 0.3px;
              padding-bottom: 2px;
            `,
          }}
        />
      </KeyboardAvoidingView>
    </Container>
  );
}
