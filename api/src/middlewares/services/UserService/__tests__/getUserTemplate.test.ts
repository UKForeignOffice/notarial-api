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
  expect(getUserTemplate("Brazil", true)).toBe("userPostalConfirmation");
});

test("Returns in-person template if the form has the metadata value postal: false", () => {
  expect(getUserTemplate("Turkey", false)).toBe("userConfirmation");
});

test("Returns correct postal value from country if the form has no postal metadata value", () => {
  expect(getUserTemplate("Turkey")).toBe("userPostalConfirmation");
});
