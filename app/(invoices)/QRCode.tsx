import HiveQRCode from "@/components/HiveQRCode";
import ScreenLayout from "@/components/ScreenLayout";
import { TransferOperation } from "@hiveio/dhive";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";

const QRCode = () => {
  const params = useLocalSearchParams();
  const { amount, to, memo } = JSON.parse(params.transfer as string);
  return (
    <ScreenLayout>
      <HiveQRCode
        op={
          [
            "transfer",
            {
              amount,
              from: "",
              to,
              memo,
            },
          ] as TransferOperation
        }
        goBack={() => {
          router.back();
        }}
        {...JSON.parse((params.props || "{}") as string)}
      />
    </ScreenLayout>
  );
};

export default QRCode;
