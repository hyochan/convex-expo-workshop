import styled from '@emotion/native';
import {Stack} from 'expo-router';
import {Button, Typography} from 'dooboo-ui';
import {t} from '../../../src/STRINGS';
import {ScrollView} from 'react-native';
import {IC_ICON} from '../../../src/icons';
import ErrorBoundary from 'react-native-error-boundary';
import {Image} from 'expo-image';
import FallbackComponent from '../../../src/uis/FallbackComponent';
import {useAuth} from '@clerk/clerk-expo';
import {useState} from 'react';

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: ${({theme}) => theme.bg.basic};
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

const UserName = styled(Typography.Heading5)`
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 8px;
`;

const UserBio = styled.Text`
  font-size: 16px;
  color: ${({theme}) => theme.text.label};
  text-align: center;
  margin-bottom: 16px;
`;

export default function My(): JSX.Element {
  const [isSigningOut, setIsSigningOut] = useState(false);
  const {signOut} = useAuth();

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
      <Stack.Screen options={{title: t('common.my')}} />
      <Container>
        <ScrollView bounces={false}>
          <ProfileHeader>
            <UserAvatar source={IC_ICON} />
            <UserName>User Name</UserName>
          </ProfileHeader>
          <Content>
            <UserBio>Hello there!!</UserBio>
            <Button
              type='outlined'
              color='warning'
              text={t('common.signOut')}
              onPress={handleSignOut}
              loading={isSigningOut}
            />
          </Content>
        </ScrollView>
      </Container>
    </ErrorBoundary>
  );
}
