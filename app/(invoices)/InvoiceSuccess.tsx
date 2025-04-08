import ScreenLayout from "@/components/ScreenLayout";
import { Colors } from "@/constants/Colors";
import { translate } from "@/utils/Localization.utils";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import moment from "moment";
import { Button, HStack, Heading, Text, VStack } from "native-base";
import React from "react";
import { StyleSheet } from "react-native";
import Success from "../../assets/images/success.svg";

type Props = {};

export default ({}: Props) => {
  const params = useLocalSearchParams();
  const navigation = useNavigation();

  const { createdAt, updatedAt, from, to, amount, memo } = JSON.parse(
    params.confirmedOperation as string
  );
  const router = useRouter();
  return (
    <ScreenLayout>
      <VStack
        width="100%"
        padding={8}
        h="100%"
        alignSelf={"center"}
        justifyContent={"center"}
      >
        <VStack
          space={"5"}
          alignItems={"center"}
          justifyContent={"center"}
          marginBottom={10}
        >
          <Success />
          <Heading>{translate("common.payment_success")}</Heading>
        </VStack>
        {params && params.confirmedOperation && (
          <>
            <HStack justifyContent={"space-between"} style={styles.info}>
              <Text fontWeight={"bold"} fontSize={"md"}>
                {translate("common.created")}:
              </Text>
              <Text fontSize={"md"}>
                {moment.unix(Number(createdAt)).format("lll")}
              </Text>
            </HStack>
            <HStack justifyContent={"space-between"} style={styles.info}>
              <Text bold fontSize={"md"}>
                {translate("common.confirmed")}:
              </Text>
              <Text fontSize={"md"}>
                {moment.unix(Number(updatedAt)).format("lll")}
              </Text>
            </HStack>
            <HStack justifyContent={"space-between"} style={styles.info}>
              <Text bold fontSize={"md"}>
                {translate("common.from")}:
              </Text>
              <Text fontSize={"md"}>@{from}</Text>
            </HStack>
            <HStack justifyContent={"space-between"} style={styles.info}>
              <Text bold fontSize={"md"}>
                {translate("common.to")}:
              </Text>
              <Text fontSize={"md"}>@{to}</Text>
            </HStack>
            <HStack justifyContent={"space-between"} style={styles.info}>
              <Text bold fontSize={"md"}>
                {translate("common.amount")}:
              </Text>
              <Text fontSize={"md"}>{amount}</Text>
            </HStack>
            <HStack justifyContent={"space-between"} style={styles.info}>
              <Text bold fontSize={"md"}>
                {translate("common.memo")}:
              </Text>
              <Text textAlign={"center"} fontSize={"md"}>
                {memo}
              </Text>
            </HStack>
          </>
        )}
        <HStack
          justifyContent={"space-between"}
          marginTop={20}
          style={{ columnGap: 10 }}
          alignContent={"center"}
        >
          <Button
            onPress={() => {
              router.dismissAll();
              navigation.reset({
                index: 0,
                routes: [{ name: "Home" }],
              });
              router.navigate({ pathname: "/HistoryInvoices" });
            }}
            style={{ flex: 1 }}
            _text={{ color: Colors.light.text }}
            color={Colors.light.text}
            backgroundColor={Colors.light.textInverse}
          >
            {translate("navigation.check_in_history")}
          </Button>
          <Button
            onPress={() => {
              router.dismissAll();
              navigation.reset({
                index: 0,
                routes: [{ name: "Home" }],
              });
              router.navigate({ pathname: "/Home" });
            }}
            style={{ flex: 1 }}
          >
            {translate("navigation.next_invoice")}
          </Button>
        </HStack>
      </VStack>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  info: {
    marginBottom: 8,
    borderBottomColor: Colors.light.secondaryCardBgColor,
    borderBottomWidth: 1,
    paddingBottom: 8,
  },
});
