import { SESClient } from "@aws-sdk/client-ses";

export const ses = new SESClient({
  region: "eu-west-2",
});
