import styled, {css} from '@emotion/native';
import {Stack, useRouter} from 'expo-router';
import {Button, Icon, IconButton, Typography} from 'dooboo-ui';
import {t} from '../../../src/STRINGS';
import {Platform, Pressable, ScrollView} from 'react-native';
import {IC_ICON} from '../../../src/icons';
import ErrorBoundary from 'react-native-error-boundary';
import {Image} from 'expo-image';
import FallbackComponent from '../../../src/uis/FallbackComponent';
import {useAuth} from '@clerk/clerk-expo';
import {useState} from 'react';
import {RectButton} from 'react-native-gesture-handler';

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: ${({theme}) => theme.bg.basic};

  justify-content: center;
  align-items: center;
`;

const ProfileHeader = styled.View`
  align-items: center;
  padding: 24px;
  background-color: ${({theme}) => theme.bg.paper};
  border-bottom-left-radius: 30px;
  border-bottom-right-radius: 30px;
`;

const Content = styled.View`
  padding: 16px;
  flex: 1;

  justify-content: center;
  align-items: center;
  gap: 16px;
`;

const UserAvatar = styled(Image)`
  width: 120px;
  height: 120px;
  border-radius: 60px;
  margin-bottom: 16px;
  border-width: 3px;
  border-color: ${({theme}) => theme.role.border};
`;

const TitleText = styled(Typography.Heading5)`
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 8px;
`;

const Description = styled.Text`
  font-size: 16px;
  color: ${({theme}) => theme.text.label};
  text-align: center;
  margin-bottom: 16px;
`;

const WebsitesWrapper = styled.View`
  flex-direction: row;
  gap: 16px;
`;

export default function My(): JSX.Element {
  const [isSigningOut, setIsSigningOut] = useState(false);
  const {signOut} = useAuth();
  const {push} = useRouter();

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);

      await signOut();
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <ErrorBoundary FallbackComponent={FallbackComponent}>
      <Stack.Screen
        options={{
          title: t('common.my'),
          headerRight: () => (
            <RectButton
              underlayColor="transparent"
              onPress={() => {
                push('/profile-update');
              }}
              hitSlop={{
                bottom: 8,
                left: 8,
                right: 8,
                top: 8,
              }}
              style={
                Platform.OS === 'web'
                  ? css`
                      border-radius: 48px;
                    `
                  : css`
                      margin-top: 4px;
                      width: 26px;
                    `
              }
            >
              <Icon name="Pencil" size={18} />
            </RectButton>
          ),
        }}
      />
      <Container>
        <ScrollView
          bounces={false}
          style={css`
            align-self: stretch;
          `}
        >
          <ProfileHeader>
            <UserAvatar source={IC_ICON} />
            <TitleText>I'm [displayName]</TitleText>
            <Typography.Body1>[Job Title]</Typography.Body1>
          </ProfileHeader>
          <Content>
            <Description>[Description]</Description>
            <WebsitesWrapper>
              <IconButton
                icon="Browser"
                color="primary"
                type="outlined"
                onPress={() => {}}
              />
              <IconButton icon="GithubLogo" color="light" onPress={() => {}} />
              <IconButton
                icon="LinkedinLogo"
                color="light"
                onPress={() => {}}
              />
            </WebsitesWrapper>
          </Content>
        </ScrollView>
        <Button
          style={css`
            padding: 0 24px;
            min-width: 200px;

            position: absolute;
            bottom: 16px;
          `}
          type="outlined"
          color="warning"
          text={t('common.signOut')}
          onPress={handleSignOut}
          loading={isSigningOut}
        />
      </Container>
    </ErrorBoundary>
  );
}
