import { Colors } from "@/constants/Colors";
import { translate } from "@/utils/Localization.utils";
import React, { useEffect, useState } from "react";
import {
  Keyboard,
  Platform,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { Overlay } from "react-native-elements";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
const ReanimatedView = Animated.createAnimatedComponent(View);
type Props = {
  children: JSX.Element[] | JSX.Element;
  showOverlay: boolean;
  setShowOverlay: (e: boolean) => void;
  title: string;
  maxHeightPercent?: number;
};

const SlidingOverlay = ({
  children,
  showOverlay,
  setShowOverlay,
  title,
  maxHeightPercent,
}: Props) => {
  const { height } = useWindowDimensions();
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [isClosing, setIsClosing] = useState(false);
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      (event) => {
        setKeyboardHeight(event.endCoordinates.height);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardHeight(0);
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  useEffect(() => {
    if (showOverlay) setIsClosing(false);
  }, [showOverlay]);
  return (
    <Overlay
      onBackdropPress={() => {
        setTimeout(() => setShowOverlay(false), 300);
        setIsClosing(true);
      }}
      isVisible={showOverlay}
      overlayStyle={{
        width: "100%",
        position: "absolute",
        bottom: 0,
        backgroundColor: "white",
        padding: 0,
        maxHeight: maxHeightPercent! * height || height / 2,
        minHeight: height / 3,
        shadowColor: "transparent",
        marginBottom: Platform.OS === "ios" ? keyboardHeight : 0,
        borderTopRightRadius: 16,
        borderTopLeftRadius: 16,
        borderWidth: 1,
        borderColor: Colors.light.cardBorderColor,
      }}
    >
      {!isClosing && (
        <ReanimatedView
          entering={FadeIn}
          exiting={FadeOut}
          style={{ backgroundColor: "transparent" }}
        >
          <View
            style={{
              backgroundColor: "white",
              borderTopRightRadius: 16,
              borderTopLeftRadius: 16,
              borderWidth: 1,
              borderColor: Colors.light.cardBorderColor,
            }}
          >
            <Text
              style={{
                alignSelf: "center",
                marginVertical: 10,
                fontSize: 18,
                color: Colors.light.secondaryText,
                fontWeight: 600,
              }}
            >
              {translate(title)}
            </Text>
            {children}
          </View>
        </ReanimatedView>
      )}
    </Overlay>
  );
};

export default SlidingOverlay;
