/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = "#0a7ea4";
const tintColorDark = "#fff";

export const Colors = {
  light: {
    text: "#484848",
    textInverse: "white",
    background: "#E5EDF5",
    menuHamburguerBg: "#FFF",
    cardBorderColorContrast: "#EAEAEA",
    red: "#E31337",
    red100: "#E3133755",
    secondaryText: "#212838",
    cardBorderColor: "#E1E8EF",
    secondaryCardBgColor: "#B4C0CF",
    cardBgColor: "#FFF",
    lineSeparatorStroke: "#EDF4FC",
    disabledInput: "#F9F9F9",
    green: "#2aa034",
  },
  dark: {
    text: "#ECEDEE",
    background: "#151718",
    tint: tintColorDark,
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,
  },
};
