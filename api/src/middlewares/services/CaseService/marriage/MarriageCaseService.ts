import logger, { Logger } from "pino";
import { QueueService } from "../../QueueService";
import { OrbitCaseService } from "../types/CaseService";
import { ApplicationError } from "../../../../ApplicationError";

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
      // This reference will be shown to the user on the application complete page.
      // return reference;
    } catch (err) {
      // handle response errors etc.
      if (err.response) {
        // add additional logging:
        this.logger.error({ err }, "Case management api responded with an error");
        // This error will be logged, ensure that `ORBIT_ERROR` has been added to alerting.
        throw new ApplicationError("ORBIT", "ORBIT_ERROR", err.response.statusCode);
      }

      throw new ApplicationError("ORBIT", "ORBIT_ERROR", 500);
    }
  }
}
