import {DrawerScreenProps} from '@react-navigation/drawer';
import {
  ArrowUpIcon,
  Box,
  Center,
  FlatList,
  FormControl,
  HStack,
  Icon,
  Input,
  Link,
  Text,
} from 'native-base';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {NativeScrollEvent, NativeSyntheticEvent} from 'react-native';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import Loader from '../../components/Loader';
import ScreenLayout from '../../components/ScreenLayout';
import {MainDrawerParamList} from '../../types/navigation.types';
import {AsyncStorageUtils, InvoiceData} from '../../utils/asyncstorage';
import HistoryInvoicesItem from './history-invoices-item/HistoryInvoicesItem';

type Props = DrawerScreenProps<MainDrawerParamList, 'History'>;

export default ({navigation}: Props) => {
  const {t} = useTranslation();
  const [loading, setLoading] = React.useState(false);
  const [reload, setReload] = React.useState(false);
  const [invoiceHistoryList, setInvoiceHistoryList] = React.useState<
    InvoiceData[]
  >([]);
  const [showScrollToTop, setShowScrollToTop] = React.useState(false);
  const [filteredInvoiceHistoryList, setFilteredInvoiceHistoryList] =
    React.useState<InvoiceData[]>([]);
  const [searchQuery, setSearchQuery] = React.useState<string>('');
  const flatListRef = React.useRef(null);

  React.useEffect(() => {
    init();
  }, [reload]);

  React.useEffect(() => {
    if (searchQuery.trim().length > 0 && invoiceHistoryList.length > 0) {
      setFilteredInvoiceHistoryList(
        invoiceHistoryList.filter(
          invoice =>
            invoice.memo.toLowerCase().includes(searchQuery.toLowerCase()) ||
            invoice.from.toLowerCase().includes(searchQuery.toLowerCase()),
        ),
      );
    } else {
      setFilteredInvoiceHistoryList(invoiceHistoryList);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  const init = async () => {
    setLoading(true);
    const invoiceList = await AsyncStorageUtils.getAllInvoices(true);
    setInvoiceHistoryList(invoiceList);
    setFilteredInvoiceHistoryList(invoiceList);
    setLoading(false);
  };

  const handleDragScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (event) {
      setShowScrollToTop(event.nativeEvent.contentOffset.y > 100);
    }
  };

  const gotoStartScroll = () => {
    if (flatListRef.current) {
      (flatListRef.current as any).scrollToIndex({
        animated: true,
        index: 0,
      });
      setShowScrollToTop(false);
    }
  };

  return loading ? (
    <ScreenLayout>
      <Loader />
    </ScreenLayout>
  ) : (
    <ScreenLayout>
      {invoiceHistoryList.length === 0 ? (
        <Center h={'100%'}>
          <HStack space={3} alignItems={'center'}>
            <Icon2 size={30} name="segment" color={'red'} />
            <Text fontSize={16}>{t('common:no_records_found')}</Text>
          </HStack>
          <Link onPress={() => navigation.navigate('Home')}>
            {t('navigation:link_go_home')}
          </Link>
        </Center>
      ) : (
        <>
          <FormControl width={'90%'}>
            <FormControl.Label
              _text={{
                bold: true,
              }}>
              {t('common:filter')}{' '}
            </FormControl.Label>
            <Input
              InputLeftElement={
                <Icon
                  as={<Icon2 name="search" />}
                  size={5}
                  ml="2"
                  color="muted.400"
                />
              }
              InputRightElement={
                <Icon
                  as={<Icon2 name="x" />}
                  size={5}
                  ml="2"
                  color="muted.400"
                />
              }
              placeholder={t('common:search_box_placeholder')}
              value={searchQuery}
              onChangeText={text => setSearchQuery(text)}
            />
          </FormControl>
          <FlatList
            ref={flatListRef}
            data={filteredInvoiceHistoryList}
            renderItem={data => (
              <HistoryInvoicesItem
                key={data.item.memo}
                item={data.item}
                reloadParent={() => setReload(!reload)}
              />
            )}
            width={'90%'}
            onScrollEndDrag={handleDragScroll}
          />
          {showScrollToTop && (
            <Box position={'absolute'} bottom={'3'} right={'2'}>
              <ArrowUpIcon
                size={'5'}
                background={'white'}
                onPress={gotoStartScroll}
              />
            </Box>
          )}
        </>
      )}
    </ScreenLayout>
  );
};
