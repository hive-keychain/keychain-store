import {DrawerContentComponentProps} from '@react-navigation/drawer';
import {Image, Text, VStack} from 'native-base';
import React from 'react';
import {useTranslation} from 'react-i18next';

type Props = DrawerContentComponentProps;

export default (_props: Props) => {
  const {t} = useTranslation();
  return (
    <VStack px={2} pb={5} space={2} alignItems={'center'}>
      <Image
        source={require('../assets/keychain_logo.png')}
        alt="hive keychain logo"
        background={'black'}
        resizeMode={'contain'}
        borderRadius={'sm'}
        height={'70px'}
      />
      <Text>{t('footer:text')}</Text>
    </VStack>
  );
};
