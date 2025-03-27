import { Colors } from "@/constants/Colors";
import React from "react";
import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
  useWindowDimensions,
} from "react-native";
import { InputProps } from "react-native-elements";
import CustomInput from "./CustomInput";

interface OperationInputProps {
  labelInput?: string;
  labelExtraInfo?: string;
  labelBottomExtraInfo?: string;
  additionalOuterContainerStyle?: StyleProp<ViewStyle>;
  additionalLabelStyle?: StyleProp<TextStyle>;
  additionalInputContainerStyle?: StyleProp<ViewStyle>;
  additionalBottomLabelContainerStyle?: StyleProp<ViewStyle>;
  additionalBottomLabelTextStyle?: StyleProp<TextStyle>;
  additionalLabelExtraInfoTextStyle?: StyleProp<TextStyle>;
  removeLabelInputIndent?: boolean;
  additionalinfoIconActionColor?: string;
  trim?: boolean;
}

export default ({
  trim = true,
  ...props
}: InputProps & OperationInputProps) => {
  const { width, height } = useWindowDimensions();
  const styles = getStyles(props.readOnly || false);

  const renderCustomInput = () => (
    <CustomInput
      {...props}
      containerStyle={styles.container}
      additionalInputContainerStyle={props.additionalInputContainerStyle}
      inputColor={Colors.light.secondaryText}
      inputStyle={styles.input}
      value={trim ? props.value?.trim() : props.value}
    />
  );

  return props.labelInput ? (
    <View style={[styles.outerContainer, props.additionalOuterContainerStyle]}>
      <View style={styles.labelInputContainer}>
        <Text
          style={[
            styles.label,
            props.additionalLabelStyle,
            props.removeLabelInputIndent ? undefined : styles.labelIndent,
          ]}
        >
          {props.labelInput}
        </Text>
        {props.labelExtraInfo && (
          <Text
            style={[
              styles.smallerLabelSize,
              props.additionalLabelExtraInfoTextStyle,
            ]}
          >
            {props.labelExtraInfo}
          </Text>
        )}
      </View>
      {renderCustomInput()}
      {props.labelBottomExtraInfo && (
        <View style={props.additionalBottomLabelContainerStyle}>
          <Text style={props.additionalBottomLabelTextStyle}>
            {props.labelBottomExtraInfo}
          </Text>
        </View>
      )}
    </View>
  ) : (
    renderCustomInput()
  );
};

const getStyles = (isReadOnly: boolean) =>
  StyleSheet.create({
    container: {
      width: "100%",
      display: "flex",
      marginLeft: 0,
      backgroundColor: isReadOnly
        ? Colors.light.disabledInput
        : Colors.light.cardBgColor,
      borderColor: Colors.light.cardBorderColor,
      height: 48,
    },
    outerContainer: {
      display: "flex",
      width: "100%",
    },
    labelInputContainer: {
      flexDirection: "row",
      alignItems: "center",
      flexWrap: "wrap",
      flex: 1,
    },
    smallerLabelSize: {
      marginLeft: 10,
      fontSize: 13,
      color: Colors.light.text,
    },
    marginLeft: {
      marginLeft: 8,
    },
    labelIndent: {
      marginLeft: 14,
    },
    input: {
      fontSize: 16,
      color: Colors.light.secondaryText,
    },
    label: {
      color: Colors.light.secondaryText,
      fontSize: 15,
      marginBottom: 3,
      fontWeight: "600",
    },
  });
