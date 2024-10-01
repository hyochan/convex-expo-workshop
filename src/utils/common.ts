import {Linking, Platform} from 'react-native';

export const openURL = async (url: string): Promise<void> => {
  const supported = await Linking.canOpenURL(url);

  if (supported) {
    await Linking.openURL(url);
  }

  if (Platform.OS === 'web') {
    window.open(url, '_blank');
  }
};

export const goToAppStore = (): void => {
  if (Platform.OS === 'ios') {
    Linking.openURL('itms-apps://itunes.apple.com/us/app/apple-store/id6642658451');
  } else {
    Linking.openURL('market://details?id=com.crossplatformkorea.app');
  }
};
