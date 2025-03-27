import { translate } from "@/utils/Localization.utils";
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { HStack, Heading, Image, Text, View } from "native-base";
import React from "react";
import { Linking, StyleSheet, TouchableOpacity } from "react-native";

import { Colors } from "@/constants/Colors";
import DiscordLogo from "../assets/images/discord_logo.svg";
import HiveLogo from "../assets/images/hive_logo.svg";
import ThreadsLogo from "../assets/images/threads_logo.svg";

type Props = DrawerContentComponentProps;

export default (props: Props) => {
  return (
    <DrawerContentScrollView
      contentContainerStyle={styles.container}
      {...props}
    >
      <View style={styles.containerSpaced}>
        <View>
          <HStack px={2} alignItems={"center"}>
            <Image
              source={require("../assets/images/keychain_logo_circular.png")}
              alt="hive keychain logo"
              resizeMode="contain"
              height={50}
              width={50}
            />
            <Heading textAlign={"center"} marginY={"10"} marginLeft={"3"}>
              Keychain Store
            </Heading>
          </HStack>
          <View>
            <DrawerItemList {...props} />
          </View>
        </View>
      </View>
      <View alignItems={"center"}>
        <Text>{translate("footer.text")}</Text>
        <View style={styles.footerIconsContainer}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => Linking.openURL("https://peakd.com/@keychain")}
            style={styles.footerIconContainer}
          >
            <HiveLogo style={styles.footerLogo} />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => Linking.openURL("https://discord.gg/tUHtyev2xF")}
            style={styles.footerIconContainer}
          >
            <DiscordLogo style={styles.footerLogo} />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => Linking.openURL("https://twitter.com/HiveKeychain")}
            style={styles.footerIconContainer}
          >
            <ThreadsLogo width={20} style={styles.footerLogo} />
          </TouchableOpacity>
        </View>
      </View>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "100%",
    paddingBottom: 0,
    flex: 1,
  },
  containerSpaced: {
    justifyContent: "space-between",
    flex: 1,
  },
  footerIconContainer: {
    borderWidth: 1,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    borderColor: Colors.light.cardBorderColorContrast,
    alignItems: "center",
    justifyContent: "flex-end",
    width: 45,
    height: 35,
    bottom: 0,
    backgroundColor: "#FFF",
  },

  footerIconsContainer: {
    flexDirection: "row",
    width: "65%",
    justifyContent: "space-between",
    marginTop: 32,
  },
  footerLogo: {
    bottom: 4,
  },
});
