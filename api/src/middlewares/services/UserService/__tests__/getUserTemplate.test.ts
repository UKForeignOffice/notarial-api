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
  expect(getUserTemplate("Brazil", true, "cni")).toBe("userPostalConfirmation");
});

test("Returns in-person template if the form has the metadata value postal: false", () => {
  expect(getUserTemplate("Turkey", false, "cni")).toBe("userConfirmation");
});

test("Returns correct postal value from country if the form has no postal metadata value and is using the exchange journey", () => {
  expect(getUserTemplate("Turkey", undefined, "exchange")).toBe("userPostalConfirmation");
});

test("Returns correct postal value from country if the form has no postal value and the user is submitting an affirmation", () => {
  expect(getUserTemplate("Turkey", undefined, "affirmation")).toBe("userConfirmation");
});

test("Returns correct postal value from country if the form has no postal metadata, but the user is submitting a cni", () => {
  expect(getUserTemplate("Sweden", undefined, "cni")).toBe("userConfirmation");
});
