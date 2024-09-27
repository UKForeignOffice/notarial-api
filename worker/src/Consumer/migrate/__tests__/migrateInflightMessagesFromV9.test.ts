import { Pool } from "pg";
import { migrateInflightMessagesFromV9 } from "../helpers";

jest.mock("pg", () => {
  const mockPool = {
    connect: jest.fn().mockReturnThis(),
    query: jest.fn(),
    end: jest.fn(),
    on: jest.fn(),
    release: jest.fn(),
  };
  return { Pool: jest.fn(() => mockPool) };
});

let pool;

beforeEach(() => {
  pool = new Pool();
});

test("Rollback is called if transaction fails", async () => {
  pool.query
    .mockResolvedValueOnce() // BEGIN query
    .mockRejectedValue(new Error("DB error"));

  const query = pool.query;
  await expect(migrateInflightMessagesFromV9("test", "pgboss")).rejects.toThrow();
  expect(pool.connect).toBeCalled();
  expect(query).toBeCalledTimes(3);
  expect(query.mock.calls[0]).toStrictEqual(["BEGIN"]);
  expect(query.mock.calls[1][0]).toContain("INSERT INTO pgboss.job");
  expect(pool.query).toHaveBeenCalledWith("ROLLBACK");
});
