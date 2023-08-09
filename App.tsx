import {createDrawerNavigator} from '@react-navigation/drawer';
import {NavigationContainer} from '@react-navigation/native';
import {NativeBaseProvider} from 'native-base';
import React from 'react';
import 'react-native-gesture-handler';
import Form from './src/components/Form';
import HistoryInvoices from './src/components/HistoryInvoices';

const Drawer = createDrawerNavigator();

//TODO in drawer menu
//  - add a footer similar style as the app. Picture and link to vote witness.
//  - add success payment screen.

function App(): JSX.Element {
  return (
    <NavigationContainer>
      <NativeBaseProvider>
        <Drawer.Navigator initialRouteName="Home">
          <Drawer.Screen name="Home" component={Form} />
          <Drawer.Screen name="History Invoices" component={HistoryInvoices} />
        </Drawer.Navigator>
      </NativeBaseProvider>
    </NavigationContainer>
  );
}

export default App;
