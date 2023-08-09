import {createDrawerNavigator} from '@react-navigation/drawer';
import {NavigationContainer} from '@react-navigation/native';
import {NativeBaseProvider} from 'native-base';
import React from 'react';
import 'react-native-gesture-handler';
import Form from './src/components/Form';
import HistoryInvoices from './src/components/HistoryInvoices';

const Drawer = createDrawerNavigator();

function App(): JSX.Element {
  return (
    <NativeBaseProvider>
      {/* <Box flex={1} bg="#fff" alignItems="center" justifyContent="center">
        <Text>Welcome to your Keychain Powered store</Text>
        <Form />
      </Box> */}
      <NavigationContainer>
        <Drawer.Navigator initialRouteName="Home">
          <Drawer.Screen name="Home" component={Form} />
          <Drawer.Screen name="History Invoices" component={HistoryInvoices} />
        </Drawer.Navigator>
      </NavigationContainer>
    </NativeBaseProvider>
  );
}

export default App;
