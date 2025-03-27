import { HomeScreenProps } from "@/app/Home";
import logo from "@/assets/images/ic_launcher.png";
import { Colors } from "@/constants/Colors";
import { HiveUtils } from "@/utils/Hive.utils";
import { translate } from "@/utils/Localization.utils";
import { AsyncStorageUtils } from "@/utils/Storage.utils";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Operation, TransferOperation } from "@hiveio/dhive";
import { useRouter } from "expo-router";
import * as Sharing from "expo-sharing";
import { encodeOp, encodeOps } from "hive-uri";
import moment from "moment";
import { Button, Heading, HStack, Icon, Link, Text, VStack } from "native-base";
import React, { useEffect } from "react";
import { BackHandler, Platform, StyleSheet, View } from "react-native";
import { Pressable } from "react-native-gesture-handler";
import QRCode from "react-native-qrcode-svg";
import AlertBox from "./AlertBox";

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

const HiveQRCode = ({ ops, op, goBack, ...props }: Props) => {
  const [confirmed, setConfirmed] = React.useState(false);
  const [countDown, setCountdown] = React.useState(5);
  const [timer, setTimer] = React.useState<NodeJS.Timeout>();
  const [operation, setOperation] = React.useState<TransferOperation | null>(
    null
  );
  const [showAlertBox, setShowAlertBox] = React.useState(false);
  const [error, setError] = React.useState<any>(null);
  const [encodedOp, setEncodedOp] = React.useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        setShowAlertBox(true);
        return true;
      }
    );

    return () => backHandler.remove();
  }, []);

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
    AsyncStorageUtils.addInvoice({
      from: "",
      to: op?.[1].to!,
      amount: op?.[1].amount! as string,
      memo: op?.[1].memo!,
      confirmed: false,
      createdAt: moment().unix().toString(),
    });
    setTimer(
      setInterval(() => setCountdown((prevCount) => prevCount - 1), 1000)
    );
  }, [op, ops]);

  React.useEffect(() => {
    init();
    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, []);

  const resetTimer = React.useCallback(() => {
    if (timer) {
      clearInterval(timer);
      setTimer(undefined);
    }
  }, [setTimer, timer]);

  const checkConfirmation = React.useCallback(async () => {
    const { to, memo, amount } = (op as TransferOperation)[1];
    const lastTransfers = await HiveUtils.getLastTransactionsOnUser(to);
    const found = lastTransfers.find(
      (tr: any) => tr && tr.memo === memo && tr.amount === amount
    );
    if (found) {
      setConfirmed(true);
      resetTimer();
      await AsyncStorageUtils.updateInvoice(memo, found.from, true);
      const confirmedInvoice = await AsyncStorageUtils.getInvoice(memo);
      if (confirmedInvoice) {
        router.push({
          pathname: "/InvoiceSuccess",
          params: {
            confirmedOperation: JSON.stringify({
              from: confirmedInvoice.from,
              to: confirmedInvoice.to,
              amount: confirmedInvoice.amount,
              memo: confirmedInvoice.memo,
              updatedAt: confirmedInvoice.updatedAt,
              createdAt: confirmedInvoice.createdAt,
            }),
          },
        });
      } else {
        setError(new Error(translate("error.read_invoice_memory")));
      }
    }
  }, [op, props.navigation, resetTimer]);

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
    <VStack width={"100%"} padding={5} alignSelf={"center"}>
      {encodedOp && !confirmed && operation && (
        <VStack space={1} alignItems={"center"}>
          <Heading fontSize="xl" mb={30}>
            {translate("common.scan_qr_code")}
          </Heading>
          <QRCode
            value={encodedOp}
            logo={logo}
            logoSize={30}
            size={200}
            logoBackgroundColor="transparent"
          />
          <Pressable
            onPress={() => {
              const message = `@${operation[1].to} sent you a ${operation[1].amount} invoice. Follow this link to pay in Keychain:`;
              const url = encodedOp.replace(
                "hive://sign/op/",
                "https://hive-keychain.com/#invoice/"
              );
              const title = "Keychain Store Invoice";
              const icon = "data:image/png;base64,"; // TODO: fix : + qrCodeBase64;
              const options = Platform.select({
                ios: {
                  activityItemSources: [
                    {
                      // For using custom icon instead of default text icon at share preview when sharing with message.
                      placeholderItem: {
                        type: "url",
                        content: icon,
                      },
                      item: {
                        default: {
                          type: "text",
                          content: `${message} 
                          
${url}`,
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
              //TODO: Fix this
              Sharing.shareAsync(url, {});
            }}
            style={styles.touchable}
          >
            <Icon
              as={<MaterialIcons name="share" />}
              size={4}
              ml="2"
              mt="2"
              color="black"
            />
            <Text fontSize={"xl"} style={styles.bold}>
              {translate("common.share")}
            </Text>
          </Pressable>
          <VStack maxWidth="90%" mt={5}>
            <HStack style={styles.info} justifyContent={"space-between"}>
              <Text fontSize="md" fontWeight={"bold"}>
                {translate("common.to")}:
              </Text>
              <Text fontSize="md">@{operation[1].to}</Text>
            </HStack>
            <HStack style={styles.info} justifyContent={"space-between"}>
              <Text fontSize="md" fontWeight={"bold"}>
                {translate("common.amount")}:
              </Text>
              <Text fontSize="md">{operation[1].amount as string}</Text>
            </HStack>
            <HStack justifyContent={"space-between"}>
              <Text fontSize="md" fontWeight={"bold"}>
                {translate("common.memo")}:
              </Text>
              <Text fontSize="md">{operation[1].memo}</Text>
            </HStack>
            <Text fontSize="md" mt={30} textAlign={"center"}>
              {translate("common.checking_confirmation", {
                countDown: countDown.toString(),
              })}
            </Text>
          </VStack>
          <View style={{ marginTop: 30, width: "100%" }}>
            <Button
              onPress={() => setShowAlertBox(true)}
              backgroundColor={Colors.light.textInverse}
              _text={{
                color: Colors.light.text,
              }}
            >
              {translate("common.cancel_invoice")}
            </Button>
          </View>
          <AlertBox
            show={showAlertBox}
            alertHeader={translate("common.alert_cancel_title")}
            alertBodyMessage={translate("common.alert_cancel_body")}
            onCancelHandler={() => setShowAlertBox(false)}
            onProceedHandler={() => handleCancel()}
            buttonProceedTitle={translate("common.proceed")}
            buttonCancelTitle={translate("common.cancel")}
          />
        </VStack>
      )}
      {error && (
        <VStack space={2} justifyContent={"center"} alignItems={"center"}>
          <Text textAlign={"center"} color={"red.400"}>
            {error.message}
          </Text>
          <Link onPress={() => handleCancel()}>
            {translate("navigation.link_go_home")}
          </Link>
        </VStack>
      )}
    </VStack>
  );
};

const styles = StyleSheet.create({
  touchable: {
    flexDirection: "row",
    width: 100,
    justifyContent: "space-around",
    marginTop: 10,
  },
  bold: { fontWeight: "bold" },
  info: {
    marginBottom: 10,
    borderBottomColor: Colors.light.secondaryCardBgColor,
    borderBottomWidth: 1,
    paddingBottom: 10,
  },
});

export default HiveQRCode;
