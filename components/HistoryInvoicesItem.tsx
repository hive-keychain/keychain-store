import { MainDrawerParamList } from "@/app/_layout";
import { Colors } from "@/constants/Colors";
import { translate } from "@/utils/Localization.utils";
import { AsyncStorageUtils, InvoiceData } from "@/utils/Storage.utils";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import moment from "moment";
import { Box, Button, HStack, Link, Text, VStack } from "native-base";
import React from "react";
import Check from "../assets/images/check.svg";
import Pending from "../assets/images/pending.svg";
import Avatar from "./Avatar";
interface Props {
  item: InvoiceData;
  reloadParent: () => void;
}

export default ({ item, reloadParent }: Props) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const navigation = useNavigation<DrawerNavigationProp<MainDrawerParamList>>();
  const router = useRouter();
  const gotoHome = () => {
    router.navigate({
      pathname: "/QRCode",
      params: {
        transfer: JSON.stringify({
          amount: item.amount,
          to: item.to,
          memo: item.memo,
        }),
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
      pb={4}
      pt={2}
    >
      <HStack justifyContent={"space-between"}>
        <Text>{moment.unix(Number(item.createdAt)).format("L")}</Text>
        <Text>{item.amount}</Text>
        {item.confirmed ? (
          <Check width={24} height={24} fill={Colors.light.green} />
        ) : (
          <Pending width={24} height={24} fill={Colors.light.red} />
        )}
        <MaterialIcons
          name={isExpanded ? "expand-less" : "expand-more"}
          color={Colors.light.red}
          size={24}
          onPress={() => setIsExpanded(!isExpanded)}
        />
      </HStack>
      {isExpanded && (
        <Box w={"100%"} pt={2}>
          {item.confirmed && item.from && (
            <VStack>
              <HStack justifyContent={"space-between"}>
                <Text fontWeight={"bold"}>{translate("common.from")}:</Text>
                <Link
                  isExternal
                  href={`https://hivehub.dev/@${item.from}`}
                  alignItems={"center"}
                >
                  <Text mr={3} textAlign={"right"}>
                    @{item.from}
                  </Text>
                  <Avatar size={5} username={item.from} />
                </Link>
              </HStack>
            </VStack>
          )}
          <HStack justifyContent={"space-between"}>
            <Text fontWeight={"bold"}>{translate("common.to")}:</Text>
            <Link
              isExternal
              href={`https://hivehub.dev/@${item.to}`}
              alignItems={"center"}
            >
              <Text mr={3}>@{item.to}</Text>
              <Avatar size={5} username={item.to} />
            </Link>
          </HStack>
          {item.createdAt && (
            <HStack justifyContent={"space-between"}>
              <Text fontWeight={"bold"}>{translate("common.created")}:</Text>
              <Text pr={8}>
                {moment.unix(Number(item.createdAt)).format("lll")}
              </Text>
            </HStack>
          )}
          {item.updatedAt && (
            <HStack justifyContent={"space-between"}>
              <Text fontWeight={"bold"}>{translate("common.confirmed")}:</Text>
              <Text pr={8}>
                {moment.unix(Number(item.updatedAt)).format("lll")}
              </Text>
            </HStack>
          )}
          <HStack justifyContent={"space-between"}>
            <Text fontWeight={"bold"}>{translate("common.memo")}:</Text>
            <Text pr={8}>{item.memo}</Text>
          </HStack>
          {!item.confirmed && (
            <HStack mt={"3"} space={3} justifyContent={"center"}>
              <Button
                onPress={() => handleDelete(item.memo)}
                w={"90px"}
                backgroundColor={Colors.light.textInverse}
                _text={{
                  color: Colors.light.text,
                }}
              >
                {translate("common.delete")}
              </Button>
              <Button w={"90px"} onPress={gotoHome}>
                {translate("common.try_again")}
              </Button>
            </HStack>
          )}
        </Box>
      )}
    </Box>
  );
};
