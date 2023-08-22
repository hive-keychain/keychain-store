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

  const handleResetForm = () => {
    handleSetMemo('');
    setSetShowQR(false);
  };

  React.useEffect(() => {
    //TODO remove testing block
    // AsyncStorage.removeItem(AsyncStorageKey.INVOICE_HISTORY_LIST, error =>
    //   console.log({error}),
    // );
    //end remove block

    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const init = async () => {
    const lastStoreName = await AsyncStorage.getItem('last_store_name');
    if (lastStoreName) {
      setData({...formData, name: lastStoreName});
      setLock(true);
    }
  };

  React.useEffect(() => {
    const reconfirmationParams = props.route.params;
    if (
      reconfirmationParams &&
      reconfirmationParams.toConfirmOperation &&
      reconfirmationParams.toConfirmOperation.memo
    ) {
      if (showQR) {
        setSetShowQR(false);
      }
      const {
        store: reconfirmationStore,
        memo: reconfirmationMemo,
        amount: reconfirmationAmount,
      } = reconfirmationParams.toConfirmOperation;
      const reconfirmationCurrency = reconfirmationAmount.split(' ')[1];
      setCurrency(reconfirmationCurrency);
      setData({
        name: reconfirmationStore,
        memo: reconfirmationMemo,
        amount: reconfirmationAmount.split(' ')[0],
      });
      setMemo(reconfirmationMemo);
      console.log(
        'Here you can cehck if there is an actual invoice & cancel it!',
        {showQR},
      );
      handlerSubmitData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    _e: NativeSyntheticEvent<TextInputFocusEventData>,
  ) => {
    if (formData.name) {
      setUserExist(await HiveUtils.checkIfUserExists(formData.name));
    }
  };

  const handleSetMemo = (value: string) => {
    setData({...formData, memo: value});
    setMemo(value);
  };

  return (
    <ScreenLayout>
      <VStack width="100%" mx="3" maxW="300px">
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
                isReadOnly={lock}
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
            <FormControl isRequired>
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
