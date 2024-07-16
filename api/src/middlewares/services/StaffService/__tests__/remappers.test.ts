import { remappers } from "../remappers";
import { fields } from "./fixtures/fields";

test("affirmation is successfully remapped", () => {
  const remapped = remappers.affirmation(fields);
  expect(remapped).toMatchSnapshot();
});

test("CNIAndMSC is successfully remapped", () => {
  const remapped = remappers.cniAndMscPostal(fields);
  expect(remapped).toMatchSnapshot();
});

test("cniPostal is successfully remapped", () => {
  const remapped = remappers.cniPostal(fields);
  expect(remapped).toMatchSnapshot();
});

test("exchange is successfully remapped", () => {
  const remapped = remappers.exchange(fields);
  expect(remapped).toMatchSnapshot();
});

test("msc is successfully remapped", () => {
  const remapped = remappers.mscPostal(fields);
  expect(remapped).toMatchSnapshot();
});
