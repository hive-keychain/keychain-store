import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';

export interface InvoiceData {
  from: string;
  to: string;
  amount: string;
  memo: string;
  confirmed: boolean;
  createdAt: string;
  updatedAt?: string;
}

export enum AsyncStorageKey {
  INVOICE_HISTORY_LIST = 'invoice_history_list',
  LAST_STORE_NAME = 'last_store_name',
}

const getInvoice = async (memo: string): Promise<InvoiceData | undefined> => {
  try {
    const invoiceData = await AsyncStorage.getItem(
      AsyncStorageKey.INVOICE_HISTORY_LIST,
    );
    if (invoiceData) {
      let parsedDataInvoices = JSON.parse(invoiceData) as InvoiceData[];
      return parsedDataInvoices.find(invoice => invoice.memo === memo);
    }
  } catch (error) {
    console.log({ErrorReadingInvoice: error});
    return undefined;
  }
};

const getAllInvoices = async (orderByDate?: boolean) => {
  try {
    const invoiceData = await AsyncStorage.getItem(
      AsyncStorageKey.INVOICE_HISTORY_LIST,
    );
    if (invoiceData) {
      let parsedDataInvoices = JSON.parse(invoiceData) as InvoiceData[];
      if (orderByDate) {
        return parsedDataInvoices.sort((a, b) =>
          moment
            .unix(Number(b.createdAt))
            .diff(moment.unix(Number(a.createdAt))),
        );
      }
      return parsedDataInvoices;
    }
    return [];
  } catch (error) {
    console.log({ErrorReadingData: error});
    return [];
  }
};

const addInvoice = async (invoice: InvoiceData) => {
  const {createdAt, from, to, amount, memo, confirmed} = invoice;
  try {
    let invoiceListStored = await AsyncStorage.getItem(
      AsyncStorageKey.INVOICE_HISTORY_LIST,
    );
    let item: InvoiceData | null = {
      createdAt,
      from,
      to,
      amount,
      memo,
      confirmed,
    };
    let invoiceList: InvoiceData[] = [];
    if (!invoiceListStored) {
      invoiceList.push(item);
    } else {
      invoiceList = JSON.parse(invoiceListStored);
      if (!invoiceList.find(invoiceStored => invoiceStored.memo === memo)) {
        invoiceList.push(item);
      } else {
        item = null;
      }
    }
    if (item) {
      await AsyncStorage.setItem(
        AsyncStorageKey.INVOICE_HISTORY_LIST,
        JSON.stringify(invoiceList),
      );
    } else {
      console.log('Already stored!');
    }
  } catch (error) {
    console.log({ErrorStorage: error});
  }
};

const updateInvoice = async (
  memo: string,
  from: string,
  confirmed: boolean,
) => {
  try {
    let invoiceListStored = await AsyncStorage.getItem(
      AsyncStorageKey.INVOICE_HISTORY_LIST,
    );
    let invoiceList: InvoiceData[] = [];
    if (invoiceListStored) {
      invoiceList = JSON.parse(invoiceListStored);
      const foundIndex = invoiceList.findIndex(
        invoice => invoice.memo === memo,
      );
      invoiceList[foundIndex].confirmed = confirmed;
      invoiceList[foundIndex].updatedAt = moment().unix().toString();
      invoiceList[foundIndex].from = from;
      invoiceListStored = JSON.stringify(invoiceList);
      await AsyncStorage.setItem(
        AsyncStorageKey.INVOICE_HISTORY_LIST,
        invoiceListStored,
      );
    } else {
      throw new Error(
        'Cannot update records as store is empty in Asyncstorage',
      );
    }
  } catch (error) {
    console.log({ErrorUpdateInvoice: error});
  }
};

const deleteInvoice = async (memo: string) => {
  try {
    let invoiceListStored = await AsyncStorage.getItem(
      AsyncStorageKey.INVOICE_HISTORY_LIST,
    );
    let invoiceList: InvoiceData[] = [];
    if (invoiceListStored) {
      invoiceList = JSON.parse(invoiceListStored);
      const updatedList = invoiceList.filter(invoice => invoice.memo !== memo);
      await AsyncStorage.setItem(
        AsyncStorageKey.INVOICE_HISTORY_LIST,
        JSON.stringify(updatedList),
      );
    }
  } catch (error) {
    console.log({ErrorDeleteInvoice: error});
  }
};

export const AsyncStorageUtils = {
  getAllInvoices,
  addInvoice,
  updateInvoice,
  deleteInvoice,
  getInvoice,
};
