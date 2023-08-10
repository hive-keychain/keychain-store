import AsyncStorage from '@react-native-async-storage/async-storage';

const read = async (itemKey: string) => {
  return await AsyncStorage.getItem(itemKey);
};

//TODO to finish bellow
const addInvoice = async (
  from: string,
  to: string,
  amount: string,
  memo: string,
  hiveUrl: string,
) => {
  let invoiceList = await AsyncStorage.getItem('invoice_history');
  let item;
  if (!invoiceList) {
    //add new invoice.
    item = {
      date: new Date(),
      from,
      to,
      amount,
      memo,
      hiveUrl,
    };
  }
  await AsyncStorage.setItem('invoice_history', '');
};

export const AsyncStorageUtils = {
  read,
};
