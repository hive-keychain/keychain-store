import {createDrawerNavigator} from '@react-navigation/drawer';
import {NavigationContainer} from '@react-navigation/native';
import {NativeBaseProvider} from 'native-base';
import React, {JSX} from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet} from 'react-native';
import 'react-native-gesture-handler';
import InvoiceSuccess from './src/components/InvoiceSuccess';
import Loader from './src/components/Loader';
import ScreenLayout from './src/components/ScreenLayout';
import {COLORS} from './src/constants/colors';
import DrawerContent from './src/drawer/Content';
import HomeScreen from './src/screens/HomeScreen';
import HistoryInvoices from './src/screens/history-invoices/HistoryInvoices';
import {MainDrawerParamList} from './src/types/navigation.types';

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
            screenOptions={{
              drawerStyle: styles.drawer,
              drawerActiveBackgroundColor: COLORS.red,
            }}
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
                popToTopOnBlur: true,
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
          <Loader size={120} />
        </ScreenLayout>
      )}
    </NativeBaseProvider>
  );
}

const styles = StyleSheet.create({
  drawer: {
    backgroundColor: COLORS.menuHamburguerBg,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    width: '70%',
    height: '96%',
    bottom: '2%',
    top: undefined,
  },
});

export default App;
