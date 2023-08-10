export type MainDrawerParamList = {
  Home: undefined;
  History: undefined;
  InvoiceSuccess:
    | {
        confirmedOperation: {
          from: string;
          to: string;
          amount: string;
          memo: string;
        };
      }
    | undefined;
};
