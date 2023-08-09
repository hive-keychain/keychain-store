import {TransferOperation} from '@hiveio/dhive';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Button,
  CheckIcon,
  FormControl,
  Heading,
  Icon,
  Input,
  InputGroup,
  Pressable,
  Select,
  Text,
  VStack,
} from 'native-base';
import React from 'react';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import {generateMemo} from '../utils/memo';
import HiveQRCode from './HiveQRCode';

export default () => {
  const [formData, setData] = React.useState({
    name: '',
    amount: '0.001',
    memo: '',
  });
  const [lock, setLock] = React.useState(false);
  const [currency, setCurrency] = React.useState('HBD');
  const [memo, setMemo] = React.useState('');
  const [errorValidation, setErrorValidation] = React.useState<string | null>(
    null,
  );
  const [showQR, setSetShowQR] = React.useState(false);

  React.useEffect(() => {
    init();
  }, []);

  const init = async () => {
    const lastStoreName = await AsyncStorage.getItem('last_store_name');
    if (lastStoreName) {
      setData({...formData, name: lastStoreName});
    }
  };

  const handlerSubmitData = async () => {
    if (
      formData.name.trim().length === 0 ||
      formData.amount.trim().length === 0 ||
      memo.trim().length === 0
    ) {
      setErrorValidation('Missing fields!');
      setTimeout(() => {
        setErrorValidation(null);
      }, 3000);
    } else {
      await AsyncStorage.setItem('last_store_name', formData.name);
      setSetShowQR(true);
    }
  };

  //TODO here:
  //  - reset state after coming back from confirmation.
  //  - clean up
  //  - remove assets folder as not needed anymore
  //  - Rather than a small message on the QR code page, create a new screen for successful payment
  //  - verify it scales well on bigger devices(is there a way to do this online?? or using an actual method, research)

  return (
    <VStack width="90%" mx="3" maxW="300px" mt={60}>
      {!showQR && (
        <>
          <Heading bold>New Invoice</Heading>
          <FormControl isRequired>
            <FormControl.Label
              _text={{
                bold: true,
              }}>
              Shop Username
            </FormControl.Label>
            <Input
              InputLeftElement={
                <Icon
                  as={<Icon2 name="person" />}
                  size={5}
                  ml="2"
                  color="muted.400"
                />
              }
              InputRightElement={
                <Pressable onPress={() => setLock(!lock)}>
                  <Icon
                    as={<Icon2 name={lock ? 'lock-outline' : 'lock-open'} />}
                    size={5}
                    mr="2"
                    color="muted.400"
                  />
                </Pressable>
              }
              placeholder="myawesomeshop"
              isDisabled={lock}
              onChangeText={value => setData({...formData, name: value})}
              value={formData.name}
            />
          </FormControl>
          <FormControl isRequired>
            <FormControl.Label
              _text={{
                bold: true,
              }}>
              Amount
            </FormControl.Label>
            <InputGroup>
              <Input
                keyboardType="number-pad"
                placeholder="1.000"
                isDisabled={lock}
                width="50%"
                onChangeText={value => setData({...formData, amount: value})}
                value={formData.amount}
              />
              <Select
                //@ts-ignore
                isReadOnly
                selectedValue={currency}
                focusable={false}
                minWidth="50%"
                _selectedItem={{
                  endIcon: <CheckIcon size="5" />,
                }}
                onValueChange={itemValue => setCurrency(itemValue)}>
                <Select.Item label="HIVE" value="HIVE" />
                <Select.Item label="HBD" value="HBD" />
              </Select>
            </InputGroup>
          </FormControl>
          <FormControl>
            <FormControl.Label
              _text={{
                bold: true,
              }}>
              Memo
            </FormControl.Label>
            <Input
              InputLeftElement={
                <Icon
                  as={<Icon2 name="note" />}
                  size={5}
                  ml="2"
                  color="muted.400"
                />
              }
              InputRightElement={
                <Pressable onPress={() => setMemo(generateMemo())}>
                  <Icon
                    as={<Icon2 name="replay" />}
                    size={5}
                    mr="2"
                    color="muted.400"
                  />
                </Pressable>
              }
              placeholder="myawesomeshop"
              value={memo}
              onChangeText={value => {
                setData({...formData, memo: value});
                setMemo(value);
              }}
            />
          </FormControl>
          <Button onPress={handlerSubmitData} mt="50" colorScheme="cyan">
            Submit
          </Button>
          {errorValidation && (
            <VStack mt={4} alignItems={'center'}>
              <Text>{errorValidation}</Text>
            </VStack>
          )}
        </>
      )}
      {showQR && (
        <HiveQRCode
          op={
            [
              'transfer',
              {
                amount: Number(formData.amount).toFixed(3) + ' ' + currency,
                from: '',
                to: formData.name,
                memo: memo,
              },
            ] as TransferOperation
          }
          goBack={() => setSetShowQR(false)}
        />
      )}
    </VStack>
  );
};
