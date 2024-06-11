import { getUserTemplate } from "../getUserTemplate";
import * as additionalContexts from "../../utils/additionalContexts.json";

jest.mock("../../utils/additionalContexts.json", () => {
  return {
    countries: {
      Turkey: {
        postal: true,
      },
    },
  };
});

test("Returns postal template if the form has the metadata value postal: true", () => {
  expect(getUserTemplate("Brazil", "cni", true)).toBe("userPostalConfirmation");
});

test("Returns in-person template if the form has the metadata value postal: false", () => {
  expect(getUserTemplate("Turkey", "cni", false)).toBe("userConfirmation");
});

test("Returns correct postal value from country if the form has no postal metadata value and is using the exchange journey", () => {
  expect(getUserTemplate("Turkey", "exchange")).toBe("userPostalConfirmation");
});

test("Returns correct postal value from country if the form has no postal value and the user is submitting an affirmation", () => {
  expect(getUserTemplate("Turkey", "affirmation")).toBe("userConfirmation");
});

test("Returns correct postal value from country if the form has no postal metadata, but the user is submitting a cni", () => {
  expect(getUserTemplate("Sweden", "cni")).toBe("userConfirmation");
});
