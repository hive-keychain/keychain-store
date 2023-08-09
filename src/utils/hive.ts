import {Client} from '@hiveio/dhive';

const getClient = new Client([
  'https://api.hive.blog',
  'https://api.hivekings.com',
  'https://anyx.io',
  'https://api.openhive.network',
]);

const getLastTransactionsOnUser = async (
  username: string,
  limitQueryTo?: number,
) => {
  const transactions = await getClient.call(
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

export const HiveUtils = {getClient, getLastTransactionsOnUser};
