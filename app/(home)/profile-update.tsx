import styled, {css} from '@emotion/native';
import {EditText, Icon, Typography, useDooboo} from 'dooboo-ui';
import {Stack, useRouter} from 'expo-router';
import {ActivityIndicator, Platform, ScrollView} from 'react-native';
import {t} from '../../src/STRINGS';
import {
  ImagePickerAsset,
  launchImageLibraryAsync,
  MediaTypeOptions,
  requestMediaLibraryPermissionsAsync,
} from 'expo-image-picker';
import {api} from '@/convex/_generated/api';
import {Image} from 'expo-image';
import {useForm, Controller, SubmitHandler} from 'react-hook-form';
import {useMutation, useQuery} from 'convex/react';
import {RectButton} from 'react-native-gesture-handler';
import {useState} from 'react';
import {Id} from '../../convex/_generated/dataModel';

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: ${({theme}) => theme.bg.paper};
`;

const Card = styled.View`
  border-radius: 16px;
  background-color: ${({theme}) => theme.bg.basic};
  padding: 36px;
  margin: 24px;

  justify-content: center;
  align-items: center;
  gap: 24px;
`;

const ImageTouchable = styled.TouchableOpacity`
  padding: 8px;

  justify-content: center;
  align-items: center;
`;

type ProfileFormData = {
  displayName: string;
  jobTitle: string;
  description: string;
  websiteUrl: string;
  githubUrl: string;
  linkedInUrl: string;
};

export default function ProfileUpdate(): JSX.Element {
  const {back} = useRouter();
  const {theme} = useDooboo();
  const updateProfile = useMutation(api.users.updateProfile);
  const user = useQuery(api.users.currentUser, {});
  const [loading, setLoading] = useState(false);
  const [imagePickerAsset, setImagePickerAsset] =
    useState<ImagePickerAsset | null>(null);
  const generateUploadUrl = useMutation(api.upload.generateUploadUrl);
  const sendImage = useMutation(api.upload.sendImage);

  const {control, handleSubmit} = useForm<ProfileFormData>({
    defaultValues: {
      displayName: user?.displayName ?? '',
      jobTitle: user?.jobTitle ?? '',
      description: user?.description ?? '',
      websiteUrl: user?.websiteUrl ?? '',
      githubUrl: user?.githubUrl ?? '',
      linkedInUrl: user?.linkedInUrl ?? '',
    },
  });

  const handleImagePressed = async () => {
    const {granted} = await requestMediaLibraryPermissionsAsync();

    if (granted) {
      const image = await launchImageLibraryAsync({
        ...{
          quality: 1,
          aspect: [1, 1],
          mediaTypes: MediaTypeOptions.Images,
        },
      });

      setImagePickerAsset(image.assets?.[0] || null);
    }
  };

  const handleUpdate: SubmitHandler<ProfileFormData> = async (data) => {
    setLoading(true);

    try {
      let avatarUrlId: Id<'_storage'> | undefined;

      if (imagePickerAsset) {
        const url = await generateUploadUrl();
        const response = await fetch(imagePickerAsset.uri);
        const blob = await response.blob();

        const result = await fetch(url, {
          method: 'POST',
          headers: imagePickerAsset.type
            ? {'Content-Type': `${imagePickerAsset.type}/*`}
            : {},
          body: blob,
        });

        const {storageId} = await result.json();
        await sendImage({storageId});

        avatarUrlId = storageId;
      }

      await updateProfile({
        ...data,
        avatarUrlId,
      });

      back();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const image = imagePickerAsset?.uri ?? user?.avatarUrl;

  return (
    <Container>
      <Stack.Screen
        options={{
          title: t('profileUpdate.title'),
          headerShown: true,
          headerRight: () =>
            loading ? (
              <ActivityIndicator color={theme.text.label} />
            ) : (
              <RectButton
                underlayColor="transparent"
                // @ts-ignore
                onPress={handleSubmit(handleUpdate)}
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
                        border-radius: 48px;
                      `
                }
              >
                <Icon name="Pencil" size={18} />
              </RectButton>
            ),
        }}
      />
      <ScrollView>
        <Card>
          <ImageTouchable activeOpacity={0.7} onPress={handleImagePressed}>
            <Image
              style={css`
                width: 148px;
                height: 148px;
                border-radius: 80px;
                background-color: ${theme.bg.paper};
              `}
              source={{uri: image || ''}}
            />
            {!image ? (
              <Icon
                name="Camera"
                size={24}
                color={theme.text.placeholder}
                style={css`
                  position: absolute;
                  align-self: center;
                `}
              />
            ) : null}
          </ImageTouchable>
          <Controller
            control={control}
            name="displayName"
            render={({field: {onChange, value}}) => (
              <EditText
                label={t('profileUpdate.displayName')}
                placeholder={t('profileUpdate.displayNamePlaceholder')}
                value={value}
                onChangeText={(text) => onChange(text)}
              />
            )}
          />
          <Controller
            control={control}
            name="jobTitle"
            render={({field: {onChange, value}}) => (
              <EditText
                label={t('profileUpdate.jobTitle')}
                placeholder={t('profileUpdate.jobTitlePlaceholder')}
                value={value}
                onChangeText={(text) => onChange(text)}
              />
            )}
          />
          <Controller
            control={control}
            name="description"
            render={({field: {onChange, value}}) => (
              <EditText
                label={t('profileUpdate.description')}
                placeholder={t('profileUpdate.descriptionPlaceholder')}
                value={value}
                onChangeText={(text) => onChange(text)}
              />
            )}
          />
        </Card>
        <Card
          style={css`
            margin-top: -8px;

            align-items: flex-start;
          `}
        >
          <Typography.Heading5>
            {t('profileUpdate.websites')}
          </Typography.Heading5>
          <Controller
            control={control}
            name="websiteUrl"
            render={({field: {onChange, value}}) => (
              <EditText
                label={t('profileUpdate.websiteUrl')}
                placeholder={'https://...'}
                value={value}
                // `onChangeText`를 `onChange`와 연결
                onChangeText={(text) => onChange(text)}
                startElement={<Icon name="Browser" size={20} />}
              />
            )}
          />
          <Controller
            control={control}
            name="githubUrl"
            render={({field: {onChange, value}}) => (
              <EditText
                label={t('profileUpdate.githubUrl')}
                placeholder={'https://...'}
                value={value}
                // `onChangeText`를 `onChange`와 연결
                onChangeText={(text) => onChange(text)}
                startElement={<Icon name="GithubLogo" size={20} />}
              />
            )}
          />
          <Controller
            control={control}
            name="linkedInUrl"
            render={({field: {onChange, value}}) => (
              <EditText
                label={t('profileUpdate.linkedInUrl')}
                placeholder={'https://...'}
                value={value}
                // `onChangeText`를 `onChange`와 연결
                onChangeText={(text) => onChange(text)}
                startElement={<Icon name="LinkedinLogo" size={20} />}
              />
            )}
          />
        </Card>
      </ScrollView>
    </Container>
  );
}
