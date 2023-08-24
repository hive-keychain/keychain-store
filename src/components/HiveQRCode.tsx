import {Operation, TransferOperation} from '@hiveio/dhive';
import {encodeOp, encodeOps} from 'hive-uri';
import moment from 'moment';
import {
  Box,
  Button,
  HStack,
  Image,
  Link,
  Text,
  Toast,
  VStack,
} from 'native-base';
import React from 'react';
import {useTranslation} from 'react-i18next';
import RNQRGenerator from 'rn-qr-generator';
import {memoPrefix} from '../constants/prefix';
import {HomeScreenProps} from '../screens/HomeScreen';
import {AsyncStorageUtils} from '../utils/asyncstorage';
import {HiveUtils} from '../utils/hive';
import AlertBox from './AlertBox';
import Loader from './Loader';

type Op = {
  ops?: never;
  op: Operation;
};

type Ops = {
  op?: never;
  ops: Operation[];
};

type Props = {
  goBack: () => void;
} & (Op | Ops) &
  HomeScreenProps;

const HiveQRCode = ({ops, op, goBack, ...props}: Props) => {
  const {t} = useTranslation();
  const [qrCodeImg, setQrCodeImg] = React.useState<string | null>(null);
  const [confirmed, setConfirmed] = React.useState(false);
  const [countDown, setCountdown] = React.useState(5);
  const [timer, setTimer] = React.useState<NodeJS.Timer | null>(null);
  const [operation, setOperation] = React.useState<TransferOperation | null>(
    null,
  );
  const [showAlertBox, setShowAlertBox] = React.useState(false);
  const [error, setError] = React.useState<any>(null);

  const init = React.useCallback(() => {
    let value;
    if (ops) {
      value = encodeOps(ops);
      //TODO to complete when needed for multiple operations.
    } else if (op) {
      op[1].memo = memoPrefix + op[1].memo;
      value = encodeOp(op);
      setOperation(op as TransferOperation);
    }
    RNQRGenerator.generate({
      value: value!,
      height: 500,
      width: 500,
      correctionLevel: 'H',
    })
      .then(async response => {
        const {uri} = response;
        setQrCodeImg(uri);
        await AsyncStorageUtils.addInvoice({
          from: '',
          to: op?.[1].to!,
          amount: op?.[1].amount! as string,
          memo: op?.[1].memo!,
          confirmed: false,
          createdAt: moment().unix().toString(),
        });
        setTimer(
          setInterval(() => setCountdown(prevCount => prevCount - 1), 1000),
        );
      })
      .catch((errorQR: any) => {
        console.log(t('error:cannot_create_qr_code'), errorQR);
        setError(errorQR);
      });
  }, [op, ops, t]);

  React.useEffect(() => {
    init();
    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resetTimer = React.useCallback(() => {
    if (timer) {
      clearInterval(timer);
      setTimer(null);
    }
  }, [setTimer, timer]);

  const checkConfirmation = React.useCallback(async () => {
    const {to, memo, amount} = (op as TransferOperation)[1];
    const lastTransfers = await HiveUtils.getLastTransactionsOnUser(to);
    const found = lastTransfers.find(
      (tr: any) => tr && tr.memo === memo && tr.amount === amount,
    );
    if (found) {
      setConfirmed(true);
      resetTimer();
      await AsyncStorageUtils.updateInvoice(memo, found.from, true);
      const confirmedInvoice = await AsyncStorageUtils.getInvoice(memo);
      if (confirmedInvoice) {
        Toast.show({
          render: () => {
            return (
              <Box bg="emerald.500" px="2" py="1" rounded="sm" mb={5}>
                {t('common:toast_confirmed_invoice')} {confirmedInvoice.amount}
              </Box>
            );
          },
          duration: 5000,
          placement: 'top',
        });
        props.navigation.reset({
          index: 0,
          routes: [
            {
              name: 'InvoiceSuccess',
              params: {
                confirmedOperation: {
                  from: confirmedInvoice.from,
                  to: confirmedInvoice.to,
                  amount: confirmedInvoice.amount,
                  memo: confirmedInvoice.memo,
                  updatedAt: confirmedInvoice.updatedAt,
                  createdAt: confirmedInvoice.createdAt,
                },
              },
            },
          ],
        });
      } else {
        setError(new Error(t('error:read_invoice_memory')));
      }
    }
  }, [op, props.navigation, resetTimer, t]);

  React.useEffect(() => {
    if (countDown === 0) {
      setCountdown(5);
      checkConfirmation();
    }
  }, [checkConfirmation, countDown]);

  const handleCancel = () => {
    setOperation(null);
    resetTimer();
    goBack();
  };

  return (
    <VStack>
      {!qrCodeImg && !confirmed && <Text>{t('common:generating')}</Text>}
      {qrCodeImg && !confirmed && operation && (
        <VStack space={1} alignItems={'center'}>
          <Text fontSize={25} fontWeight={'bold'}>
            {t('common:scan_qr_code')}
          </Text>
          <Image
            source={{
              uri: qrCodeImg,
            }}
            alt="Alternate Text"
            size={'2xl'}
            resizeMethod="auto"
          />
          <VStack>
            <HStack justifyContent={'space-between'}>
              <Text fontWeight={'bold'}>{t('common:to')}:</Text>
              <Text>@{operation[1].to}</Text>
            </HStack>
            <HStack justifyContent={'space-between'}>
              <Text fontWeight={'bold'}>{t('common:amount')}:</Text>
              <Text>{operation[1].amount as string}</Text>
            </HStack>
            <VStack>
              <Text fontWeight={'bold'}>{t('common:memo')}:</Text>
              <Text textAlign={'center'}>{operation[1].memo}</Text>
            </VStack>
            <Text mt={15} textAlign={'center'}>
              {t('common:checking_confirmation', {
                countDown: countDown.toString(),
              })}
            </Text>
          </VStack>
          <HStack space={2} mt={30}>
            <Button onPress={() => setShowAlertBox(true)}>
              {t('common:cancel_invoice')}
            </Button>
          </HStack>
          <AlertBox
            show={showAlertBox}
            alertHeader={t('common:alert_cancel_title')}
            alertBodyMessage={t('common:alert_cancel_body')}
            onCancelHandler={() => setShowAlertBox(false)}
            onProceedHandler={() => handleCancel()}
            buttonProceedTitle={t('common:proceed')}
            buttonCancelTitle={t('common:cancel')}
          />
        </VStack>
      )}
      {qrCodeImg && confirmed && !error && <Loader fontSize={'lg'} />}
      {error && (
        <VStack space={2} justifyContent={'center'} alignItems={'center'}>
          <Text textAlign={'center'} color={'red.400'}>
            {error.message}
          </Text>
          <Link onPress={() => handleCancel()}>{t('common:link_go_home')}</Link>
        </VStack>
      )}
    </VStack>
  );
};

export default HiveQRCode;
