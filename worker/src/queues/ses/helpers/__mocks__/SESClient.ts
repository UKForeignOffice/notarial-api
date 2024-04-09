import { MockProxy } from "jest-mock-extended";
import { SESv2Client } from "@aws-sdk/client-sesv2";
import { sesClient } from "../sesClient";

jest.mock("../SESClient", () => ({
  __esModule: true,
  ses: {
    send: jest.fn(),
  },
}));

export const ses = sesClient as unknown as MockProxy<SESv2Client>;
