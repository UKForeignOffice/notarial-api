import { PayMetadata } from "../../../../types/FormDataBody";
import config from "config";
import { getPostEmailAddress } from "../../utils/getPostEmailAddress";
import logger, { Logger } from "pino";
import { CaseServiceBaseType } from "../types/CaseServiceBase";

export abstract class CaseServiceBase implements CaseServiceBaseType {
  logger: Logger;
  templates: {
    SES: HandlebarsTemplateDelegate;
    Notify: Record<"postAlert", string>;
  };

  protected constructor(sesTemplate: HandlebarsTemplateDelegate, postAlertTemplate: string) {
    this.logger = logger().child({ service: "SES" });
    this.templates = {
      SES: sesTemplate,
      Notify: {
        postAlert: postAlertTemplate,
      },
    };
  }
  paymentViewModel(payment: PayMetadata | undefined, country: string) {
    if (!payment) {
      return;
    }
    const paymentUrl = new URL(payment.payId, config.get<string>("Pay.accountTransactionsUrl"));
    const allTransactionsByCountryUrl = new URL(config.get<string>("Pay.accountTransactionsUrl"));
    const total = payment.total ? (payment.total / 100).toFixed(2) : "Unpaid";
    allTransactionsByCountryUrl.searchParams.set("metadataValue", country);

    return {
      id: payment.payId,
      status: payment.state.status === "success" ? "success" : "cancelled or failed",
      url: paymentUrl.toString(),
      total,
      allTransactionsByCountry: {
        url: allTransactionsByCountryUrl.toString(),
        country,
      },
    };
  }

  getPostAlertData(country: string, post: string, reference: string) {
    const emailAddress = getPostEmailAddress(post);
    if (!emailAddress) {
      this.logger.error(
        { code: "UNRECOGNISED_SERVICE_APPLICATION" },
        `No email address found for the specified post – ${country} - ${post} – reference ${reference}.`
      );
      return;
    }

    return {
      template: this.templates.Notify.postAlert,
      emailAddress,
      reference,
      options: {
        personalisation: {
          post,
          reference,
        },
        reference,
      },
    };
  }
}
