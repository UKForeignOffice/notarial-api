import * as fields from "./fixtures/fields";
import { createRemapper } from "../../utils/createRemapper";
import { remap } from "../mappings";

/**
 * Tests to catch whether any remappers have changed.
 * check if `./fixtures/fields` should be updated with new or changed fields before updating the snapshots.
 */

test("certifyCopy is successfully remapped", () => {
  const remapped = createRemapper(remap)(fields.certifyCopy.remap);
  expect(remapped).toMatchSnapshot();
});
