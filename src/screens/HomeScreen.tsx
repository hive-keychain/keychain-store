import {TransferOperation} from '@hiveio/dhive';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {DrawerScreenProps} from '@react-navigation/drawer';
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
  WarningOutlineIcon,
} from 'native-base';
import React from 'react';
import {NativeSyntheticEvent, TextInputFocusEventData} from 'react-native';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import HiveQRCode from '../components/HiveQRCode';
import ScreenLayout from '../components/ScreenLayout';
import {MainDrawerParamList} from '../types/navigation.types';
import {HiveUtils} from '../utils/hive';
import {generateMemo} from '../utils/memo';

export type HomeScreenProps = DrawerScreenProps<MainDrawerParamList, 'Home'>;

export default (props: HomeScreenProps) => {
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
  const [userExist, setUserExist] = React.useState(true);

  React.useEffect(() => {
    init();
  }, []);

  const init = async () => {
    const lastStoreName = await AsyncStorage.getItem('last_store_name');
    if (lastStoreName) {
      setData({...formData, name: lastStoreName});
    }
  };

  React.useEffect(() => {
    const reconfirmationParams = props.route.params;
    if (
      reconfirmationParams &&
      reconfirmationParams.toConfirmOperation &&
      reconfirmationParams.toConfirmOperation.memo
    ) {
      const {store, memo, amount} = reconfirmationParams.toConfirmOperation;
      const currency = amount.split(' ')[1];
      setCurrency(currency);
      setData({
        name: store,
        memo: memo,
        amount: amount.split(' ')[0],
      });
      setMemo(memo);
    }
  }, [props.route.params]);

  const handlerSubmitData = async () => {
    if (
      formData.name.trim().length === 0 ||
      formData.amount.trim().length === 0 ||
      memo.trim().length === 0 ||
      !userExist
    ) {
      setErrorValidation('Missing fields or not found account!');
      setTimeout(() => {
        setErrorValidation(null);
      }, 3000);
    } else {
      await AsyncStorage.setItem('last_store_name', formData.name);
      setSetShowQR(true);
    }
  };

  const handleOnBlurInput = async (
    e: NativeSyntheticEvent<TextInputFocusEventData>,
  ) => {
    if (formData.name) {
      setUserExist(await HiveUtils.checkIfUserExists(formData.name));
    }
  };

  const handleSetMemo = (value: string) => {
    setData({...formData, memo: value});
    setMemo(value);
  };

  const handleResetForm = () => {
    handleSetMemo('');
    setSetShowQR(false);
  };

  //TODO here:
  //  - clean up
  //  - Rather than a small message on the QR code page, create a new screen for successful payment
  //  - verify it scales well on bigger devices(is there a way to do this online?? or using an actual method, research)
  //  - NativeBase probably provides these icons and list format
  //  - make a new page for this accessible from a "History" icon on the top right corner. The page just displays a list of the payment requested and theri status, show a checkmark or cross for status. If succeeded, show the username of the payer. If failed, can unroll to show the qr code again.
  //    - analyze this part, it needs an asynstorage handler:
  // -> async storage handler.
  //    -> structure the op + data for each record.
  //    -> add op + status. how to check??
  //      -> besides op + status add: hiveUri, as this way can be re-generated.
  //    -> re-do QR if needed.
  //    -> delete.
  //  -> maybe also adding a way to import/export data?
  //  - important check why//how to solve error:
  //    -> Invariant Violation: TurboModuleRegistry.getEnforcing(...): 'RNShare' could not be found. Verify that a module by this name is registered in the native binary., js engine: hermes

  return (
    <ScreenLayout>
      <VStack width="90%" mx="3" maxW="300px" mt={60}>
        {!showQR && (
          <>
            <Heading bold>New Invoice</Heading>
            <FormControl isRequired isInvalid={!userExist}>
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
                onBlur={handleOnBlurInput}
              />

              <FormControl.ErrorMessage
                leftIcon={<WarningOutlineIcon size="xs" />}>
                Username not found in Hive!
              </FormControl.ErrorMessage>
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
                onChangeText={value => handleSetMemo(value)}
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
            goBack={() => handleResetForm()}
            {...props}
          />
        )}
      </VStack>
    </ScreenLayout>
  );
};
