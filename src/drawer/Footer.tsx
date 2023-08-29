import {DrawerContentComponentProps} from '@react-navigation/drawer';
import {Text, VStack} from 'native-base';
import React from 'react';
import {useTranslation} from 'react-i18next';

type Props = DrawerContentComponentProps;

export default (_props: Props) => {
  const {t} = useTranslation();
  return (
    <VStack px={2} pb={5} space={2} alignItems={'center'}>
      <Text>{t('footer:text')}</Text>
    </VStack>
  );
};
