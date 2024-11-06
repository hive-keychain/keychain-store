import {Client} from '@hiveio/dhive';

const DEFAULT_RPC_LIST = [
  'https://api.hive.blog',
  'https://api.hivekings.com',
  'https://anyx.io',
  'https://api.openhive.network',
];

let client = new Client(DEFAULT_RPC_LIST);

const getClient = () => client;

const getLastTransactionsOnUser = async (
  username: string,
  limitQueryTo?: number,
) => {
  const transactions = await getClient().call(
    'condenser_api',
    'get_account_history',
    [username, -1, limitQueryTo ?? 10],
  );
  const lastTransfers: any[] = transactions.map((e: any) => {
    let specificTransaction = null;
    switch (e[1].op[0]) {
      case 'transfer': {
        specificTransaction = e[1].op[1];
        break;
      }
    }
    return specificTransaction;
  });
  return lastTransfers;
};

const checkIfUserExists = async (username: string) => {
  const extendedAccount = await getClient().database.getAccounts([username]);
  if (extendedAccount.length) {
    return true;
  }
  return false;
};

const getHBDPrice = async () => {
  const price = await getClient().database.getCurrentMedianHistoryPrice();
  return price.base.amount;
};

export const HiveUtils = {
  getClient,
  getLastTransactionsOnUser,
  checkIfUserExists,
  getHBDPrice,
};
