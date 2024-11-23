import {View} from 'react-native';
import {useDooboo} from 'dooboo-ui';
import {Tabs} from 'expo-router';
import {t} from '../../../src/STRINGS';
import {css} from '@emotion/native';
import {Image} from 'expo-image';
import {IC_AI_CHAT, IC_ICON} from '../../../src/icons';

export default function TabLayout(): JSX.Element {
  const {theme} = useDooboo();

  return (
    <Tabs
      initialRouteName="chat"
      screenOptions={{
        tabBarActiveTintColor: theme.role.primary,
        headerStyle: {backgroundColor: theme.bg.basic},
        headerTitleStyle: {color: theme.text.basic},
        tabBarStyle: {backgroundColor: theme.bg.basic},
      }}
    >
      <Tabs.Screen
        name="chat"
        options={{
          title: t('common.chat'),
          tabBarIcon: ({focused}) => (
            <View
              style={css`
                width: 20px;
                height: 20px;
                border-radius: 10px;
                background-color: ${theme.bg.paper};
                overflow: hidden;
              `}
            >
              <Image
                source={IC_AI_CHAT}
                style={css`
                  width: 20px;
                  height: 20px;
                  opacity: ${focused ? '1' : '0.5'};
                `}
              />
            </View>
          ),
        }}
      />
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
        }}
      />
    </Tabs>
  );
}
