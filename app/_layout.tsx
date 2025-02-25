import DrawerContent from "@/components/DrawerContent";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { translate } from "@/utils/Localization.utils";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Drawer } from "expo-router/drawer";
import * as SplashScreen from "expo-splash-screen";
import { NativeBaseProvider } from "native-base";
import { StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <NativeBaseProvider>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <Drawer
            screenOptions={{
              drawerStyle: styles.drawer,
              drawerActiveBackgroundColor: Colors.light.red,
              drawerActiveTintColor: Colors.light.textInverse,
              drawerInactiveTintColor: Colors.light.text,
              drawerItemStyle: styles.drawerItemStyle,
            }}
            initialRouteName="Home"
            drawerContent={(props) => <DrawerContent {...props} />}
          >
            <Drawer.Screen name="index" redirect />
            <Drawer.Screen
              name="Home"
              options={{
                title: translate("navigation.homeTitle"),
                popToTopOnBlur: true,
              }}
            />
            <Drawer.Screen
              name="HistoryInvoices"
              options={{
                title: translate("navigation.historyTitle"),
                popToTopOnBlur: true,
              }}
            />
            <Drawer.Screen
              name="InvoiceSuccess"
              options={{
                title: translate("navigation.invoiceSuccessTitle"),
                drawerItemStyle: { display: "none" },
              }}
            />
          </Drawer>
        </GestureHandlerRootView>
      </ThemeProvider>
    </NativeBaseProvider>
  );
}

const styles = StyleSheet.create({
  drawer: {
    backgroundColor: Colors.light.menuHamburguerBg,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    width: "75%",
    height: "96%",
    bottom: "2%",
    top: undefined,
  },
  drawerItemStyle: { borderRadius: 10, opacity: 0.9 },
});

export type MainDrawerParamList = {
  Home:
    | {
        toConfirmOperation: {
          store: string;
          memo: string;
          amount: string;
        };
      }
    | undefined;
  History: undefined;
  Settings: undefined;
  InvoiceSuccess:
    | {
        confirmedOperation: {
          from: string;
          to: string;
          amount: string;
          memo: string;
          updatedAt: string;
          createdAt: string;
        };
      }
    | undefined;
};
