import Constants from 'expo-constants';

const extra = Constants?.expoConfig?.extra;

export const ROOT_URL = extra?.ROOT_URL;
export const expoProjectId = extra?.expoProjectId;
export const appVersion = Constants?.expoConfig?.version;

export const clerkPublishableKey =
  process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

export const openAiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY!;
