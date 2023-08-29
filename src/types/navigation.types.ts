export type MainDrawerParamList = {
  Home:
    | {
        toConfirmOperation: {
          store: string;
          memo: string;
          amount: string;
        };
      }
    | undefined;
  History: undefined;
  Settings: undefined;
  InvoiceSuccess:
    | {
        confirmedOperation: {
          from: string;
          to: string;
          amount: string;
          memo: string;
          updatedAt: string;
          createdAt: string;
        };
      }
    | undefined;
};
