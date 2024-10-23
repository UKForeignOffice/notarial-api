import { PayMetadata } from "../../../../types/FormDataBody";
import config from "config";
import { PaymentData } from "../types";

export function PaymentViewModel(payment: PayMetadata | undefined, countryOrService: string): PaymentData | undefined {
  if (!payment) {
    return;
  }
  const paymentUrl = new URL(payment.payId, config.get<string>("Pay.accountTransactionsUrl"));
  const allTransactionsByCountryUrl = new URL(config.get<string>("Pay.accountTransactionsUrl"));
  const total = payment.total ? (payment.total / 100).toFixed(2) : "Unpaid";
  allTransactionsByCountryUrl.searchParams.set("metadataValue", countryOrService);

  return {
    id: payment.payId,
    status: payment.state.status === "success" ? "success" : "cancelled or failed",
    url: paymentUrl.toString(),
    total,
    allTransactionsByCountry: {
      url: allTransactionsByCountryUrl.toString(),
      country: countryOrService,
      service: countryOrService,
    },
  };
}
