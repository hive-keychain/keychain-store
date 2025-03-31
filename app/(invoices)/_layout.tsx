import { Stack, useNavigation } from "expo-router";
import React from "react";

const StacksLayout = () => {
  const nav = useNavigation();
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" />
      <Stack.Screen name="QRCode" />
      <Stack.Screen name="InvoiceSuccess" />
    </Stack>
  );
};

export default StacksLayout;
