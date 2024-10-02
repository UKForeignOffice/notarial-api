import { getFormType } from "../getFormType";

test("Returns the correct form type from the service field if the service field is available", () => {
  const type = "cni";
  const answers = {
    service: "cniAndMsc",
  };
  expect(getFormType(answers, type)).toBe("cniAndMsc");
});

test("Returns the correct form type from the over 16 field if the over 16 field is available", () => {
  const type = "certifyCopyAdult";
  const answers = {
    over16: false,
  };
  expect(getFormType(answers, type)).toBe("certifyCopyChild");
});

test("Returns the correct form type from the type field if service and over 16 field aren't available", () => {
  const type = "cni";
  const answers = {};

  expect(getFormType(answers, type)).toBe("cni");
});
