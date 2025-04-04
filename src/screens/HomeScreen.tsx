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
import React, {useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {
  NativeSyntheticEvent,
  TextInputFocusEventData,
  View,
} from 'react-native';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import HiveQRCode from '../components/HiveQRCode';
import ScreenLayout from '../components/ScreenLayout';
import {memoPrefix} from '../constants/prefix';
import {MainDrawerParamList} from '../types/navigation.types';
import {AsyncStorageKey} from '../utils/asyncstorage';
import {HiveUtils} from '../utils/hive';
import {generateMemo} from '../utils/memo';

export type HomeScreenProps = DrawerScreenProps<MainDrawerParamList, 'Home'>;
type Quote = {
  btc: number;
  name: string;
  symbol: string;
};

export default (props: HomeScreenProps) => {
  const {t} = useTranslation();
  const [formData, setData] = React.useState({
    name: '',
    amount: '',
    memo: '',
  });
  const [lock, setLock] = React.useState(false);
  const [currency, setCurrency] = React.useState<string>();
  const [quoteCurrency, setQuoteCurrency] = React.useState<string>();
  const [quoteCurrencyList, setQuoteCurrencyList] = React.useState<Quote[]>([]);
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

  useEffect(() => {
    init(); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchQuote = async () => {
    // fetch from coingecko simple api
    const URL_HIVE_PRICE =
      'https://api.coingecko.com/api/v3/simple/price?ids=hive,hive_dollar&vs_currencies=btc';
    const URL_EXCHANGE_RATE = 'https://api.coingecko.com/api/v3/exchange_rates';
    const data = await Promise.all([
      fetch(URL_HIVE_PRICE),
      fetch(URL_EXCHANGE_RATE),
      HiveUtils.getHBDPrice(),
    ]);
    const json = await Promise.all([
      ...data.map(e => (typeof e !== 'number' ? e.json() : e)),
    ]);
    const list = [
      {btc: json[0].hive.btc, name: 'HIVE', symbol: 'HIVE'},
      {btc: json[0].hive.btc / json[2], name: 'HBD', symbol: 'HBD'},
    ];

    // console.log(
    //   '1 HIVE =' +
    //     json[0].hive.btc +
    //     ' BTC' +
    //     '- 1 BTC=' +
    //     1 / json[0].hive.btc +
    //     ' HIVE',
    // );
    // console.log(
    //   '1 HBD = ' + 1 / json[2] + 'HIVE' + '- 1 HIVE=' + json[2] + ' HBD',
    // );
    // console.log(
    //   '1 HBD = ' +
    //     json[0].hive.btc / json[2] +
    //     'BTC - 1 BTC=' +
    //     json[2] / json[0].hive.btc +
    //     'HBD',
    // );

    interface Rates {
      [key: string]: {
        type: string;
        value: number;
        name: string;
      };
    }
    const rates: Rates = json[1].rates;
    for (let [key, value] of Object.entries(rates).sort((a, b) => {
      // if name is euro or us dollar, put it first
      // if (a[1].name === 'US Dollar') {
      //   // console.log('1 USD = ' + 1 / a[1].value + 'BTC');
      //   // console.log('1 HIVE = ' + json[0].hive.btc * a[1].value + 'USD');
      //   // console.log(
      //   //   '1 HBD = ' + (json[0].hive.btc * a[1].value) / json[2] + 'USD',
      //   // );
      // }
      if (a[1].name === 'Euro' || a[1].name === 'US Dollar') {
        return -1;
      }
      if (b[1].name === 'Euro' || b[1].name === 'US Dollar') {
        return 1;
      }
      if (a[1].name < b[1].name) {
        return -1;
      }
      if (a[1].name > b[1].name) {
        return 1;
      }
      return 0;
    })) {
      if (value.type === 'fiat' && key !== 'vef') {
        list.push({btc: 1 / value.value, name: value.name, symbol: key});
      }
    }

    setQuoteCurrencyList(list);
  };

  const init = async () => {
    fetchQuote();
    setMemoPrefix(memoPrefix + generateMemo(12) + ' ');
    const [lastStoreName, lastQuoteCurrency, lastCurrency] =
      await AsyncStorage.multiGet([
        AsyncStorageKey.LAST_STORE_NAME,
        AsyncStorageKey.LAST_QUOTE_CURRENCY,
        AsyncStorageKey.LAST_CURRENCY,
      ]);
    setQuoteCurrency(lastQuoteCurrency[1] || 'HBD');
    setCurrency(lastCurrency[1] || 'HBD');

    if (lastStoreName) {
      setData({...formData, name: lastStoreName[1] || ''});
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

  const getQuotedAmount = () => {
    if (currency && formData.amount && quoteCurrency) {
      if (currency === quoteCurrency) {
        return formData.amount;
      } else {
        const quote = quoteCurrencyList.find(
          item => item.symbol === quoteCurrency,
        );
        const base = quoteCurrencyList.find(item => item.symbol === currency);
        if (quote && base) {
          return ((parseFloat(formData.amount) * quote.btc) / base.btc).toFixed(
            3,
          );
        } else {
          return '';
        }
      }
    } else {
      return '';
    }
  };

  const quotedAmount = getQuotedAmount();

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
                placeholder={t('common:shop_username')}
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
                  selectedValue={quoteCurrency}
                  focusable={false}
                  placeholder="Loading..."
                  minWidth="50%"
                  _selectedItem={{
                    endIcon: <CheckIcon size="5" />,
                  }}
                  onValueChange={itemValue => {
                    AsyncStorage.setItem(
                      AsyncStorageKey.LAST_QUOTE_CURRENCY,
                      itemValue,
                    );
                    setQuoteCurrency(itemValue);
                  }}
                  fontSize={'xs'}>
                  {quoteCurrencyList.map(item => (
                    <Select.Item label={item.name} value={item.symbol} />
                  ))}
                </Select>
              </InputGroup>
              <View style={{height: 10}} />
              <InputGroup>
                <Input
                  minWidth="50%"
                  isReadOnly
                  focusable={false}
                  value="Paid with"
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
                  onValueChange={itemValue => {
                    AsyncStorage.setItem(
                      AsyncStorageKey.LAST_CURRENCY,
                      itemValue,
                    );
                    setCurrency(itemValue);
                  }}
                  fontSize={'xs'}>
                  <Select.Item label="HIVE" value="HIVE" />
                  <Select.Item label="HBD" value="HBD" />
                </Select>
              </InputGroup>
              <View style={{width: '100%', alignItems: 'flex-end'}}>
                <Text alignItems="flex-end">
                  {quotedAmount
                    ? `= ${quotedAmount} ${currency?.toUpperCase()}`
                    : ''}
                </Text>
              </View>
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
                  amount:
                    Number(quotedAmount).toFixed(3) +
                    ' ' +
                    currency!.toUpperCase(),
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
