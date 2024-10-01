import ErrorBoundary from 'react-native-error-boundary';
import FallbackComponent from 'react-native-error-boundary/lib/ErrorBoundary/FallbackComponent';
import {ActionSheetProvider} from '@expo/react-native-action-sheet';
import type {ThemeType} from 'dooboo-ui';
import {DoobooProvider} from 'dooboo-ui';

import {theme} from '../theme';
import {handleErrorConsole} from '../utils/error';
import {ConvexReactClient} from 'convex/react';
import {ConvexProviderWithClerk} from 'convex/react-clerk';
import {ClerkLoaded, ClerkProvider, useAuth} from '@clerk/clerk-expo';
import {tokenCache} from '../utils/cache';
import {clerkPublishableKey} from '../../config';

interface Props {
  initialThemeType?: ThemeType;
  children?: JSX.Element;
}

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
  unsavedChangesWarning: false,
});

function RootProvider({initialThemeType, children}: Props): JSX.Element {
  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={clerkPublishableKey}>
      <ClerkLoaded>
        <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
          <DoobooProvider
            themeConfig={{
              initialThemeType: initialThemeType ?? undefined,
              customTheme: theme,
            }}
          >
            <ErrorBoundary
              FallbackComponent={FallbackComponent}
              onError={handleErrorConsole}
            >
              <ActionSheetProvider>{children}</ActionSheetProvider>
            </ErrorBoundary>
          </DoobooProvider>
        </ConvexProviderWithClerk>
      </ClerkLoaded>
    </ClerkProvider>
  );
}

export default RootProvider;
