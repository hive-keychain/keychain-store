import AsyncStorage from '@react-native-async-storage/async-storage';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {NavigationContainer} from '@react-navigation/native';
import {NativeBaseProvider} from 'native-base';
import React from 'react';
import {useTranslation} from 'react-i18next';
import 'react-native-gesture-handler';
import InvoiceSuccess from './src/components/InvoiceSuccess';
import Loader from './src/components/Loader';
import ScreenLayout from './src/components/ScreenLayout';
import {FALLBACKLANGUAGECODE} from './src/constants/localization';
import DrawerContent from './src/drawer/Content';
import i18n from './src/localization/i18n';
import HomeScreen from './src/screens/HomeScreen';
import HistoryInvoices from './src/screens/history-invoices/HistoryInvoices';
import {MainDrawerParamList} from './src/types/navigation.types';
import {AsyncStorageKey} from './src/utils/asyncstorage';

//TODO here:
// Regarding the store please change the following :
// Delete the Settings menu
// Language should be automatically according to device language
// On Invoice history, use the form fieldl(same as main page design) with a "Filter" title, for the filter you made
// On QR Code page, make the field larger, on my phone the memo is too long and goes to the next line, the parent div should be larger.

const Drawer = createDrawerNavigator<MainDrawerParamList>();

function App(): JSX.Element {
  const [loadingApp, setLoadingApp] = React.useState(true);

  const {t} = useTranslation();

  const loadLanguage = async () => {
    let currentLanguage: string | null = null;
    try {
      currentLanguage = await AsyncStorage.getItem(
        AsyncStorageKey.LANGUAGE_SELECTED,
      );
    } catch (error: any) {
      console.log({ErrorSettingLanguage: error.message});
    } finally {
      if (!currentLanguage) {
        i18n.changeLanguage(FALLBACKLANGUAGECODE);
      } else {
        i18n.changeLanguage(currentLanguage);
      }
      setLoadingApp(false);
    }
  };

  React.useEffect(() => {
    loadLanguage();
  }, []);

  return (
    <NativeBaseProvider>
      {!loadingApp ? (
        <NavigationContainer>
          <Drawer.Navigator
            drawerContent={props => <DrawerContent {...props} />}>
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
      ) : (
        <ScreenLayout>
          <Loader />
        </ScreenLayout>
      )}
    </NativeBaseProvider>
  );
}

export default App;
