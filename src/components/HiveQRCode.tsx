import {Operation, TransferOperation} from '@hiveio/dhive';
import {encodeOp, encodeOps} from 'hive-uri';
import {Button, HStack, Image, Text, VStack} from 'native-base';
import React from 'react';
import Share from 'react-native-share';
import RNQRGenerator from 'rn-qr-generator';
import {HiveUtils} from '../utils/hive';

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

  React.useEffect(() => {
    let value;
    if (ops) {
      value = encodeOps(ops);
    } else if (op) {
      console.log({op}); //TODO remove line
      value = encodeOp(op);
      setOperation(op as TransferOperation);
    }
    RNQRGenerator.generate({
      value: value!,
      height: 100,
      width: 100,
      correctionLevel: 'H',
    })
      .then(response => {
        const {uri, width, height, base64} = response;
        console.log({imageUri: uri});
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
    //check if transfer done to
    const shopAccount = op?.[1].to as TransferOperation;
    const memoToFind = op?.[1].memo as TransferOperation;
    const amountToFind = op?.[1].amount as TransferOperation;
    const transactions = await HiveUtils.client.call(
      'condenser_api',
      'get_account_history',
      [shopAccount, -1, 10],
    );
    // console.log({transactions});
    const lastTransfers: any[] = transactions.map((e: any) => {
      let specificTransaction = null;
      switch (e[1].op[0]) {
        case 'transfer': {
          specificTransaction = e[1].op[1];
          break;
        }
      }
      return specificTransaction;
    });
    // console.log({lastTransfers}); //TODO clean up
    console.log('to check: ', {memoToFind, amountToFind});
    const found = lastTransfers.find(
      (tr: any) => tr && tr.memo === memoToFind && tr.amount === amountToFind,
    );
    if (found) {
      setConfirmed(true);
      resetTimer();
      console.log({found, memo: memoToFind});
      //TODO show previous screen
    }
  };

  const resetTimer = () => {
    if (timer) {
      clearInterval(timer);
      setTimer(null);
    }
  };

  const handleGoback = () => {
    setOperation(null);
    resetTimer();
    goBack();
  };

  const handleSharingOptions = async () => {
    //TODO check if it works..
    const shareOptions = {
      url: qrCodeImg as string,
      failOnCancel: false,
      message: 'Share Invoice',
      title: 'Share Invoice',
    };
    try {
      const ShareResponse = await Share.open(shareOptions);
      console.log('Result =>', ShareResponse);
    } catch (error) {
      console.log('Error =>', error);
    }
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
          />
          {/* //TODO add options to share this QR as image: whatsapp, savefile, etc. */}
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
            <Button onPress={handleSharingOptions}>Share Options</Button>
            <Button onPress={handleGoback}>Cancel</Button>
          </HStack>
        </VStack>
      )}
    </VStack>
  );
};

export default HiveQRCode;
