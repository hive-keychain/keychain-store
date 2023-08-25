import {DrawerScreenProps} from '@react-navigation/drawer';
import moment from 'moment';
import {
  ArrowForwardIcon,
  CheckCircleIcon,
  HStack,
  Heading,
  Icon,
  Link,
  Text,
  VStack,
} from 'native-base';
import React from 'react';
import {useTranslation} from 'react-i18next';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import {MainDrawerParamList} from '../types/navigation.types';
import ScreenLayout from './ScreenLayout';

type Props = DrawerScreenProps<MainDrawerParamList, 'InvoiceSuccess'>;

export default ({navigation, route}: Props) => {
  const {t} = useTranslation();
  const {params} = route;

  return (
    <ScreenLayout>
      <VStack width={'70%'} space={3}>
        <HStack
          space={'1'}
          alignItems={'center'}
          justifyContent={'center'}
          marginBottom={10}>
          <CheckCircleIcon size="5" mt="0.5" color="emerald.500" />
          <Heading>{t('common:payment_success')}</Heading>
        </HStack>

        {params && params.confirmedOperation && (
          <>
            <HStack justifyContent={'space-between'}>
              <Text fontWeight={'bold'}>{t('common:confirmed')}:</Text>
              <Text>
                {moment
                  .unix(Number(params.confirmedOperation.updatedAt))
                  .format('lll')}
              </Text>
            </HStack>
            <HStack justifyContent={'space-between'}>
              <Text bold>{t('common:from')}:</Text>
              <Text>@{params.confirmedOperation.from}</Text>
            </HStack>
            <HStack justifyContent={'space-between'}>
              <Text bold>To:</Text>
              <Text>@{params.confirmedOperation.to}</Text>
            </HStack>
            <HStack justifyContent={'space-between'}>
              <Text bold>{t('common:amount')}:</Text>
              <Text>{params.confirmedOperation.amount}</Text>
            </HStack>
            <VStack>
              <Text bold>{t('common:memo')}:</Text>
              <Text textAlign={'center'}>{params.confirmedOperation.memo}</Text>
            </VStack>
            <HStack justifyContent={'space-between'}>
              <Text fontWeight={'bold'}>{t('common:created')}:</Text>
              <Text>
                {moment
                  .unix(Number(params.confirmedOperation.createdAt))
                  .format('lll')}
              </Text>
            </HStack>
          </>
        )}
        <HStack
          justifyContent={'space-between'}
          marginTop={20}
          alignContent={'center'}>
          <Link onPress={() => navigation.navigate('History')} mb={2}>
            <Icon
              as={<Icon2 name="replay" />}
              size={5}
              mr="0.5"
              color="muted.400"
            />
            {t('navigation:check_in_history')}
          </Link>
          <Link onPress={() => navigation.navigate('Home')}>
            <ArrowForwardIcon size="5" mt="0.5" mr="0.5" color="emerald.500" />
            {t('navigation:next_invoice')}
          </Link>
        </HStack>
      </VStack>
    </ScreenLayout>
  );
};
