import { Box, Text } from "native-base";
import React, { JSX } from "react";

interface Props {
  titleLayout?: string;
  children: JSX.Element | JSX.Element[] | (() => JSX.Element);
  alignItems?: string;
  justifyContent?: string;
}

export default ({
  titleLayout,
  children,
  alignItems,
  justifyContent,
}: Props) => {
  return (
    <Box
      flex={1}
      bg="#fff"
      alignItems={alignItems ?? "center"}
      justifyContent={justifyContent ?? "center"}
    >
      {titleLayout && <Text>{titleLayout}</Text>}
      {children}
    </Box>
  );
};
