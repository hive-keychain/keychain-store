import {DrawerScreenProps} from '@react-navigation/drawer';
import {Center, FlatList, HStack, Link, Text} from 'native-base';
import React from 'react';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import Loader from '../../components/Loader';
import ScreenLayout from '../../components/ScreenLayout';
import {MainDrawerParamList} from '../../types/navigation.types';
import {AsyncStorageUtils, InvoiceData} from '../../utils/asyncstorage';
import HistoryInvoicesItem from './history-invoices-item/HistoryInvoicesItem';

type Props = DrawerScreenProps<MainDrawerParamList, 'History'>;

export default ({navigation}: Props) => {
  // console.log({navigation, route}); //TODO remove
  const [loading, setLoading] = React.useState(false);
  const [reload, setReload] = React.useState(false);
  const [invoiceHistoryList, setInvoiceHistoryList] = React.useState<
    InvoiceData[]
  >([]);

  React.useEffect(() => {
    init();
  }, [reload]);

  const init = async () => {
    setLoading(true);
    const invoiceList = await AsyncStorageUtils.getAllInvoices(true);
    console.log({invoiceList});
    setInvoiceHistoryList(invoiceList);
    setLoading(false);
  };

  return loading ? (
    <Loader />
  ) : (
    <ScreenLayout>
      {invoiceHistoryList.length === 0 ? (
        <Center h={'100%'}>
          <HStack space={3} alignItems={'center'}>
            <Icon2 size={30} name="segment" color={'red'} />
            <Text fontSize={16}>No records where found.</Text>
          </HStack>
          <Link onPress={() => navigation.navigate('Home')}>Go Home</Link>
        </Center>
      ) : (
        <FlatList
          data={invoiceHistoryList}
          renderItem={data => (
            <HistoryInvoicesItem
              key={data.item.memo}
              item={data.item}
              reloadParent={() => setReload(!reload)}
            />
          )}
          width={'90%'}
        />
      )}
    </ScreenLayout>
  );
};
