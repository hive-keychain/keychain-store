import {useNavigation} from '@react-navigation/native';
import moment from 'moment';
import {
  Badge,
  Box,
  Button,
  Center,
  HStack,
  Link,
  Text,
  VStack,
} from 'native-base';
import React from 'react';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import Avatar from '../../../components/Avatar';
import {AsyncStorageUtils, InvoiceData} from '../../../utils/asyncstorage';

interface Props {
  item: InvoiceData;
  reloadParent: () => void;
}

export default ({item, reloadParent}: Props) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  const navigation = useNavigation();

  const gotoHome = () => {
    //@ts-ignore //TODO add props so it gets the types
    navigation.navigate('Home', {
      toConfirmOperation: {
        store: item.to,
        memo: item.memo,
        amount: item.amount,
      },
    });
  };

  const handleDelete = async (memo: string) => {
    if (memo && memo.trim().length !== 0) {
      await AsyncStorageUtils.deleteInvoice(memo);
      reloadParent();
    }
  };

  return (
    <Box w={'100%'} borderColor="muted.800" borderBottomWidth={1} mb={2} p={5}>
      <HStack justifyContent={'space-between'}>
        <Text>{moment.unix(Number(item.createdAt)).format('L')}</Text>
        <Text>{item.amount}</Text>
        <Badge colorScheme={item.confirmed ? 'success' : 'warning'}>
          {item.confirmed ? 'Confirmed' : 'Unconfirmed'}
        </Badge>
        <Icon2
          name={isExpanded ? 'expand-less' : 'expand-more'}
          size={25}
          onPress={() => setIsExpanded(!isExpanded)}
        />
      </HStack>
      {isExpanded && (
        <Box w={'100%'}>
          {item.confirmed && item.from && (
            <VStack>
              <Center>
                <Avatar size={'lg'} username={item.from} />
              </Center>
              <HStack justifyContent={'space-between'}>
                <Text fontWeight={'bold'}>From:</Text>
                <Link isExternal href={`https://hiveblocks.com/@${item.from}`}>
                  <Text>@{item.from}</Text>
                  <Icon2 name="link" size={25} />
                </Link>
              </HStack>
            </VStack>
          )}

          {!item.confirmed && (
            <HStack justifyContent={'space-between'}>
              <Text fontWeight={'bold'}>Store:</Text>
              <Text>@{item.to}</Text>
            </HStack>
          )}
          {item.createdAt && (
            <HStack justifyContent={'space-between'}>
              <Text fontWeight={'bold'}>Created:</Text>
              <Text>{moment.unix(Number(item.createdAt)).format('lll')}</Text>
            </HStack>
          )}
          <HStack justifyContent={'space-between'}>
            <Text fontWeight={'bold'}>Memo:</Text>
            <Text>{item.memo}</Text>
          </HStack>
          {item.updatedAt && (
            <HStack justifyContent={'space-between'}>
              <Text fontWeight={'bold'}>Confirmed:</Text>
              <Text>{moment.unix(Number(item.updatedAt)).format('lll')}</Text>
            </HStack>
          )}
          {!item.confirmed && (
            <HStack mt={'3'} space={3} justifyContent={'center'}>
              <Button w={'90px'} onPress={gotoHome}>
                Try again
              </Button>
              <Button
                onPress={() => handleDelete(item.memo)}
                w={'90px'}
                colorScheme="secondary">
                Delete
              </Button>
            </HStack>
          )}
        </Box>
      )}
    </Box>
  );
};
