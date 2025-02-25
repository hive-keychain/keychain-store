import { MainDrawerParamList } from "@/app/_layout";
import { translate } from "@/utils/Localization.utils";
import { AsyncStorageUtils, InvoiceData } from "@/utils/Storage.utils";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { useNavigation } from "@react-navigation/native";
import moment from "moment";
import {
  Badge,
  Box,
  Button,
  Center,
  HStack,
  Link,
  Text,
  VStack,
} from "native-base";
import React from "react";
import { useTranslation } from "react-i18next";
import Avatar from "./Avatar";

interface Props {
  item: InvoiceData;
  reloadParent: () => void;
}

export default ({ item, reloadParent }: Props) => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = React.useState(false);
  const navigation = useNavigation<DrawerNavigationProp<MainDrawerParamList>>();

  const gotoHome = () => {
    navigation.navigate("Home", {
      toConfirmOperation: {
        store: item.to,
        memo: item.memo.replace("kcs-", ""),
        amount: item.amount,
      },
    });
  };

  const handleDelete = async (memo: string) => {
    if (memo && memo.trim().length !== 0) {
      await AsyncStorageUtils.deleteInvoice(memo);
      reloadParent();
    }
  };
  return (
    <Box
      w={"100%"}
      borderColor="muted.800"
      borderBottomWidth={0.3}
      mb={2}
      p={2}
    >
      <HStack justifyContent={"space-between"}>
        <Text>{moment.unix(Number(item.createdAt)).format("L")}</Text>
        <Text>{item.amount}</Text>
        <Badge colorScheme={item.confirmed ? "success" : "warning"}>
          {translate(`common.${item.confirmed ? "confirmed" : "unconfirmed"}`)}
        </Badge>
        <MaterialIcons
          name={isExpanded ? "expand-less" : "expand-more"}
          size={25}
          onPress={() => setIsExpanded(!isExpanded)}
        />
      </HStack>
      {isExpanded && (
        <Box w={"100%"}>
          {item.confirmed && item.from && (
            <VStack>
              <Center>
                <Avatar size={"lg"} username={item.from} />
              </Center>
              <HStack justifyContent={"space-between"}>
                <Text fontWeight={"bold"}>{translate("common.from")}:</Text>
                <Link
                  isExternal
                  href={`https://hiveblocks.com/@${item.from}`}
                  alignItems={"center"}
                >
                  <Text>@{item.from}</Text>
                  <MaterialIcons name="link" size={25} />
                </Link>
              </HStack>
            </VStack>
          )}

          <HStack justifyContent={"space-between"}>
            <Text fontWeight={"bold"}>{translate("common.store")}:</Text>
            <Text>@{item.to}</Text>
          </HStack>

          {item.createdAt && (
            <HStack justifyContent={"space-between"}>
              <Text fontWeight={"bold"}>{translate("common.created")}:</Text>
              <Text>{moment.unix(Number(item.createdAt)).format("lll")}</Text>
            </HStack>
          )}
          <HStack justifyContent={"space-between"}>
            <Text fontWeight={"bold"}>{translate("common.memo")}:</Text>
            <Text>{item.memo}</Text>
          </HStack>
          {item.updatedAt && (
            <HStack justifyContent={"space-between"}>
              <Text fontWeight={"bold"}>{translate("common.confirmed")}:</Text>
              <Text>{moment.unix(Number(item.updatedAt)).format("lll")}</Text>
            </HStack>
          )}
          {!item.confirmed && (
            <HStack mt={"3"} space={3} justifyContent={"center"}>
              <Button w={"90px"} onPress={gotoHome}>
                {translate("common.try_again")}
              </Button>
              <Button
                onPress={() => handleDelete(item.memo)}
                w={"90px"}
                colorScheme="danger"
              >
                {translate("common.delete")}
              </Button>
            </HStack>
          )}
        </Box>
      )}
    </Box>
  );
};
