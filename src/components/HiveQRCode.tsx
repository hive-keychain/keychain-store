import {Operation, TransferOperation} from '@hiveio/dhive';
import {encodeOp, encodeOps} from 'hive-uri';
import moment from 'moment';
import {Button, HStack, Image, Link, Text, VStack} from 'native-base';
import React from 'react';
import RNQRGenerator from 'rn-qr-generator';
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
} & (Op | Ops);

const HiveQRCode = ({ops, op, goBack, ...props}: Props) => {
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
    } else if (op) {
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
      .catch((error: any) => {
        console.log('Cannot create QR code', error);
        setError(error);
      });
  }, [op, ops]);

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
      console.log({found, memo}); //TODO remove...
      await AsyncStorageUtils.updateInvoice(memo, found.from, true);
      const confirmedInvoice = await AsyncStorageUtils.getInvoice(memo);
      if (confirmedInvoice) {
        //@ts-ignore
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
        setError(
          new Error('Cannot read Invoice from memory, please contact support!'),
        );
      }
    }
  }, [op, props, resetTimer]);

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
      {!qrCodeImg && !confirmed && <Text>Generating...</Text>}
      {qrCodeImg && !confirmed && operation && (
        <VStack space={1} alignItems={'center'}>
          <Text fontSize={25} fontWeight={'bold'}>
            Scan this QR Code
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
              <Text fontWeight={'bold'}>To:</Text>
              <Text>@{operation[1].to}</Text>
            </HStack>
            <HStack justifyContent={'space-between'}>
              <Text fontWeight={'bold'}>Amount:</Text>
              <Text>{operation[1].amount as string}</Text>
            </HStack>
            <HStack justifyContent={'space-between'}>
              <Text fontWeight={'bold'}>Memo:</Text>
              <Text>{operation[1].memo}</Text>
            </HStack>
            <Text mt={15} textAlign={'center'}>
              Checking for confirmation in {countDown} seconds
            </Text>
          </VStack>
          <HStack space={2} mt={30}>
            <Button onPress={() => setShowAlertBox(true)}>
              Cancel Invoice
            </Button>
          </HStack>
          <AlertBox
            show={showAlertBox}
            alertHeader="Do you want to cancel it?"
            alertBodyMessage="The invoice will still be visible in the History screen as not confirmed. You can restore it later on if you want."
            onCancelHandler={() => setShowAlertBox(false)}
            onProceedHandler={() => handleCancel()}
          />
        </VStack>
      )}
      {qrCodeImg && confirmed && !error && <Loader fontSize={'lg'} />}
      {error && (
        <VStack space={2} justifyContent={'center'} alignItems={'center'}>
          <Text textAlign={'center'} color={'red.400'}>
            {error.message}
          </Text>
          <Link onPress={() => handleCancel()}>Go home!</Link>
        </VStack>
      )}
    </VStack>
  );
};

export default HiveQRCode;
