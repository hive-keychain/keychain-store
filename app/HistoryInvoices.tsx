import HistoryInvoicesItem from "@/components/HistoryInvoicesItem";
import OperationInput from "@/components/OperationInput";
import ScreenLayout from "@/components/ScreenLayout";
import Separator from "@/components/Separator";
import { Colors } from "@/constants/Colors";
import { translate } from "@/utils/Localization.utils";
import { AsyncStorageUtils, InvoiceData } from "@/utils/Storage.utils";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { DrawerScreenProps } from "@react-navigation/drawer";
import { ArrowUpIcon, Center, HStack, Link, Text } from "native-base";
import React, { useRef } from "react";
import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { MainDrawerParamList } from "./_layout";

type Props = DrawerScreenProps<MainDrawerParamList, "History">;

export default ({ navigation }: Props) => {
  const [loading, setLoading] = React.useState(false);
  const [reload, setReload] = React.useState(false);
  const [invoiceHistoryList, setInvoiceHistoryList] = React.useState<
    InvoiceData[]
  >([]);
  const [showScrollToTop, setShowScrollToTop] = React.useState(false);
  const [filteredInvoiceHistoryList, setFilteredInvoiceHistoryList] =
    React.useState<InvoiceData[]>([]);
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const flatListRef = useRef(null);

  React.useEffect(() => {
    init();
  }, [reload]);

  React.useEffect(() => {
    if (searchQuery.trim().length > 0 && invoiceHistoryList.length > 0) {
      setFilteredInvoiceHistoryList(
        invoiceHistoryList.filter(
          (invoice) =>
            invoice.memo.toLowerCase().includes(searchQuery.toLowerCase()) ||
            invoice.from.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    } else {
      setFilteredInvoiceHistoryList(invoiceHistoryList);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  const init = async () => {
    setLoading(true);
    const invoiceList = await AsyncStorageUtils.getAllInvoices(true);
    setInvoiceHistoryList(invoiceList);
    setFilteredInvoiceHistoryList(invoiceList);
    setLoading(false);
  };

  const handleDragScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (event) {
      setShowScrollToTop(event.nativeEvent.contentOffset.y > 100);
    }
  };

  const gotoStartScroll = () => {
    if (flatListRef.current) {
      (flatListRef.current as any).scrollToIndex({
        animated: true,
        index: 0,
      });
      setShowScrollToTop(false);
    }
  };

  return (
    <ScreenLayout>
      {invoiceHistoryList.length === 0 ? (
        <Center h={"100%"}>
          <HStack space={3} alignItems={"center"}>
            <MaterialIcons size={30} name="segment" color={"red"} />
            <Text fontSize={16}>{translate("common.no_records_found")}</Text>
          </HStack>
          <Link onPress={() => navigation.navigate("Home")}>
            {translate("navigation.link_go_home")}
          </Link>
        </Center>
      ) : (
        <View style={styles.container}>
          <OperationInput
            leftIcon={
              <MaterialIcons name="search" size={20} color={Colors.light.red} />
            }
            rightIcon={
              <MaterialIcons
                name="clear"
                size={15}
                onPress={() => {
                  setSearchQuery("");
                }}
              />
            }
            placeholder={translate("common.search_box_placeholder")}
            value={searchQuery}
            onChangeText={(text) => setSearchQuery(text)}
          />

          <FlatList
            style={styles.flatList}
            ref={flatListRef}
            data={filteredInvoiceHistoryList}
            refreshing={loading}
            onRefresh={() => setReload(!reload)}
            renderItem={(data) => (
              <HistoryInvoicesItem
                key={data.item.memo}
                item={data.item}
                reloadParent={() => setReload(!reload)}
              />
            )}
            onMomentumScrollEnd={handleDragScroll}
            ListFooterComponent={<Separator height={100} />}
          />
          {showScrollToTop && (
            <TouchableOpacity
              style={styles.backToTop}
              onPress={gotoStartScroll}
            >
              <ArrowUpIcon size={"5"} color={"white"} />
            </TouchableOpacity>
          )}
        </View>
      )}
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  flatList: { marginTop: 30, width: "100%" },
  backToTop: {
    justifyContent: "center",
    borderRadius: 100,
    alignItems: "center",
    position: "absolute",
    bottom: 50,
    right: 10,
    width: 45,
    height: 45,
    backgroundColor: Colors.light.red,
  },
  container: { paddingHorizontal: "5%", marginTop: 30 },
});
