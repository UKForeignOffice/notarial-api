import { getPostEmailAddress } from "../getPostEmailAddress";

test("returns the post's email address if it is defined", () => {
  expect(getPostEmailAddress("Albania")).toBe("pye+albania@cautionyourblast.com");
});
test("returns undefined if the post could not be found", () => {
  expect(getPostEmailAddress("Turkey", "British Consulate General Istanbul")).toBeUndefined();
});
