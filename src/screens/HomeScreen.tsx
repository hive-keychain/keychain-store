import {TransferOperation} from '@hiveio/dhive';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {DrawerScreenProps} from '@react-navigation/drawer';
import {
  Button,
  CheckIcon,
  FormControl,
  HStack,
  Heading,
  Icon,
  Input,
  InputGroup,
  Pressable,
  Select,
  Stack,
  Text,
  VStack,
  WarningOutlineIcon,
} from 'native-base';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {NativeSyntheticEvent, TextInputFocusEventData} from 'react-native';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import HiveQRCode from '../components/HiveQRCode';
import ScreenLayout from '../components/ScreenLayout';
import {memoPrefix} from '../constants/prefix';
import {MainDrawerParamList} from '../types/navigation.types';
import {AsyncStorageKey} from '../utils/asyncstorage';
import {HiveUtils} from '../utils/hive';
import {generateMemo} from '../utils/memo';

export type HomeScreenProps = DrawerScreenProps<MainDrawerParamList, 'Home'>;

export default (props: HomeScreenProps) => {
  const {t} = useTranslation();
  const [formData, setData] = React.useState({
    name: '',
    amount: '',
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
  const [completeMemoPrefix, setMemoPrefix] = React.useState('');

  const handleResetForm = () => {
    handleSetMemo('');
    setSetShowQR(false);
  };

  React.useEffect(() => {
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const init = async () => {
    setMemoPrefix(memoPrefix + generateMemo(12) + ' ');
    const lastStoreName = await AsyncStorage.getItem(
      AsyncStorageKey.LAST_STORE_NAME,
    );
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
      handlerSubmitData(
        reconfirmationStore,
        reconfirmationAmount.split(' ')[0],
        reconfirmationMemo,
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.route.params]);

  const handlerSubmitData = async (
    name: string,
    amount: string,
    memo: string,
  ) => {
    if (
      name.trim().length === 0 ||
      amount.trim().length === 0 ||
      (completeMemoPrefix + memo).trim().length === 0 ||
      !userExist
    ) {
      setErrorValidation(t('error:missing_fields'));
      setTimeout(() => {
        setErrorValidation(null);
      }, 3000);
    } else {
      await AsyncStorage.setItem(
        AsyncStorageKey.LAST_STORE_NAME,
        formData.name,
      );
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
      <VStack width="100%">
        {!showQR && (
          <VStack width="100%" maxW="300px" mx={'3'} alignSelf={'center'}>
            <Heading bold>{t('common:new_invoice')}</Heading>
            <FormControl isRequired isInvalid={!userExist}>
              <FormControl.Label
                _text={{
                  bold: true,
                }}>
                {t('common:shop_username')}
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
                autoCapitalize="none"
                placeholder={t('common:my_awesome_shop_placeholder')}
                isDisabled={lock}
                onChangeText={value => setData({...formData, name: value})}
                value={formData.name}
                onBlur={handleOnBlurInput}
                isReadOnly={lock}
                fontSize={'sm'}
              />

              <FormControl.ErrorMessage
                leftIcon={<WarningOutlineIcon size="xs" />}>
                {t('error:missing_hive_user')}
              </FormControl.ErrorMessage>
            </FormControl>
            <FormControl isRequired>
              <FormControl.Label
                _text={{
                  bold: true,
                }}>
                {t('common:amount')}
              </FormControl.Label>
              <InputGroup>
                <Input
                  keyboardType="decimal-pad"
                  placeholder={t('common:amount_placeholder')}
                  width="50%"
                  onChangeText={value =>
                    setData({...formData, amount: value.replace(',', '.')})
                  }
                  value={formData.amount}
                  fontSize={'sm'}
                  returnKeyType="done"
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
                  onValueChange={itemValue => setCurrency(itemValue)}
                  fontSize={'sm'}>
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
                {t('common:memo')}
              </FormControl.Label>
              <Stack alignItems={'center'} w={'100%'}>
                <InputGroup
                  w={{
                    base: '100%',
                  }}>
                  <Input
                    InputLeftElement={
                      <HStack
                        space={'1.5'}
                        h={'100%'}
                        alignItems={'center'}
                        backgroundColor="red"
                        mr={'0'}
                        pr={'0'}>
                        <Icon
                          as={<Icon2 name="note" />}
                          size={5}
                          ml="2"
                          color="muted.400"
                        />
                        <Text fontSize={'sm'} mr={'-2.5'}>
                          {completeMemoPrefix}
                        </Text>
                      </HStack>
                    }
                    placeholder={t('common:my_awesome_shop_placeholder')}
                    value={memo}
                    onChangeText={value => handleSetMemo(value)}
                    w={'100%'}
                    fontSize={'sm'}
                  />
                </InputGroup>
              </Stack>
            </FormControl>
            <Button
              onPress={() => {
                handlerSubmitData(formData.name, formData.amount, memo);
              }}
              mt="50"
              colorScheme="cyan">
              {t('common:submit')}
            </Button>
            {errorValidation && (
              <VStack mt={4} alignItems={'center'}>
                <Text>{errorValidation}</Text>
              </VStack>
            )}
          </VStack>
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
                  memo: completeMemoPrefix + memo,
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
