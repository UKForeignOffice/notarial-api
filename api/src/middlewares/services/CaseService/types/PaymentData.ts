export type PaymentData = {
  id: string;
  status: string;
  total: string;
  url: string;
  allTransactionsByCountry: {
    url: string;
    country: string;
  };
};
