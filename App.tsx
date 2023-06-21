import {Box, NativeBaseProvider, Text} from 'native-base';
import React from 'react';
import Form from './src/components/Form';

function App(): JSX.Element {
  return (
    <NativeBaseProvider>
      <Box flex={1} bg="#fff" alignItems="center" justifyContent="center">
        <Text>Welcome to your Keychain Powered store</Text>
        <Form />
      </Box>
    </NativeBaseProvider>
  );
}

export default App;
