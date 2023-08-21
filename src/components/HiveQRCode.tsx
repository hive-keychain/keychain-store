import {Operation, TransferOperation} from '@hiveio/dhive';
import {encodeOp, encodeOps} from 'hive-uri';
import {Button, HStack, Image, Text, VStack} from 'native-base';
import React from 'react';
import RNQRGenerator from 'rn-qr-generator';
import {AsyncStorageUtils} from '../utils/asyncstorage';
import {HiveUtils} from '../utils/hive';
import AlertBox from './AlertBox';

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
          createdAt: new Date().toISOString(),
        });
        setTimer(
          setInterval(() => setCountdown(prevCount => prevCount - 1), 1000),
        );
      })
      .catch(error => console.log('Cannot create QR code', error));
  }, [op, ops]);

  React.useEffect(() => {
    // let value;
    // if (ops) {
    //   value = encodeOps(ops);
    // } else if (op) {
    //   value = encodeOp(op);
    //   setOperation(op as TransferOperation);
    // }
    // RNQRGenerator.generate({
    //   value: value!,
    //   height: 500,
    //   width: 500,
    //   correctionLevel: 'H',
    // })
    //   .then(async response => {
    //     const {uri} = response;
    //     setQrCodeImg(uri);
    //     //save data into storage
    //     await AsyncStorageUtils.addInvoice({
    //       from: '', //as not know yet
    //       to: op?.[1].to!,
    //       amount: op?.[1].amount! as string,
    //       memo: op?.[1].memo!,
    //       confirmed: false,
    //       createdAt: new Date().toISOString(),
    //     });
    //     //start timming coountdown
    //     setTimer(
    //       setInterval(() => setCountdown(prevCount => prevCount - 1), 1000),
    //     );
    //   })
    //   .catch(error => console.log('Cannot create QR code', error));
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
      //@ts-ignore
      props.navigation.navigate('InvoiceSuccess', {
        confirmedOperation: {
          from: found.from,
          to: found.to,
          amount: found.amount,
          memo: found.memo,
        },
      });
      goBack();
    }
  }, [goBack, op, props, resetTimer]);

  React.useEffect(() => {
    if (countDown === 0) {
      setCountdown(5);
      checkConfirmation();
    }
  }, [checkConfirmation, countDown]);

  const handleCancel = () => {
    //TODO alert native base.
    setOperation(null);
    resetTimer();
    goBack(); //reset Form.setShowQR
  };

  return (
    <VStack
      alignItems={'center'}
      alignContent={'center'}
      justifyItems={'center'}>
      {!qrCodeImg && <Text>Generating...</Text>}
      {qrCodeImg && (
        <VStack space={1} alignItems={'center'}>
          <Text fontSize={25} pt={10} fontWeight={'bold'}>
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
          {!confirmed && operation && (
            <VStack>
              <Text>
                <Text fontWeight={'bold'}>To:</Text>@{operation[1].to}
              </Text>
              <Text>
                <Text fontWeight={'bold'}>Amount:</Text>{' '}
                {operation[1].amount as string}
              </Text>
              <Text>
                <Text fontWeight={'bold'}>Memo:</Text> {operation[1].memo}
              </Text>
              <Text mt={15} textAlign={'right'}>
                Checking for confirmation in {countDown} seconds
              </Text>
            </VStack>
          )}

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
    </VStack>
  );
};

export default HiveQRCode;
