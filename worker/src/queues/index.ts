import { getConsumer } from "../Consumer";
import { setupNotifyWorker } from "./notify";
import { setupSesQueueWorker } from "./ses";

getConsumer().then(() => {
  setupNotifyWorker();
  setupSesQueueWorker();
});
