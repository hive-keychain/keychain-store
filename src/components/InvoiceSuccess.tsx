import {DrawerScreenProps} from '@react-navigation/drawer';
import {Center, Text, VStack} from 'native-base';
import {MainDrawerParamList} from '../types/navigation.types';

type Props = DrawerScreenProps<MainDrawerParamList, 'InvoiceSuccess'>;

export default ({navigation, route}: Props) => {
  const {params} = route;
  console.log({params});
  return (
    <Center w={'100%'}>
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
      </VStack>
    </Center>
  );
};
