import { Logger } from "pino";
import { PayMetadata } from "../../../../types/FormDataBody";
import { PaymentViewModel } from "./PaymentViewModel";
import { AlertJob } from "../../utils/types";
export interface CaseServiceBaseType {
  logger: Logger;

  /**
   * Parses the payment data in metadata
   * TODO:- refactor into own class or function
   */
  paymentViewModel(payment: PayMetadata | undefined, country: string): PaymentViewModel | undefined;

  /**
   * builds the data required for an onComplete handler.
   */
  getPostAlertData(country: string, post: string, reference: string): AlertJob | undefined;
}
