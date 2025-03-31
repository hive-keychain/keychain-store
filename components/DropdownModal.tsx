import { Colors } from "@/constants/Colors";
import { translate } from "@/utils/Localization.utils";
import { ChevronDownIcon } from "native-base";
import React, { useRef, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import Reanimated from "react-native-reanimated";
import Separator from "./Separator";
import SlidingOverlay from "./SlidingOverlay";

export interface DropdownModalItem {
  value: string;
  label?: string;
  removable?: boolean;
}
interface Props {
  list: DropdownModalItem[];
  selected: string | DropdownModalItem;
  onSelected: (itemValue: DropdownModalItem) => void;
  dropdownTitle?: string;
  selectedBgColor?: string;
  drawLineBellowSelectedItem?: boolean;
}

const DropdownModal = ({
  selected,
  list,
  dropdownTitle,
  onSelected,
  selectedBgColor,
}: Props) => {
  const dropdownContainerRef = useRef(null);
  const [isListExpanded, setIsListExpanded] = useState(false);
  const styles = getStyles();

  const onHandleSelectedItem = (item: DropdownModalItem) => {
    setTimeout(() => {
      setIsListExpanded(false);
      setTimeout(() => onSelected(item), 100);
    }, 300);
  };

  const renderDropdownItem = (item: DropdownModalItem, index: number) => {
    const showSelectedBgOnItem =
      selectedBgColor && (selected === item.value || selected === item.label);
    const bgStyle = showSelectedBgOnItem
      ? ({
          backgroundColor: selectedBgColor,
        } as ViewStyle)
      : null;
    const innerContainerStyle = {
      flexDirection: "row",
      justifyContent: "space-between",
      width: "100%",
      alignItems: "center",
      alignContent: "center",
    } as ViewStyle;
    const innerContainerBgStyle = selectedBgColor
      ? ({
          paddingHorizontal: 16,
          alignContent: "space-between",
          paddingVertical: 4,
        } as ViewStyle)
      : undefined;

    return (
      <Pressable
        onPress={() => onHandleSelectedItem(item)}
        style={[styles.dropdownItem, bgStyle]}
      >
        <View style={[innerContainerStyle, innerContainerBgStyle]}>
          <Text
            style={[
              {
                fontSize: 16,
                color: showSelectedBgOnItem
                  ? Colors.light.textInverse
                  : Colors.light.secondaryText,
              },
            ]}
          >
            {item.label}
          </Text>
        </View>
      </Pressable>
    );
  };

  const renderSelectedValue = (showOpened?: boolean) => (
    <TouchableOpacity
      activeOpacity={1}
      onPress={() => {
        setIsListExpanded(!isListExpanded);
      }}
      style={[
        {
          borderWidth: 1,
          backgroundColor: Colors.light.cardBgColor,
          borderColor: Colors.light.cardBorderColor,
          borderRadius: 19,
          paddingHorizontal: 21,
          paddingVertical: 15,
        },
        styles.dropdownContainer,
        showOpened
          ? {
              backgroundColor: Colors.light.secondaryCardBgColor,
            }
          : undefined,
      ]}
    >
      {typeof selected === "string" ? (
        <Text
          style={{ fontSize: 16, color: Colors.light.secondaryText }}
          numberOfLines={1}
        >
          {selected.toUpperCase()}
        </Text>
      ) : (
        <View style={[styles.flexRow, { flex: 1 }]}>
          <Text
            numberOfLines={1}
            style={[
              { flex: 1, fontSize: 16, color: Colors.light.secondaryText },
            ]}
          >
            {selected.label}
          </Text>
        </View>
      )}
      <ChevronDownIcon size="4" mr="3" color={Colors.light.red} />
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1 }}>
      <View>
        <View ref={dropdownContainerRef}>{renderSelectedValue()}</View>
      </View>
      <SlidingOverlay
        showOverlay={isListExpanded}
        setShowOverlay={setIsListExpanded}
        title={dropdownTitle!}
      >
        <Reanimated.FlatList
          style={{ width: "100%", height: "100%" }}
          scrollEnabled={true}
          ListHeaderComponent={<Separator />}
          ListFooterComponent={<Separator height={100} />}
          ListEmptyComponent={
            <View
              style={[
                {
                  flexGrow: 1,
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: 16,
                },
              ]}
            >
              <Text
                style={{
                  fontSize: 16,
                  color: Colors.light.secondaryText,
                  fontWeight: 600,
                }}
              >
                {translate("wallet.operations.token_settings.empty_results")}
              </Text>
            </View>
          }
          data={list}
          keyExtractor={(item) => item.value!}
          renderItem={(item) => renderDropdownItem(item.item, item.index)}
          contentContainerStyle={{}}
        />
      </SlidingOverlay>
    </View>
  );
};

const getStyles = () =>
  StyleSheet.create({
    textBase: {
      color: Colors.light.secondaryText,
      fontSize: 12,
      fontWeight: 600,
    },
    rotateIcon: {
      transform: [{ rotateX: "180deg" }],
    },
    flexRow: {
      flexDirection: "row",
      alignItems: "center",
      flexGrow: 1,
      justifyContent: "flex-end",
    },
    marginLeft: {
      marginLeft: 8,
    },
    dropdownContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      height: 48,
      marginBottom: 0,
      borderRadius: 25,
      zIndex: 30,
      paddingVertical: 0,
      marginTop: 0,
      paddingTop: 0,
    },
    dropdownItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 6,
      marginTop: 6,
    },
    smallerText: {
      fontSize: 12,
    },
    searchContainer: {
      borderColor: Colors.light.cardBorderColor,
      backgroundColor: Colors.light.secondaryCardBgColor,
      borderWidth: 1,
      width: "auto",
      height: 50,
    },
    italic: {
      fontStyle: "italic",
    },
    positionAbsolute: {
      position: "absolute",
      bottom: -24,
      alignSelf: "center",
    },
  });

export default DropdownModal;
