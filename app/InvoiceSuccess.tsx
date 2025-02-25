import ScreenLayout from "@/components/ScreenLayout";
import { translate } from "@/utils/Localization.utils";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { DrawerScreenProps } from "@react-navigation/drawer";
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
import { MainDrawerParamList } from "./_layout";

type Props = DrawerScreenProps<MainDrawerParamList, "InvoiceSuccess">;

export default ({ navigation, route }: Props) => {
  const { params } = route;

  return (
    <ScreenLayout>
      <VStack minWidth="70%" maxWidth={"90%"} space={3}>
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
              <Text>
                {moment
                  .unix(Number(params.confirmedOperation.updatedAt))
                  .format("lll")}
              </Text>
            </HStack>
            <HStack justifyContent={"space-between"}>
              <Text bold>{translate("common.from")}:</Text>
              <Text>@{params.confirmedOperation.from}</Text>
            </HStack>
            <HStack justifyContent={"space-between"}>
              <Text bold>{translate("common.to")}:</Text>
              <Text>@{params.confirmedOperation.to}</Text>
            </HStack>
            <HStack justifyContent={"space-between"}>
              <Text bold>{translate("common.amount")}:</Text>
              <Text>{params.confirmedOperation.amount}</Text>
            </HStack>
            <HStack justifyContent={"space-between"}>
              <Text bold>{translate("common.memo")}:</Text>
              <Text textAlign={"center"}>{params.confirmedOperation.memo}</Text>
            </HStack>
            <HStack justifyContent={"space-between"}>
              <Text fontWeight={"bold"}>{translate("common.created")}:</Text>
              <Text>
                {moment
                  .unix(Number(params.confirmedOperation.createdAt))
                  .format("lll")}
              </Text>
            </HStack>
          </>
        )}
        <HStack
          justifyContent={"space-between"}
          marginTop={20}
          alignContent={"center"}
        >
          <Link onPress={() => navigation.navigate("History")} mb={2}>
            <Icon
              as={<MaterialIcons name="list" />}
              size={5}
              mr="0.5"
              color="muted.400"
            />
            {translate("navigation.check_in_history")}
          </Link>
          <Link onPress={() => navigation.navigate("Home")}>
            <ArrowForwardIcon size="5" mt="0.5" mr="0.5" color="emerald.500" />
            {translate("navigation.next_invoice")}
          </Link>
        </HStack>
      </VStack>
    </ScreenLayout>
  );
};
