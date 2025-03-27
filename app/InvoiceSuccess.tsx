import ScreenLayout from "@/components/ScreenLayout";
import { translate } from "@/utils/Localization.utils";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useLocalSearchParams, useRouter } from "expo-router";
import moment from "moment";
import {
  ArrowForwardIcon,
  CheckCircleIcon,
  HStack,
  Heading,
  Icon,
  Link,
  Text,
  VStack,
} from "native-base";
import React from "react";

type Props = {};

export default ({}: Props) => {
  const params = useLocalSearchParams();
  const { createdAt, updatedAt, from, to, amount, memo } = JSON.parse(
    params.confirmedOperation as string
  );
  const router = useRouter();
  return (
    <ScreenLayout>
      <VStack
        width="100%"
        mx={"30"}
        padding={8}
        alignSelf={"center"}
        height="80%"
        mt="10%"
        h={"90%"}
      >
        {" "}
        <HStack
          space={"1"}
          alignItems={"center"}
          justifyContent={"center"}
          marginBottom={10}
        >
          <CheckCircleIcon size="5" mt="0.5" color="emerald.500" />
          <Heading>{translate("common.payment_success")}</Heading>
        </HStack>
        {params && params.confirmedOperation && (
          <>
            <HStack justifyContent={"space-between"}>
              <Text fontWeight={"bold"}>{translate("common.confirmed")}:</Text>
              <Text>{moment.unix(Number(updatedAt)).format("lll")}</Text>
            </HStack>
            <HStack justifyContent={"space-between"}>
              <Text bold>{translate("common.from")}:</Text>
              <Text>@{from}</Text>
            </HStack>
            <HStack justifyContent={"space-between"}>
              <Text bold>{translate("common.to")}:</Text>
              <Text>@{to}</Text>
            </HStack>
            <HStack justifyContent={"space-between"}>
              <Text bold>{translate("common.amount")}:</Text>
              <Text>{amount}</Text>
            </HStack>
            <HStack justifyContent={"space-between"}>
              <Text bold>{translate("common.memo")}:</Text>
              <Text textAlign={"center"}>{memo}</Text>
            </HStack>
            <HStack justifyContent={"space-between"}>
              <Text fontWeight={"bold"}>{translate("common.created")}:</Text>
              <Text>{moment.unix(Number(createdAt)).format("lll")}</Text>
            </HStack>
          </>
        )}
        <HStack
          justifyContent={"space-between"}
          marginTop={20}
          alignContent={"center"}
        >
          <Link
            onPress={() => router.navigate({ pathname: "/HistoryInvoices" })}
          >
            <Icon
              as={<MaterialIcons name="list" />}
              size={5}
              mr="0.5"
              color="muted.400"
            />
            {translate("navigation.check_in_history")}
          </Link>
          <Link onPress={() => router.navigate({ pathname: "/Home" })}>
            <ArrowForwardIcon size="5" mt="0.5" mr="0.5" color="emerald.500" />
            {translate("navigation.next_invoice")}
          </Link>
        </HStack>
      </VStack>
    </ScreenLayout>
  );
};
