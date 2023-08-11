import {createDrawerNavigator} from '@react-navigation/drawer';
import {NavigationContainer} from '@react-navigation/native';
import {NativeBaseProvider} from 'native-base';
import React from 'react';
import 'react-native-gesture-handler';
import InvoiceSuccess from './src/components/InvoiceSuccess';
import DrawerContent from './src/drawer/Content';
import HomeScreen from './src/screens/HomeScreen';
import HistoryInvoices from './src/screens/history-invoices/HistoryInvoices';
import {MainDrawerParamList} from './src/types/navigation.types';

const Drawer = createDrawerNavigator<MainDrawerParamList>();

//TODO check the TODOs, test in device...submit PR.

function App(): JSX.Element {
  return (
    <NativeBaseProvider>
      <NavigationContainer>
        <Drawer.Navigator drawerContent={props => <DrawerContent {...props} />}>
          <Drawer.Screen
            name="Home"
            component={HomeScreen}
            options={{
              title: 'Invoice Store Generator',
            }}
          />
          <Drawer.Screen
            name="History"
            component={HistoryInvoices}
            options={{
              title: 'Invoice History',
              unmountOnBlur: true,
            }}
          />

          {/* //Hidden screens from menu */}
          <Drawer.Screen
            name="InvoiceSuccess"
            component={InvoiceSuccess}
            options={{
              title: 'Invoice Results!',
              drawerItemStyle: {display: 'none'},
            }}
          />
        </Drawer.Navigator>
      </NavigationContainer>
    </NativeBaseProvider>
  );
}

export default App;
