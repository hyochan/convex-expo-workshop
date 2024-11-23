import type {StyleProp, ViewStyle} from 'react-native';
import {Platform, View} from 'react-native';
import ParsedText from 'react-native-parsed-text';
import styled, {css} from '@emotion/native';
import {Typography, useDooboo} from 'dooboo-ui';

import {IC_ICON} from '../icons';
import {openURL} from '../utils/common';
import {ChatMessage} from '../types';

const Content = styled.View`
  flex: 1;
  align-self: stretch;
  gap: 6px;
`;

const UserImage = styled.Image`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: ${({theme}) => theme.bg.paper};
`;

const MessageContainer = styled.View`
  align-items: flex-start;
  gap: 8px;
`;

function AIChatMessageListItem({reply}: {reply: string}): JSX.Element {
  const {theme} = useDooboo();

  return (
    <View
      style={css`
        padding: 8px 16px;

        flex-direction: row;
        gap: 16px;
      `}
    >
      <UserImage source={IC_ICON} />
      <Content>
        <Typography.Body2
          numberOfLines={1}
          style={css`
            font-family: Pretendard-Bold;
            margin-right: 12px;
          `}
        >
          AI
        </Typography.Body2>
        <MessageContainer>
          <ParsedText
            parse={[
              {
                type: 'url',
                onPress: (url) => openURL(url),
                style: css`
                  color: ${theme.role.primary};
                  text-decoration: underline;
                  text-decoration-color: ${theme.role.primary};
                `,
              },
            ]}
            selectable
            style={css`
              margin-bottom: 8px;
              text-align: left;
              background-color: ${theme.bg.paper};
              color: ${theme.text.basic};
              font-size: 14px;
              line-height: 22px;
              padding: ${Platform.select({
                native: '6px 12px;',
                web: '6px;',
              })};
              /* For web */
              text-indent: -4px;
            `}
          >
            {reply}
          </ParsedText>
        </MessageContainer>
      </Content>
    </View>
  );
}

function HumanChatMessageListItem({message}: {message: string}): JSX.Element {
  const {theme} = useDooboo();

  return (
    <View
      style={css`
        padding: 8px 16px;
        align-self: stretch;
        align-items: flex-end;
      `}
    >
      <MessageContainer
        style={css`
          background-color: ${theme.role.secondary};

          flex-direction: row;
        `}
      >
        <ParsedText
          parse={[
            {
              type: 'url',
              onPress: (url) => openURL(url),
              style: css`
                color: ${theme.role.primary};
                text-decoration: underline;
                text-decoration-color: ${theme.role.primary};
              `,
            },
          ]}
          selectable
          style={css`
            color: ${theme.text.contrast};
            font-size: 14px;
            line-height: 22px;
            padding: ${Platform.select({
              native: '6px 12px;',
              web: '6px;',
            })};
            /* For web */
            text-indent: -4px;
          `}
        >
          {message}
        </ParsedText>
      </MessageContainer>
    </View>
  );
}

type Props = {style?: StyleProp<ViewStyle>; item: ChatMessage};

export default function ChatMessageListItem({style, item}: Props): JSX.Element {
  const {message, reply} = item;

  return (
    <View
      style={[
        css`
          align-self: stretch;
        `,
        style,
      ]}
    >
      <HumanChatMessageListItem message={message} />
      <AIChatMessageListItem reply={reply} />
    </View>
  );
}
