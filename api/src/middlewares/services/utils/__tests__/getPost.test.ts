import { getPost } from "../getPost";

test("getPost returns the correct post for countries with one post", () => {
  expect(getPost("Albania", "affirmation")).toBe("the British Embassy Tirana");
  expect(getPost("Algeria", "affirmation")).toBe("the British Embassy Algiers");
  expect(getPost("Austria", "affirmation")).toBe("the British Embassy Vienna");
});

test("getPost returns the correct post if the post is specified", () => {
  expect(getPost("Turkey", "affirmation", "the British Consulate General Istanbul")).toBe("the British Consulate General Istanbul");
  expect(getPost("Turkey", "affirmation", "the British Embassy Ankara")).toBe("the British Embassy Ankara");
  expect(getPost("Vietnam", "affirmation", "the British Embassy Hanoi")).toBe("the British Embassy Hanoi");
  expect(getPost("Vietnam", "affirmation", "the British Consulate General Ho Chi Minh City")).toBe("the British Consulate General Ho Chi Minh City");
});

test("getPost returns the correct post if the country has multiple posts but a post has been specified", () => {
  expect(getPost("Italy", "affirmation", "the British Embassy Rome")).toBe("the British Embassy Rome");
});

test("getPost returns the correct post if the country has multiple posts but no post has been specified", () => {
  expect(getPost("Italy", "affirmation")).toBe("the British Embassy Rome");
});
