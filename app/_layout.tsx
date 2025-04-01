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
import { extendTheme, NativeBaseProvider } from "native-base";
import { StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const customTheme = extendTheme({
    components: {
      Input: {
        defaultProps: {
          _input: {
            fontSize: "sm",
          },
          _focus: {
            backgroundColor: "transparent",
            focusOutlineColor: Colors.light.red100,
            borderWidth: 1,
          },
        },
      },
      Button: {
        defaultProps: {
          backgroundColor: Colors.light.red,
          borderRadius: 20,
          _text: {
            color: "white",
            fontSize: "sm",
          },
        },
      },
      Text: {
        fontSize: "xs",
      },
    },
  });
  return (
    <NativeBaseProvider theme={customTheme}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <Drawer
            screenOptions={{
              drawerStyle: styles.drawer,
              drawerActiveBackgroundColor: Colors.light.red,
              drawerActiveTintColor: Colors.light.textInverse,
              headerTintColor: "black",
              drawerInactiveTintColor: Colors.light.text,
              drawerItemStyle: styles.drawerItemStyle,
            }}
            initialRouteName="(invoices)"
            drawerContent={(props) => <DrawerContent {...props} />}
          >
            <Drawer.Screen name="index" redirect />
            <Drawer.Screen
              name="(invoices)"
              options={{
                title: translate("common.new_invoice"),
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
