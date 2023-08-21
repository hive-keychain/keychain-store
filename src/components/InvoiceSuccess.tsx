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
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import {MainDrawerParamList} from '../types/navigation.types';
import ScreenLayout from './ScreenLayout';

type Props = DrawerScreenProps<MainDrawerParamList, 'InvoiceSuccess'>;

export default ({navigation, route}: Props) => {
  const {params} = route;
  console.log({params});

  return (
    <ScreenLayout>
      <VStack space={3}>
        <Heading marginBottom={10}>
          {' '}
          <CheckCircleIcon size="5" mt="0.5" color="emerald.500" /> Payment
          successful!
        </Heading>

        {params && params.confirmedOperation && (
          <>
            <HStack justifyContent={'space-between'}>
              <Text fontWeight={'bold'}>Confirmed:</Text>
              <Text>
                {moment
                  .unix(Number(params.confirmedOperation.updatedAt))
                  .format('lll')}
              </Text>
            </HStack>
            <HStack justifyContent={'space-between'}>
              <Text bold>From:</Text>
              <Text>@{params.confirmedOperation.from}</Text>
            </HStack>
            <HStack justifyContent={'space-between'}>
              <Text bold>To:</Text>
              <Text>@{params.confirmedOperation.to}</Text>
            </HStack>
            <HStack justifyContent={'space-between'}>
              <Text bold>Amount:</Text>
              <Text>{params.confirmedOperation.amount}</Text>
            </HStack>
            <HStack justifyContent={'space-between'}>
              <Text bold>Memo:</Text>
              <Text>{params.confirmedOperation.memo}</Text>
            </HStack>
            <HStack justifyContent={'space-between'}>
              <Text fontWeight={'bold'}>Created:</Text>
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
            Check in History
          </Link>
          <Link onPress={() => navigation.navigate('Home')}>
            <ArrowForwardIcon size="5" mt="0.5" mr="0.5" color="emerald.500" />
            Next invoice
          </Link>
        </HStack>
      </VStack>
    </ScreenLayout>
  );
};
