import * as fields from "./fixtures/fields";
import { reorderers } from "../reorderers";

/**
 * Tests to catch whether any reorderers have changed.
 * check if `./fixtures/fields` should be updated with new or changed fields before updating the snapshots.
 */

test("affirmation is successfully remapped", () => {
  const reordered = reorderers.affirmation(fields.affirmation.reorder);
  expect(reordered).toMatchSnapshot();
});

test("CNI and MSC by post is successfully remapped", () => {
  const reordered = reorderers.cniAndMscPostal(fields.CNIAndMSC.reorder);
  expect(reordered).toMatchSnapshot();
});

test("CNI by post is successfully remapped", () => {
  const reordered = reorderers.cni(fields.cniPostal.reorder);
  expect(reordered).toMatchSnapshot();
});

test("Exchange is successfully remapped", () => {
  const reordered = reorderers.exchange(fields.exchange.reorder);
  expect(reordered).toMatchSnapshot();
});

test("MSC by post is successfully remapped", () => {
  const reordered = reorderers.mscPostal(fields.msc.reorder);
  expect(reordered).toMatchSnapshot();
});
