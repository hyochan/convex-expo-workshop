import {ActivityIndicator, Platform, type ViewStyle} from 'react-native';
import styled, {css} from '@emotion/native';
import type {EditTextProps} from 'dooboo-ui';
import {EditText, Icon, useDooboo} from 'dooboo-ui';
import CustomPressable from 'dooboo-ui/uis/CustomPressable';
import {delayPressIn} from '../utils/constants';

const Container = styled.View`
  background-color: ${({theme}) => theme.bg.basic};
  gap: 10px;
`;

const ButtonsWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;

type Props = {
  style?: ViewStyle;
  styles?: EditTextProps['styles'];
  loading?: boolean;
  message?: string;
  setMessage?: (msg: string) => void;
  createChatMessage: () => void;
  disabled?: boolean;
};

export default function ChatInput({
  style,
  styles,
  loading,
  message,
  setMessage,
  createChatMessage,
  disabled,
}: Props): JSX.Element {
  const {theme} = useDooboo();

  return (
    <Container style={style}>
      <EditText
        decoration="boxed"
        editable={!loading}
        endElement={
          <ButtonsWrapper
            style={css`
              margin-left: 8px;
            `}
          >
            {loading ? (
              <ActivityIndicator
                color={theme.text.basic}
                style={css`
                  padding: 8px 6px;
                  margin-right: 2px;
                `}
              />
            ) : (
              <CustomPressable
                delayHoverIn={delayPressIn}
                onPress={!disabled ? createChatMessage : undefined}
                style={css`
                  padding: 6px;
                  border-radius: 99px;
                `}
              >
                <Icon
                  color={disabled ? theme.text.disabled : theme.text.basic}
                  name="PaperPlaneRight"
                  size={22}
                />
              </CustomPressable>
            )}
          </ButtonsWrapper>
        }
        multiline
        onChangeText={setMessage}
        placeholder={`Type a message...`}
        styles={{
          container: [
            css`
              border-radius: 4px;
            `,
            styles?.container,
          ],
          input: [
            css`
              padding: ${Platform.OS === 'web'
                ? '14px 0 0'
                : Platform.OS === 'android'
                  ? '5.7px 0'
                  : '10px 0'};
            `,
            styles?.input,
          ],
        }}
        textInputProps={{
          onKeyPress: ({nativeEvent}) => {
            if (Platform.OS === 'web') {
              // @ts-ignore
              if (nativeEvent.key === 'Enter' && !nativeEvent.shiftKey) {
                createChatMessage();

                return;
              }
            }
          },
        }}
        value={message}
      />
    </Container>
  );
}
