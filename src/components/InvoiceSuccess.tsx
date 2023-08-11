import {DrawerScreenProps} from '@react-navigation/drawer';
import {Center, Link, Text, VStack} from 'native-base';
import React from 'react';
import {MainDrawerParamList} from '../types/navigation.types';

type Props = DrawerScreenProps<MainDrawerParamList, 'InvoiceSuccess'>;

export default ({navigation, route}: Props) => {
  const {params} = route;
  console.log({params});

  return (
    <Center w={'100%'} h={'100%'}>
      <VStack space={3}>
        <Text>Operation has been confirmed.</Text>
        {params && params.confirmedOperation && (
          <>
            <Text>
              The account: <Text bold>{params.confirmedOperation.to}</Text>
            </Text>
            <Text>
              Received from the account:{' '}
              <Text bold>{params.confirmedOperation.from}</Text>
            </Text>
            <Text>
              Amount: <Text bold>{params.confirmedOperation.amount}</Text>
            </Text>
            <Text>
              Memo: <Text bold>{params.confirmedOperation.memo}</Text>
            </Text>
          </>
        )}
        <Link onPress={() => navigation.navigate('History')} mb={2}>
          Go to History
        </Link>
        <Link onPress={() => navigation.navigate('History')}>Go to home</Link>
      </VStack>
    </Center>
  );
};
