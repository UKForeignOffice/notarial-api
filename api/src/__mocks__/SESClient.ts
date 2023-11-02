import { ses as sesClient } from "../SESClient";
import { MockProxy } from "jest-mock-extended";
import { SESClient } from "@aws-sdk/client-ses";

jest.mock("../SESClient", () => ({
  __esModule: true,
  ses: {
    send: jest.fn(),
  },
}));

export const ses = sesClient as unknown as MockProxy<SESClient>;
