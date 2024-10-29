import {Operation, TransferOperation} from '@hiveio/dhive';
import {encodeOp, encodeOps} from 'hive-uri';
import moment from 'moment';
import {Button, HStack, Icon, Image, Link, Text, VStack} from 'native-base';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {Platform} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Share from 'react-native-share';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import RNQRGenerator from 'rn-qr-generator';
import {HomeScreenProps} from '../screens/HomeScreen';
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
} & (Op | Ops) &
  HomeScreenProps;

const HiveQRCode = ({ops, op, goBack, ...props}: Props) => {
  const {t} = useTranslation();
  const [qrCodeImg, setQrCodeImg] = React.useState<string | null>(null);
  const [qrCodeBase64, setQrCodeBase64] = React.useState<string | undefined>();
  const [confirmed, setConfirmed] = React.useState(false);
  const [countDown, setCountdown] = React.useState(5);
  const [timer, setTimer] = React.useState<NodeJS.Timer | null>(null);
  const [operation, setOperation] = React.useState<TransferOperation | null>(
    null,
  );
  const [showAlertBox, setShowAlertBox] = React.useState(false);
  const [error, setError] = React.useState<any>(null);
  const [encodedOp, setEncodedOp] = React.useState<any>(null);

  const init = React.useCallback(() => {
    let value;
    if (ops) {
      value = encodeOps(ops);
      //TODO to complete when needed for multiple operations..
    } else if (op) {
      value = encodeOp(op);
      setEncodedOp(value);
      setOperation(op as TransferOperation);
    }
    RNQRGenerator.generate({
      value: value!,
      height: 500,
      width: 500,
      correctionLevel: 'H',
      base64: true,
    })
      .then(async response => {
        const {uri, base64} = response;
        setQrCodeBase64(base64);
        setQrCodeImg(uri);
        console.log('uri', uri);
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
    setQrCodeImg(null);
    resetTimer();
    goBack();
  };

  return (
    <VStack width={'100%'} maxW="350px" alignSelf={'center'}>
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
          <TouchableOpacity
            onPress={() => {
              const message = `@${operation[1].to} sent you a ${operation[1].amount} invoice. Follow this link to pay in Keychain:`;
              const url = encodedOp.replace(
                'hive://sign/op/',
                'https://hive-keychain.com/#invoice/',
              );
              const title = 'Keychain Store Invoice';
              const icon = 'data:image/png;base64,' + qrCodeBase64;
              const options = Platform.select({
                ios: {
                  activityItemSources: [
                    {
                      // For sharing url with custom title.
                      placeholderItem: {type: 'url', content: url},
                      item: {
                        default: {type: 'url', content: url},
                      },
                      subject: {
                        default: title,
                      },
                      linkMetadata: {originalUrl: url, url, title},
                    },
                    {
                      // For sharing text.
                      placeholderItem: {type: 'text', content: message},
                      item: {
                        default: {type: 'text', content: message},
                        message: null, // Specify no text to share via Messages app.
                      },
                      linkMetadata: {
                        // For showing app icon on share preview.
                        title: message,
                      },
                    },
                    {
                      // For using custom icon instead of default text icon at share preview when sharing with message.
                      placeholderItem: {
                        type: 'url',
                        content: icon,
                      },
                      item: {
                        default: {
                          type: 'text',
                          content: `${message} ${url}`,
                        },
                      },
                      linkMetadata: {
                        title: message,
                        icon: icon,
                      },
                    },
                  ],
                },
                default: {
                  title,
                  subject: title,
                  message,
                  url,
                },
              });
              //@ts-ignore
              Share.open(options);
            }}
            style={{
              flexDirection: 'row',
              width: 100,
              justifyContent: 'space-around',
              marginTop: 10,
            }}>
            <Icon
              as={<Icon2 name="share" />}
              size={5}
              ml="2"
              color="muted.400"
            />
            <Text style={{fontWeight: 'bold'}}>Share</Text>
          </TouchableOpacity>
          <VStack maxWidth="90%">
            <HStack justifyContent={'space-between'}>
              <Text fontWeight={'bold'}>{t('common:to')}:</Text>
              <Text>@{operation[1].to}</Text>
            </HStack>
            <HStack justifyContent={'space-between'}>
              <Text fontWeight={'bold'}>{t('common:amount')}:</Text>
              <Text>{operation[1].amount as string}</Text>
            </HStack>
            <HStack justifyContent={'space-between'}>
              <Text fontWeight={'bold'}>{t('common:memo')}:</Text>
              <Text>{operation[1].memo}</Text>
            </HStack>
            <Text mt={15} textAlign={'center'}>
              {t('common:checking_confirmation', {
                countDown: countDown.toString(),
              })}
            </Text>
          </VStack>
          <HStack space={2} mt={30}>
            <Button
              onPress={() => setShowAlertBox(true)}
              colorScheme={'danger'}>
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
