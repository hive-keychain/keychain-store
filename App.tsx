import {createDrawerNavigator} from '@react-navigation/drawer';
import {NavigationContainer} from '@react-navigation/native';
import {NativeBaseProvider} from 'native-base';
import React from 'react';
import 'react-native-gesture-handler';
import HistoryInvoices from './src/components/HistoryInvoices';
import InvoiceSuccess from './src/components/InvoiceSuccess';
import DrawerContent from './src/drawer/Content';
import HomeScreen from './src/screens/HomeScreen';
import {MainDrawerParamList} from './src/types/navigation.types';

const Drawer = createDrawerNavigator<MainDrawerParamList>();

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
