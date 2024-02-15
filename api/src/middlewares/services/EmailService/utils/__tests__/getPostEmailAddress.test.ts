import { getPostEmailAddress } from "../getPostEmailAddress";

test("returns the post's email address if it is defined", () => {
  expect(getPostEmailAddress("Albania")).toBe("pye@cautionyourblast.com");
});
test("returns the country's email address if the post is not defined", () => {
  expect(getPostEmailAddress("Turkey", "British Consulate General Istanbul")).toBeUndefined();
});
