import { PayMetadata } from "../../../../../types/FormDataBody";
import { PaymentViewModel } from "../PaymentViewModel";

test("paymentViewModel returns undefined when no payment is provided", () => {
  const result = PaymentViewModel(undefined, "italy");
  expect(result).toBeUndefined();
});

test("paymentViewModel returns a PaymentViewModel", () => {
  const payMetadata: PayMetadata = {
    payId: "123",
    reference: "ref",
    state: {
      status: "success",
      finished: true,
    },
    total: 10000,
  };
  const result = PaymentViewModel(payMetadata, "italy");
  expect(result).toEqual({
    allTransactionsByCountry: {
      country: "italy",
      service: "italy",
      url: "https://selfservice.payments.service.gov.uk/account/ACCOUNT_ID/transactions?metadataValue=italy",
    },
    id: "123",
    status: "success",
    url: "https://selfservice.payments.service.gov.uk/account/ACCOUNT_ID/123",
    total: "100.00",
  });
});
