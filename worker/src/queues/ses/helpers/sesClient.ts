import { SESClient } from "@aws-sdk/client-ses";

export const sesClient = new SESClient({
  region: "eu-west-2",
});
