import {View} from 'react-native';
import {Icon, useDooboo} from 'dooboo-ui';
import {Tabs} from 'expo-router';
import {t} from '../../../src/STRINGS';
import {RectButton} from 'react-native-gesture-handler';
import {css} from '@emotion/native';
import {Image} from 'expo-image';
import {IC_ICON} from '../../../src/icons';

function SettingsMenu(): JSX.Element {
  const {theme} = useDooboo();

  return (
    <RectButton
      // onPress={() => push('/settings')}
      style={css`
        align-items: center;
        justify-content: center;
        padding: 2px;
        border-radius: 99px;
        margin-right: 8px;
      `}
    >
      <Icon color={theme.text.basic} name="List" size={22} />
    </RectButton>
  );
}

export default function TabLayout(): JSX.Element {
  const {theme} = useDooboo();

  return (
    <Tabs
      initialRouteName="index"
      screenOptions={{
        tabBarActiveTintColor: theme.role.primary,
        headerStyle: {backgroundColor: theme.bg.basic},
        headerTitleStyle: {color: theme.text.basic},
        tabBarStyle: {backgroundColor: theme.bg.basic},
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('common.my'),
          tabBarIcon: ({focused}) => (
            <View
              style={css`
                width: 24px;
                height: 24px;
                border-radius: 12px;
                background-color: ${theme.bg.paper};
                overflow: hidden;
              `}
            >
              <Image
                source={IC_ICON}
                style={css`
                  width: 24px;
                  height: 24px;
                  opacity: ${focused ? '1' : '0.5'};
                `}
              />
            </View>
          ),
          headerRight: () => <View>{SettingsMenu()}</View>,
        }}
      />
    </Tabs>
  );
}
