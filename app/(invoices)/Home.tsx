import DropdownModal from "@/components/DropdownModal";
import OperationInput from "@/components/OperationInput";
import { Colors } from "@/constants/Colors";
import { memoPrefix } from "@/constants/Prefix";
import { HiveUtils } from "@/utils/Hive.utils";
import { translate } from "@/utils/Localization.utils";
import { generateMemo } from "@/utils/Memo.utils";
import { AsyncStorageKey } from "@/utils/Storage.utils";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DrawerScreenProps } from "@react-navigation/drawer";
import { router, SplashScreen, useLocalSearchParams } from "expo-router";
import SimpleToast from "react-native-simple-toast";

import ScreenLayout from "@/components/ScreenLayout";
import {
  Button,
  FormControl,
  HStack,
  Icon,
  Pressable,
  Stack,
  Text,
  WarningOutlineIcon,
} from "native-base";
import React, { useEffect } from "react";
import {
  KeyboardAvoidingView,
  NativeSyntheticEvent,
  Platform,
  StyleSheet,
  TextInputFocusEventData,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MainDrawerParamList } from "../_layout";

export type HomeScreenProps = DrawerScreenProps<MainDrawerParamList, "Home">;
type Quote = {
  btc: number;
  label: string;
  value: string;
};

export default (props: HomeScreenProps) => {
  const [name, setName] = React.useState("");
  const [amount, setAmount] = React.useState("");
  const [memo, setMemo] = React.useState("");
  const [lock, setLock] = React.useState(false);
  const [currency, setCurrency] = React.useState<string>();
  const [quoteCurrency, setQuoteCurrency] = React.useState<string>();
  const [quoteCurrencyList, setQuoteCurrencyList] = React.useState<Quote[]>([]);
  const [showQR, setShowQR] = React.useState(false);
  const [userExist, setUserExist] = React.useState(true);
  const [completeMemoPrefix, setMemoPrefix] = React.useState("");
  const [quotedAmount, setQuotedAmount] = React.useState("");
  const insets = useSafeAreaInsets();
  const local = useLocalSearchParams();
  const handleResetForm = () => {
    handleSetMemo("");
    setShowQR(false);
  };

  useEffect(() => {
    init();
  }, []);

  const fetchQuote = async () => {
    // fetch from coingecko simple api
    const URL_HIVE_PRICE =
      "https://api.coingecko.com/api/v3/simple/price?ids=hive,hive_dollar&vs_currencies=btc";
    const URL_EXCHANGE_RATE = "https://api.coingecko.com/api/v3/exchange_rates";
    const data = await Promise.all([
      fetch(URL_HIVE_PRICE),
      fetch(URL_EXCHANGE_RATE),
      HiveUtils.getHBDPrice(),
    ]);
    const json = await Promise.all([
      ...data.map((e) => (typeof e !== "number" ? e.json() : e)),
    ]);
    const list = [
      { btc: json[0].hive.btc, label: "HIVE", value: "HIVE" },
      { btc: json[0].hive.btc / json[2], label: "HBD", value: "HBD" },
    ];

    interface Rates {
      [key: string]: {
        type: string;
        value: number;
        name: string;
      };
    }
    const rates: Rates = json[1].rates;
    for (let [key, value] of Object.entries(rates).sort((a, b) => {
      if (a[1].name === "Euro" || a[1].name === "US Dollar") {
        return -1;
      }
      if (b[1].name === "Euro" || b[1].name === "US Dollar") {
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
      if (value.type === "fiat" && key !== "vef") {
        list.push({ btc: 1 / value.value, label: value.name, value: key });
      }
    }

    setQuoteCurrencyList(list);
  };

  const init = async () => {
    SplashScreen.hideAsync();
    fetchQuote();
    setMemoPrefix(memoPrefix + generateMemo(12) + " ");
    const [lastStoreName, lastQuoteCurrency, lastCurrency] =
      await AsyncStorage.multiGet([
        AsyncStorageKey.LAST_STORE_NAME,
        AsyncStorageKey.LAST_QUOTE_CURRENCY,
        AsyncStorageKey.LAST_CURRENCY,
      ]);
    setQuoteCurrency(lastQuoteCurrency[1] || "HBD");
    setCurrency(lastCurrency[1] || "HBD");
    setShowQR(false);

    if (lastStoreName) {
      setName(lastStoreName[1] || "");
      setLock(true);
    }
  };

  useEffect(() => {
    const reconfirmationParams: any = local;

    if (reconfirmationParams && reconfirmationParams.toConfirmOperation) {
      const {
        store: reconfirmationStore,
        memo: reconfirmationMemo,
        amount: reconfirmationAmount,
      } = JSON.parse(reconfirmationParams.toConfirmOperation);
      const reconfirmationCurrency = reconfirmationAmount.split(" ")[1];
      setCurrency(reconfirmationCurrency);
      setName(reconfirmationStore);
      setMemo(reconfirmationMemo);
      setAmount(reconfirmationAmount.split(" ")[0]);
      handlerSubmitData(
        reconfirmationStore,
        reconfirmationAmount.split(" ")[0],
        reconfirmationMemo
      );
    }
  }, [local.reconfirmationParams]);

  const handlerSubmitData = async (
    name: string,
    amount: string,
    memoString: string
  ) => {
    if (
      name.trim().length === 0 ||
      amount.trim().length === 0 ||
      (completeMemoPrefix + memoString).trim().length === 0 ||
      !userExist
    ) {
      SimpleToast.show(translate("error.missing_fields"), SimpleToast.LONG);
    } else {
      await AsyncStorage.setItem(AsyncStorageKey.LAST_STORE_NAME, name);
      router.navigate({
        pathname: "/(invoices)/QRCode",
        params: {
          transfer: JSON.stringify({
            amount:
              Number(quotedAmount).toFixed(3) + " " + currency!.toUpperCase(),
            to: name,
            memo: completeMemoPrefix + memo,
          }),
          props: JSON.stringify(props),
        },
      });
    }
  };

  const handleOnBlurInput = async (
    _e: NativeSyntheticEvent<TextInputFocusEventData>
  ) => {
    if (name) {
      setUserExist(await HiveUtils.checkIfUserExists(name));
    }
  };

  const handleSetMemo = (value: string) => {
    setMemo(value);
  };
  const getQuotedAmount = () => {
    if (currency && amount && quoteCurrency) {
      let parsedAmount = amount.replace(",", ".");
      if (currency === quoteCurrency) {
        return parsedAmount;
      } else {
        const quote = quoteCurrencyList.find(
          (item) => item.value === quoteCurrency
        );
        const base = quoteCurrencyList.find((item) => item.value === currency);
        if (quote && base) {
          return ((parseFloat(parsedAmount) * quote.btc) / base.btc).toFixed(3);
        } else {
          return "";
        }
      }
    } else {
      return "";
    }
  };
  useEffect(() => {
    setQuotedAmount(getQuotedAmount());
  }, [amount, currency, quoteCurrency]);

  return (
    <ScreenLayout>
      <View
        style={{
          width: "100%",
          padding: 8,
          paddingHorizontal: 20,
          flexGrow: 1,
          justifyContent: "space-around",
        }}
      >
        <KeyboardAvoidingView
          enabled={Platform.OS === "ios" ? true : false}
          behavior={"padding"}
          keyboardVerticalOffset={insets.bottom}
          style={{
            gap: 20,
          }}
        >
          <View style={{ gap: 20 }}>
            <FormControl isRequired isInvalid={!userExist}>
              <FormControl.Label
                _text={{
                  bold: true,
                }}
              >
                {translate("common.shop_username")}
              </FormControl.Label>
              <OperationInput
                autoCapitalize="none"
                placeholder={translate("common.shop_username")}
                disabled={lock}
                onChangeText={(value) => setName(value)}
                value={name}
                onBlur={handleOnBlurInput}
                readOnly={lock}
                leftIcon={
                  <Icon
                    as={<MaterialIcons name="person" s />}
                    tintColor={"red"}
                    size={5}
                    ml="2"
                    color={Colors.light.red}
                  />
                }
                rightIcon={
                  <Pressable onPress={() => setLock(!lock)}>
                    <Icon
                      as={
                        <MaterialIcons
                          name={lock ? "lock-outline" : "lock-open"}
                        />
                      }
                      size={5}
                      mr="2"
                      color={Colors.light.red}
                    />
                  </Pressable>
                }
              />

              <FormControl.ErrorMessage
                leftIcon={<WarningOutlineIcon size="xs" />}
              >
                {translate("error.missing_hive_user")}
              </FormControl.ErrorMessage>
            </FormControl>
            <FormControl isRequired>
              <FormControl.Label
                _text={{
                  bold: true,
                }}
              >
                {translate("common.amount")}
              </FormControl.Label>
              <View style={[styles.flexRowBetween]}>
                <OperationInput
                  labelInput="hi"
                  inputMode={Platform.OS === "ios" ? "decimal" : "numeric"}
                  keyboardType="numeric"
                  placeholder={translate("common.amount_placeholder")}
                  onChangeText={(value) => setAmount(value)}
                  value={amount}
                  returnKeyType="done"
                  additionalOuterContainerStyle={{
                    width: "40%",
                  }}
                />
                <DropdownModal
                  list={quoteCurrencyList}
                  dropdownTitle="common.currency"
                  selected={quoteCurrency || { value: "" }}
                  onSelected={(e) => {
                    setQuoteCurrency(e.value);
                  }}
                  selectedBgColor={Colors.light.red}
                />
              </View>

              <View style={styles.paidWith} />
            </FormControl>
            <FormControl isRequired>
              <FormControl.Label
                _text={{
                  bold: true,
                }}
              >
                {translate("common.paid_with")}
              </FormControl.Label>
              <View style={[styles.flexRowBetween]}>
                <OperationInput
                  readOnly
                  labelInput="1"
                  value={quotedAmount ? quotedAmount : ""}
                  additionalOuterContainerStyle={{
                    width: "40%",
                  }}
                />
                <DropdownModal
                  list={[
                    { label: "HIVE", value: "HIVE" },
                    { label: "HBD", value: "HBD" },
                  ]}
                  dropdownTitle="common.currency"
                  selected={currency || { value: "" }}
                  onSelected={(e) => {
                    setCurrency(e.value);
                  }}
                  selectedBgColor={Colors.light.red}
                />
              </View>
            </FormControl>
            <FormControl>
              <FormControl.Label
                _text={{
                  bold: true,
                }}
              >
                {translate("common.memo")}
              </FormControl.Label>
              <Stack alignItems={"center"} w={"100%"}>
                <OperationInput
                  autoCapitalize="none"
                  placeholder={translate("common.my_awesome_shop_placeholder")}
                  value={memo}
                  onChangeText={(value) => handleSetMemo(value)}
                  leftIcon={
                    <HStack
                      space={"1.5"}
                      h={"100%"}
                      alignItems={"center"}
                      backgroundColor="red"
                      mr={"0"}
                      pr={"1"}
                    >
                      <Icon
                        as={<MaterialIcons name="note" />}
                        size={5}
                        ml="2"
                        color={Colors.light.red}
                      />
                      <Text fontSize={"sm"} mr={"-2.5"}>
                        {completeMemoPrefix}
                      </Text>
                    </HStack>
                  }
                />
              </Stack>
            </FormControl>
          </View>
          <Button
            onPress={() => {
              handlerSubmitData(name, amount.replace(",", "."), memo);
            }}
            mt="50"
          >
            {translate("common.submit")}
          </Button>
        </KeyboardAvoidingView>
      </View>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  quote: { width: "100%", alignItems: "flex-end" },
  paidWith: { height: 10 },
  flexRowBetween: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    columnGap: 10,
  },
});
