// import {DrawerScreenProps} from '@react-navigation/drawer';
// import {Center, FlatList, HStack, Link, Text} from 'native-base';
// import React from 'react';
// import Icon2 from 'react-native-vector-icons/MaterialIcons';
// import {MainDrawerParamList} from '../types/navigation.types';
// import {AsyncStorageUtils, InvoiceData} from '../utils/asyncstorage';
// import Loader from './Loader';
// import ScreenLayout from './ScreenLayout';

// type Props = DrawerScreenProps<MainDrawerParamList, 'History'>;

// export default ({navigation, route}: Props) => {
//   // console.log({navigation, route}); //TODO remove
//   const [loading, setLoading] = React.useState(false);
//   const [invoiceHistoryList, setInvoiceHistoryList] = React.useState<
//     InvoiceData[]
//   >([]);

//   React.useEffect(() => {
//     init();
//   }, []);

//   const init = async () => {
//     setLoading(true);
//     const invoiceList = await AsyncStorageUtils.getAllInvoices();
//     console.log({invoiceList});
//     setInvoiceHistoryList(invoiceList);
//     setLoading(false);
//   };

//   const renderListItem = (item: InvoiceData) => {
//     return (
//       <HStack
//         space={2}
//         borderColor="muted.800"
//         borderBottomWidth={1}
//         mb={2}
//         p={5}>
//         <Text>Memo: {item.memo}</Text>
//         <Text>Confirmed: {item.confirmed.toString()}</Text>
//       </HStack>
//     );
//   };

//   return loading ? (
//     <Loader />
//   ) : (
//     <ScreenLayout>
//       {invoiceHistoryList.length === 0 ? (
//         <Center h={'100%'}>
//           <HStack space={3} alignItems={'center'}>
//             <Icon2 size={30} name="segment" color={'red'} />
//             <Text fontSize={16}>No records where found.</Text>
//           </HStack>
//           <Link onPress={() => navigation.navigate('Home')}>Go Home</Link>
//         </Center>
//       ) : (
//         <FlatList
//           data={invoiceHistoryList}
//           renderItem={data => renderListItem(data.item)}
//         />
//       )}
//     </ScreenLayout>
//   );
// };
//TODO delete file... when doing the cleanup
export {};
