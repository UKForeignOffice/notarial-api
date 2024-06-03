import { getPost } from "../getPost";

test("getPost returns the correct post for countries with one post", () => {
  expect(getPost("Albania")).toBe("the British Embassy Tirana");
  expect(getPost("Algeria")).toBe("the British Embassy Algiers");
  expect(getPost("Austria")).toBe("the British Embassy Vienna");
});

test("getPost returns the correct post if the post is specified", () => {
  expect(getPost("Turkey", "the British Consulate General Istanbul")).toBe("the British Consulate General Istanbul");
  expect(getPost("Turkey", "the British Embassy Ankara")).toBe("the British Embassy Ankara");
  expect(getPost("Vietnam", "the British Embassy Hanoi")).toBe("the British Embassy Hanoi");
  expect(getPost("Vietnam", "the British Consulate General Ho Chi Minh City")).toBe("the British Consulate General Ho Chi Minh City");
});

test("getPost returns the correct post if the country has multiple posts but a post has been specified", () => {
  expect(getPost("Italy", "British Embassy Rome")).toBe("British Embassy Rome");
  expect(getPost("Russia", "British Embassy Moscow")).toBe("British Embassy Moscow");
});

test("getPost returns the correct post if the country has multiple posts but no post has been specified", () => {
  expect(getPost("Italy")).toBe("British Embassy Rome");
  expect(getPost("Russia")).toBe("British Embassy Moscow");
});
