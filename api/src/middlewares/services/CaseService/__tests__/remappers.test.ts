import { remappers } from "../remappers";
import * as fields from "./fixtures/fields";

/**
 * Tests to catch whether any remappers have changed.
 * check if `./fixtures/fields` should be updated with new or changed fields before updating the snapshots.
 */

test("affirmation is successfully remapped", () => {
  const remapped = remappers.affirmation(fields.affirmation.remap);
  expect(remapped).toMatchSnapshot();
});

test("CNIAndMSC is successfully remapped", () => {
  const remapped = remappers.cniAndMscPostal(fields.CNIAndMSC.remap);
  expect(remapped).toMatchSnapshot();
});

test("cniPostal is successfully remapped", () => {
  const remapped = remappers.cniPostal(fields.cniPostal.remap);
  expect(remapped).toMatchSnapshot();
});

test("exchange is successfully remapped", () => {
  const remapped = remappers.exchange(fields.exchange.remap);
  expect(remapped).toMatchSnapshot();
});

test("msc is successfully remapped", () => {
  const remapped = remappers.mscPostal(fields.msc.remap);
  expect(remapped).toMatchSnapshot();
});
