import { getPostEmailAddress } from "../getPostEmailAddress";

test("returns the post's email address if it is defined", () => {
  expect(getPostEmailAddress("Albania")).toBe("pye@cautionyourblast.com");
});
test("returns undefined if the post could not be foudn", () => {
  expect(getPostEmailAddress("Turkey", "British Consulate General Istanbul")).toBeUndefined();
});
