import {ScrollView, View} from 'react-native';
import * as WebBrowser from 'expo-web-browser';

import styled, {css} from '@emotion/native';

import {Typography, useDooboo} from 'dooboo-ui';
import {Stack} from 'expo-router';

import {t} from '../../src/STRINGS';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Image} from 'expo-image';
import {IC_ICON} from '../../src/icons';
import {ButtonSocialSignIn} from '../../src/uis/ButtonSocialSignIn';

WebBrowser.maybeCompleteAuthSession();

const Container = styled.View`
  flex: 1;
  align-self: stretch;
  background-color: ${({theme}) => theme.brand};

  justify-content: center;
  align-items: center;
`;

const Content = styled.View`
  flex: 1;
  align-self: stretch;
`;

const Buttons = styled.View`
  min-width: 320px;
  align-self: center;
  margin-top: 8px;
  padding: 20px;
  gap: 12px;

  position: absolute;
  bottom: 20px;
`;

//* This should be placed in page component or won't work
WebBrowser.maybeCompleteAuthSession();

export default function Intro(): JSX.Element {
  const {theme} = useDooboo();
  const {top, bottom, left, right} = useSafeAreaInsets();

  return (
    <Container>
      <Stack.Screen options={{headerShown: false}} />
      <Content style={css``}>
        <ScrollView
          contentContainerStyle={css`
            padding-top: ${top + 32 + 'px'};
            padding-bottom: ${bottom + 'px'};
            padding-left: ${left + 'px'};
            padding-right: ${right + 'px'};
            align-items: center;
            gap: 12px;
          `}
        >
          <Image
            source={IC_ICON}
            style={css`
              align-self: center;
              width: 80px;
              height: 80px;
            `}
          />

          <Typography.Heading3
            style={css`
              margin-top: 8px;
              padding: 0 16px;
              color: ${theme.text.basic};
              text-align: center;
            `}
          >
            {t('common.appName')}
          </Typography.Heading3>
          <Typography.Body2
            style={css`
              padding: 0 16px;
              margin-top: -4px;
              color: ${theme.text.label};
              font-size: 16px;
              text-align: center;
              line-height: 22px;
            `}
          >
            {t('intro.description')}
          </Typography.Body2>
          <View
            style={css`
              height: 220px;
            `}
          />
        </ScrollView>
        <Buttons>
          <ButtonSocialSignIn strategy="oauth_github" />
          <ButtonSocialSignIn strategy="oauth_google" />
          <ButtonSocialSignIn strategy="oauth_apple" />
        </Buttons>
      </Content>
    </Container>
  );
}
