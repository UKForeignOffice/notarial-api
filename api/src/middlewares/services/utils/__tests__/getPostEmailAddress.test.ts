import { getPostEmailAddress } from "../getPostEmailAddress";

test("returns the post's email address if it is defined", () => {
  expect(getPostEmailAddress("Albania", "affirmation")).toBe("pye+albania@cautionyourblast.com");
});

test("returns undefined if the post could not be found", () => {
  expect(getPostEmailAddress("Turkey", "affirmation", "British Consulate General Istanbul")).toBeUndefined();
});

test("returns a post email address if the country has multiple posts but no post was passed in", () => {
  expect(getPostEmailAddress("Italy", "affirmation")).toBe("pye+rome@cautionyourblast.com");
});

test("returns undefined the post is undefined, and there is no default for that country", () => {
  expect(getPostEmailAddress("France", "affirmation")).toBeUndefined();
});
