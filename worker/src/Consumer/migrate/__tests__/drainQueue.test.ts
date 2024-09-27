import * as migrateHelpers from "../helpers";
jest.mock("../helpers");

import { drainQueue } from "../drainQueue";

const getSchemaVersion = jest.spyOn(migrateHelpers, "getSchemaVersion");
const getInflightMessages = jest.spyOn(migrateHelpers, "getInflightMessages");
const migrateInflightMessages = jest.spyOn(migrateHelpers, "migrateInflightMessagesFromV9");

beforeEach(() => {
  jest.resetAllMocks();
});

test("Queue does not drain if schema versions are the same", async () => {
  getSchemaVersion.mockResolvedValueOnce(20).mockResolvedValueOnce(20);

  await drainQueue("test", "drainSchema");

  expect(getSchemaVersion).toBeCalledTimes(2);
  expect(getInflightMessages).not.toBeCalled();
  expect(migrateInflightMessages).not.toBeCalled();
});

test("Queue does not drain if no inflight messages are found", async () => {
  getSchemaVersion
    .mockResolvedValueOnce(23) // schemaCheck
    .mockResolvedValueOnce(20); // drainSchema check
  getInflightMessages.mockResolvedValueOnce([]);

  await drainQueue("test", "drainSchema");

  expect(getInflightMessages).toBeCalled();
  expect(migrateInflightMessages).not.toBeCalled();
});

test("drainQueue does not drain if drainSchema is not v20", async () => {
  getSchemaVersion
    .mockResolvedValueOnce(23) // schemaCheck
    .mockResolvedValueOnce(21); // drainSchema check

  await drainQueue("test", "drainSchema");

  expect(getInflightMessages).not.toBeCalled();
  expect(migrateInflightMessages).not.toBeCalled();
});

test("drainQueue does not drain if drainSchema version is larger than schema version", async () => {
  getSchemaVersion
    .mockResolvedValueOnce(15) // schemaCheck
    .mockResolvedValueOnce(20); // drainSchema check

  await drainQueue("test", "drainSchema");

  expect(getInflightMessages).not.toBeCalled();
  expect(migrateInflightMessages).not.toBeCalled();
});

test("Queue attempts to drain if inflight messages are found", async () => {
  getSchemaVersion
    .mockResolvedValueOnce(23) // schemaCheck
    .mockResolvedValueOnce(20); // drainSchema check
  getInflightMessages.mockResolvedValueOnce([{ id: "1" }, { id: "2" }]);

  await drainQueue("test", "drainSchema");
  expect(getInflightMessages).toBeCalled();
  expect(migrateInflightMessages).toBeCalled();
});

test("drainQueue rethrows if getSchemaVersion throws", async () => {
  getSchemaVersion.mockRejectedValue(new Error("DB error"));

  await expect(drainQueue("test", "drain")).rejects.toThrow();
  expect(getInflightMessages).not.toBeCalled();
  expect(migrateInflightMessages).not.toBeCalled();
});

test("drainQueue rethrows if getInflightMessages throws", async () => {
  getSchemaVersion
    .mockResolvedValueOnce(23) // schemaCheck
    .mockResolvedValueOnce(20); // drainSchema check
  getInflightMessages.mockRejectedValue(new Error("DB error"));

  await expect(drainQueue("test", "drain")).rejects.toThrow();
  expect(getInflightMessages).toBeCalled();
  expect(migrateInflightMessages).not.toBeCalled();
});

test("drainQueue rethrows if migrateInflightMessagesFromV9 throws", async () => {
  getSchemaVersion
    .mockResolvedValueOnce(23) // schemaCheck
    .mockResolvedValueOnce(20); // drainSchema check
  getInflightMessages.mockResolvedValueOnce([{ id: 1 }]);
  migrateInflightMessages.mockRejectedValueOnce(new Error());

  await expect(drainQueue("test", "drain")).rejects.toThrow();
});
