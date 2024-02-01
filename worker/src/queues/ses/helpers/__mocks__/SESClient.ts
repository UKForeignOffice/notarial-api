import { MockProxy } from "jest-mock-extended";
import { SESClient } from "@aws-sdk/client-ses";
import { sesClient } from "../sesClient";

jest.mock("../SESClient", () => ({
  __esModule: true,
  ses: {
    send: jest.fn(),
  },
}));

export const ses = sesClient as unknown as MockProxy<SESClient>;
