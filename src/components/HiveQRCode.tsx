import {Operation, TransferOperation} from '@hiveio/dhive';
import {encodeOp, encodeOps} from 'hive-uri';
import {Button, HStack, Image, Text, VStack} from 'native-base';
import React from 'react';
import RNQRGenerator from 'rn-qr-generator';
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
  withLogo?: boolean;
} & (Op | Ops);

const HiveQRCode = ({ops, op, withLogo = false, goBack, ...props}: Props) => {
  const [qrCodeImg, setQrCodeImg] = React.useState<string | null>(null);
  const [confirmed, setConfirmed] = React.useState(false);
  const [countDown, setCountdown] = React.useState(10);
  const [timer, setTimer] = React.useState<NodeJS.Timer | null>(null);
  const [operation, setOperation] = React.useState<TransferOperation | null>(
    null,
  );
  const [showAlertBox, setShowAlertBox] = React.useState(false);

  React.useEffect(() => {
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
      .then(response => {
        const {uri, width, height, base64} = response;
        console.log({imageUri: uri}); //TODO remove
        setQrCodeImg(uri);
        //start timming coountdown
        setTimer(
          setInterval(() => setCountdown(prevCount => prevCount - 1), 1000),
        );
      })
      .catch(error => console.log('Cannot create QR code', error));

    return () => {
      if (timer) clearInterval(timer);
    };
  }, []);

  React.useEffect(() => {
    if (countDown === 0) {
      setCountdown(10);
      checkConfirmation();
    }
  }, [countDown]);

  const checkConfirmation = async () => {
    const {to, memo, amount} = (op as TransferOperation)[1];
    const lastTransfers = await HiveUtils.getLastTransactionsOnUser(to);
    console.log('to check: ', {memo, amount}); //TODO remove line
    const found = lastTransfers.find(
      (tr: any) => tr && tr.memo === memo && tr.amount === amount,
    );
    if (found) {
      setConfirmed(true);
      resetTimer();
      console.log({found, memo}); //TODO remove...
      //TODO show next screen
    }
  };

  const resetTimer = () => {
    if (timer) {
      clearInterval(timer);
      setTimer(null);
    }
  };

  const handleCancel = () => {
    //TODO alert native base.
    setOperation(null);
    resetTimer();
    goBack(); //reset Form.setShowQR
  };

  return (
    <VStack space={1} alignItems={'center'}>
      {!qrCodeImg && <Text>Generating...</Text>}
      {qrCodeImg && (
        <VStack space={1} alignItems={'center'}>
          <Text>Request Transfer QRCode Generated</Text>
          <Image
            source={{
              uri: qrCodeImg,
            }}
            alt="Alternate Text"
            size={'2xl'}
            resizeMethod="auto"
          />
          {!confirmed && operation && (
            <VStack alignItems={'center'}>
              <Text>Waiting confirmation for</Text>
              <HStack space={1}>
                <Text>To: {operation[1].to}</Text>
                <Text>Amount: {operation[1].amount as string}</Text>
              </HStack>
              <Text>Memo: {operation[1].memo}</Text>
              <Text>Checking again in: {countDown} seconds.</Text>
            </VStack>
          )}
          {confirmed && (
            <Text color={'green.700'} bold size={'16'}>
              Success on Invoice!
            </Text>
          )}
          <Text color={confirmed ? 'green' : 'red'}>
            Confirmed: {confirmed.toString()}
          </Text>
          {/* //Options menu */}
          <HStack space={2}>
            {/* <ShareOptionsButton
              title="Share it"
              qrCodeImg={qrCodeImg}
              invoiceMemo={operation?.[1].memo}
            /> */}
            {/* //TODO bellow change for a AlertDialog asking if wants to cancel + info that will be lost. */}
            <Button onPress={() => setShowAlertBox(true)}>Cancel</Button>
          </HStack>
          <AlertBox
            show={showAlertBox}
            alertHeader="Do you want to cancel it?"
            alertBodyMessage="The invoice will still be visible in the History screen and it will be marked as 'cancelled by owner'. You can restore it later on if you want."
            onCancelHandler={() => setShowAlertBox(false)}
            onProceedHandler={() => handleCancel()}
          />
        </VStack>
      )}
    </VStack>
  );
};

export default HiveQRCode;
