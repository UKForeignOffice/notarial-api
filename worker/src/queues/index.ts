import { getConsumer } from "../Consumer";
import { setupNotifyWorker } from "./notify";
import { setupSesQueueWorker } from "./ses";

getConsumer().then(async () => {
  await setupNotifyWorker();
  await setupSesQueueWorker();
});
