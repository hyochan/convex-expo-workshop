import Constants from 'expo-constants';

const extra = Constants?.expoConfig?.extra;

export const ROOT_URL = extra?.ROOT_URL;
export const expoProjectId = extra?.expoProjectId;
export const appVersion = Constants?.expoConfig?.version;
