import {DrawerScreenProps} from '@react-navigation/drawer';
import {
  ArrowUpIcon,
  Box,
  Center,
  FlatList,
  HStack,
  Input,
  Link,
  Text,
  VStack,
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
  const [showSearchBox, setShowSearchBox] = React.useState<boolean>(false);
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
          <VStack space={'0.2'} alignItems={'center'}>
            {showSearchBox && (
              <Input
                shadow={2}
                _light={{
                  bg: 'coolGray.100',
                  _hover: {
                    bg: 'coolGray.200',
                  },
                  _focus: {
                    bg: 'coolGray.200:alpha.70',
                  },
                }}
                _dark={{
                  bg: 'coolGray.800',
                  _hover: {
                    bg: 'coolGray.900',
                  },
                  _focus: {
                    bg: 'coolGray.900:alpha.70',
                  },
                }}
                placeholder={t('common:search_box_placeholder')}
                w={'80%'}
                value={searchQuery}
                onChangeText={text => setSearchQuery(text)}
              />
            )}
            <Icon2
              name={showSearchBox ? 'expand-less' : 'expand-more'}
              size={25}
              onPress={() => setShowSearchBox(!showSearchBox)}
            />
          </VStack>
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
