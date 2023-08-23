import {createDrawerNavigator} from '@react-navigation/drawer';
import {NavigationContainer} from '@react-navigation/native';
import {NativeBaseProvider} from 'native-base';
import React from 'react';
import {useTranslation} from 'react-i18next';
import 'react-native-gesture-handler';
import InvoiceSuccess from './src/components/InvoiceSuccess';
import DrawerContent from './src/drawer/Content';
import './src/localization/i18n';
import HomeScreen from './src/screens/HomeScreen';
import Settings from './src/screens/Settings';
import HistoryInvoices from './src/screens/history-invoices/HistoryInvoices';
import {MainDrawerParamList} from './src/types/navigation.types';

const Drawer = createDrawerNavigator<MainDrawerParamList>();

//TODO
//  - add i18n.
//  - keep working with i18n check what's left + add spanish.
//  - add tr into settings to switch language.
//  - find an effective way to test this app in several android devices. research internet.
//  - find if possible to test IOs???
//   - check the TODOs, test in device...submit PR.

function App(): JSX.Element {
  const {t} = useTranslation();
  return (
    <NativeBaseProvider>
      <NavigationContainer>
        <Drawer.Navigator drawerContent={props => <DrawerContent {...props} />}>
          <Drawer.Screen
            name="Home"
            component={HomeScreen}
            options={{
              title: t('navigation:homeTitle'),
            }}
          />
          <Drawer.Screen
            name="History"
            component={HistoryInvoices}
            options={{
              title: t('navigation:historyTitle'),
              unmountOnBlur: true,
            }}
          />
          <Drawer.Screen
            name="Settings"
            component={Settings}
            options={{
              title: t('navigation:settingsTitle'),
              unmountOnBlur: true,
            }}
          />

          {/* //Hidden screens from menu */}
          <Drawer.Screen
            name="InvoiceSuccess"
            component={InvoiceSuccess}
            options={{
              title: t('navigation:invoiceSuccessTitle'),
              drawerItemStyle: {display: 'none'},
            }}
          />
        </Drawer.Navigator>
      </NavigationContainer>
    </NativeBaseProvider>
  );
}

export default App;
