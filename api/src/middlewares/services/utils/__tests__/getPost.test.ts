import { getPostForMarriage, getPostForCertifyCopy } from "../getPost";

test("getPost returns the correct post for countries with one post", () => {
  expect(getPostForMarriage("Algeria")).toBe("the British Embassy Algiers");
  expect(getPostForMarriage("Austria")).toBe("the British Embassy Vienna");
});

test("getPost returns the correct post if the post is specified", () => {
  expect(getPostForMarriage("Turkey", "the British Consulate General Istanbul")).toBe("the British Consulate General Istanbul");
  expect(getPostForMarriage("Turkey", "the British Embassy Ankara")).toBe("the British Embassy Ankara");
  expect(getPostForMarriage("Vietnam", "the British Embassy Hanoi")).toBe("the British Embassy Hanoi");
  expect(getPostForMarriage("Vietnam", "the British Consulate General Ho Chi Minh City")).toBe("the British Consulate General Ho Chi Minh City");
});

test("getPost returns the correct post if the country has multiple posts but a post has been specified", () => {
  expect(getPostForMarriage("Italy", "the British Embassy Rome")).toBe("the British Embassy Rome");
});

test("getPost returns the correct post if the country has multiple posts but no post has been specified", () => {
  expect(getPostForMarriage("Italy")).toBe("the British Embassy Rome");
});

test("getPostForCertifyCopy returns the correct post for a certify copy form instead of a marriage form", () => {
  expect(getPostForCertifyCopy("Vietnam")).toBe("the British embassy Hanoi");
});
