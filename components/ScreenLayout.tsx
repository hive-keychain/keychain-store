import { Colors } from "@/constants/Colors";
import React from "react";
import {
  ImageBackground,
  ImageStyle,
  ScaledSize,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const hexagonsLight = require("@/assets/images/hexagons-bg-light.png");

interface BackgroundProps {
  children: JSX.Element;
  style?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  additionalBgSvgImageStyle?: StyleProp<ImageStyle>;
}

export default (props: BackgroundProps) => {
  const styles = getStyles(useWindowDimensions());
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.mainContainer]}>
      <ImageBackground
        source={hexagonsLight}
        resizeMethod="scale"
        resizeMode="stretch"
        style={[styles.container]}
        imageStyle={[styles.bgSvgStyle, props.additionalBgSvgImageStyle]}
      >
        {props.children}
      </ImageBackground>
    </View>
  );
};

const getStyles = ({ width, height }: ScaledSize) =>
  StyleSheet.create({
    mainContainer: {
      flex: 1,
      backgroundColor: Colors.light.background,
    },
    container: {
      flex: 1,
    },
    bgSvgStyle: {
      position: "absolute",
      top: undefined,
      bottom: 0,
      width: width,
      height: width * 0.6,
      alignSelf: "center",
    },
  });
