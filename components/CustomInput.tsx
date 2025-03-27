import { Colors } from "@/constants/Colors";
import { translate } from "@/utils/Localization.utils";
import React, { MutableRefObject, useRef, useState } from "react";
import {
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
  useWindowDimensions,
} from "react-native";
import { Input, InputProps } from "react-native-elements";
import Separator from "./Separator";

type Props = InputProps & {
  textAlign?: string;
  containerStyle?: StyleProp<ViewStyle>;
  additionalInputContainerStyle?: StyleProp<ViewStyle>;
  backgroundColor?: string;
  inputColor?: string;
  makeExpandable?: boolean;
  disableFocus?: boolean;
};

export default ({
  backgroundColor,
  inputColor,
  textAlign,
  containerStyle,
  additionalInputContainerStyle,
  makeExpandable,
  disableFocus,
  onFocus,
  ...props
}: Props) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const styles = getDimensionedStyles({
    ...useWindowDimensions(),
    backgroundColor,
    inputColor,
    textAlign,
  });
  //@ts-ignore
  const ref: MutableRefObject<Input> = useRef(null);
  const handleOnBlur = () => {
    setTimeout(() => {
      setIsFocused(false);
    }, 200);
  };
  const onFocusHandler = () => {
    //@ts-ignore
    if (!!onFocus) onFocus(null);
    setIsFocused(true);
    if (disableFocus && ref.current) ref.current.blur();
  };
  const renderInput = () => {
    return (
      <Input
        autoCapitalize={"none"}
        onBlur={handleOnBlur}
        placeholderTextColor={props.readOnly ? "#99A9B6" : "#B9C9D6"}
        ref={ref}
        containerStyle={[styles.container, containerStyle]}
        inputStyle={styles.input}
        leftIconContainerStyle={styles.leftIcon}
        rightIconContainerStyle={styles.rightIcon}
        inputContainerStyle={[
          styles.inputContainer,
          additionalInputContainerStyle,
        ]}
        {...props}
        onFocus={onFocusHandler}
      />
    );
  };

  return makeExpandable ? (
    <>
      <View style={styles.flexRow}>
        <Separator
          height={2}
          drawLine
          additionalLineStyle={styles.lineSeparator}
        />
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setIsExpanded(!isExpanded)}
        >
          <Text style={styles.textBase}>
            {translate("common.search_box_placeholder")}
          </Text>
        </TouchableOpacity>
      </View>
      {isExpanded && renderInput()}
    </>
  ) : (
    renderInput()
  );
};

const getDimensionedStyles = ({
  width,
  backgroundColor,
  inputColor,
  textAlign,
}: {
  width: number;
  backgroundColor?: string;
  inputColor?: string;
  textAlign?: string;
}) =>
  StyleSheet.create({
    container: {
      backgroundColor: backgroundColor || "#000000",
      borderRadius: 25,
      height: 40,
      borderWidth: 1,
    },
    leftIcon: { height: 30 },
    rightIcon: { height: 30, marginLeft: 15 },
    input: { color: inputColor || "#ffffff" },
    inputContainer: {
      height: "100%",
      borderBottomWidth: 0,
    },
    flexRow: {
      width: "100%",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-end",
    },
    lineSeparator: {
      width: "85%",
      borderColor: Colors.light.lineSeparatorStroke,
      position: "absolute",
      left: -5,
      right: undefined,
    },
    textBase: {
      fontSize: 10,
      color: Colors.light.secondaryText,
    },
  });
