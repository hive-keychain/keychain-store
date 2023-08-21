import {Button} from 'native-base';
import React from 'react';
import Share from 'react-native-share';

interface Props {
  title: string;
  qrCodeImg: string;
  invoiceMemo?: string;
}
//TODO when need to implement Share Options, uncomment code in HiveQrCode.tsx
export default ({title, qrCodeImg, invoiceMemo}: Props) => {
  const handleSharingOptions = async () => {
    const shareOptions = {
      title: `Share Invoice ${invoiceMemo}`,
      url: qrCodeImg as string,
      failOnCancel: false,
      //   message: 'Share Invoice',
    };
    try {
      const ShareResponse = await Share.open(shareOptions);
      console.log('Result =>', ShareResponse);
    } catch (error) {
      console.log('Error =>', error);
    }
  };
  return <Button onPress={handleSharingOptions}>{title}</Button>;
};
