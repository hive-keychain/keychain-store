import {DrawerScreenProps} from '@react-navigation/drawer';
import {
  ArrowForwardIcon,
  Center,
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

type Props = DrawerScreenProps<MainDrawerParamList, 'InvoiceSuccess'>;

export default ({navigation, route}: Props) => {
  const {params} = route;
  console.log({params});

  return (
    <Center w={'100%'} h={'100%'}>
      <VStack space={3}>
        <Heading marginBottom={10}>
          {' '}
          <CheckCircleIcon size="5" mt="0.5" color="emerald.500" /> Payment
          successful!
        </Heading>

        {params && params.confirmedOperation && (
          <>
            <Text>
              <Text bold>From: </Text>@{params.confirmedOperation.from}
            </Text>
            <Text>
              <Text bold>To: </Text>@{params.confirmedOperation.to}
            </Text>
            <Text>
              <Text bold>Amount: </Text>
              {params.confirmedOperation.amount}
            </Text>
            <Text>
              <Text bold>Memo: </Text>
              {params.confirmedOperation.memo}
            </Text>
          </>
        )}
        <HStack justifyContent={'space-between'} marginTop={20}>
          <Link onPress={() => navigation.navigate('History')} mb={2}>
            <Icon
              as={<Icon2 name="replay" />}
              size={5}
              mr="2"
              color="muted.400"
            />
            Check in History
          </Link>
          <Link onPress={() => navigation.navigate('History')}>
            <ArrowForwardIcon size="5" mt="0.5" color="emerald.500" />
            Next invoice
          </Link>
        </HStack>
      </VStack>
    </Center>
  );
};
