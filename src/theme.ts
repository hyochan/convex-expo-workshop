import type {DoobooThemeParams} from '@dooboo-ui/theme';

export const colors = {
  apple: '#000000',
  google: '#E04238',
  facebook: '#345997',
};

export const light = {
  brand: '#fff',
  brandContrast: '#333',
};

export type CustomAppTheme = typeof light & DoobooThemeParams;

export const dark: typeof light = {
  brand: '#333',
  brandContrast: '#fff',
};

export const theme = {
  light,
  dark,
};
