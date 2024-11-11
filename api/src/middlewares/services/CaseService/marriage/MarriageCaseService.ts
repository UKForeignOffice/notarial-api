import logger, { Logger } from "pino";
import { QueueService } from "../../QueueService";
import { OrbitCaseService } from "../types/CaseService";

export class MarriageCaseService implements OrbitCaseService {
  logger: Logger;
  queueService: QueueService;

  constructor({ queueService }) {
    this.queueService = queueService;

    this.logger = logger().child({ service: "MarriageCaseService" });
  }

  async send(data): Promise<string> {
    /**
     * TODO: This can be implemented to POST to Case Management Service, or handled by the form runner directly.
     * In which case this method should be a "no-op", or unimplemented entirely.
     */
    try {
      // const { reference } = postRequest(data);
      // return reference;
    } catch (e) {
      // handle response errors etc.
    }
  }
}
