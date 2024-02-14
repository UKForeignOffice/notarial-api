import { getPostEmailAddress } from "../getPostEmailAddress";

describe("returns an email address for a country with multiple posts", () => {
  it("returns the post's email address if it is defined", () => {
    expect(getPostEmailAddress("Turkey", "British Consulate General Istanbul")).toBe("pye@cautionyourblast.com");
  });
  it("returns the country's email address if the post is not defined", () => {
    expect(getPostEmailAddress("Turkey", "British Consulate General Istanbul")).toBe("pye@cautionyourblast.com");
  });

  it("returns the default email address if the country and post are not defined", () => {
    expect(getPostEmailAddress("no-country")).toBe("pye@cautionyourblast.com");
  });
});
