import {useNavigation} from '@react-navigation/native';
import moment from 'moment';
import {Badge, Box, Button, HStack, Link, Text} from 'native-base';
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
        <Text>{moment(item.createdAt).format('L')}</Text>
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
        <Box w={'100%'} p={2}>
          {item.confirmed && item.from && (
            <HStack space={3} alignItems={'center'} marginBottom={2}>
              <Avatar username={item.from} />
              <Link isExternal href={`https://hiveblocks.com/@${item.from}`}>
                <HStack space={1} alignItems={'center'}>
                  <Text>
                    <Text fontWeight={'bold'}>From:</Text> @{item.from}
                  </Text>
                  <Icon2 name="link" size={25} />
                </HStack>
              </Link>
            </HStack>
          )}

          {!item.confirmed && (
            <>
              <Text>
                <Text fontWeight={'bold'}>Store:</Text> @{item.to}
              </Text>
            </>
          )}
          <Text>
            <Text fontWeight={'bold'}>Memo:</Text> {item.memo}
          </Text>
          {item.updatedAt && (
            <Text>
              <Text fontWeight={'bold'}>Confirmation time:</Text>{' '}
              {moment(item.updatedAt).format('lll')}
            </Text>
          )}
          {!item.confirmed && (
            <HStack p={2} space={2}>
              <Button onPress={gotoHome}>Try again</Button>
              <Button
                onPress={() => handleDelete(item.memo)}
                size="sm"
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
