import { getUserTemplate } from "../getUserTemplate";

jest.mock("../../utils/additionalContexts.json", () => {
  return {
    countries: {
      Turkey: {
        postal: true,
      },
      Sweden: {
        postal: true,
        cniDelivery: true,
      },
      Russia: {
        postal: true,
        cniDelivery: false,
      },
      Croatia: {
        postal: true,
        cniDelivery: true,
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

test("Returns correct postal value from country if the form has no postal value and the user is submitting an affirmation", () => {
  expect(getUserTemplate("Turkey", "affirmation")).toBe("userConfirmation");
});

test("Returns correct template from country if the form has no postal metadata, but the user is submitting a cni", () => {
  expect(getUserTemplate("Sweden", "cni")).toBe("userConfirmation");
});

test("returns correct template from country if the form has no postal metadata, the user is submitting an exchange, and the country allows postal exchange", () => {
  expect(getUserTemplate("Sweden", "exchange")).toBe("userPostalConfirmation");
});

test("returns correct template from country if the form has no postal metadata, the user is submitting an exchange, and the country does not allow postal exchange", () => {
  expect(getUserTemplate("Russia", "exchange")).toBe("userConfirmation");
});

test("returns the correct template for exchange if the country is Croatia", () => {
  expect(getUserTemplate("Croatia", "exchange")).toBe("userConfirmation");
});
