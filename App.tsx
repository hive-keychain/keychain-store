import {createDrawerNavigator} from '@react-navigation/drawer';
import {NavigationContainer} from '@react-navigation/native';
import {NativeBaseProvider} from 'native-base';
import React from 'react';
import {useTranslation} from 'react-i18next';
import 'react-native-gesture-handler';
import InvoiceSuccess from './src/components/InvoiceSuccess';
import Loader from './src/components/Loader';
import ScreenLayout from './src/components/ScreenLayout';
import DrawerContent from './src/drawer/Content';
import HomeScreen from './src/screens/HomeScreen';
import HistoryInvoices from './src/screens/history-invoices/HistoryInvoices';
import {MainDrawerParamList} from './src/types/navigation.types';

//TODO here:
// On Invoice history, use the form fieldl(same as main page design) with a "Filter" title, for the filter you made
// On QR Code page, make the field larger, on my phone the memo is too long and goes to the next line, the parent div should be larger.

const Drawer = createDrawerNavigator<MainDrawerParamList>();

function App(): JSX.Element {
  const [loadingApp, setLoadingApp] = React.useState(true);

  const {t} = useTranslation();

  React.useEffect(() => {
    setTimeout(() => {
      setLoadingApp(false);
    }, 1500);
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
