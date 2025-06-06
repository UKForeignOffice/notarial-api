import * as fields from "./fixtures/fields";
import { reorderSectionsWithNewName } from "../../utils/reorderSectionsWithNewName";
import { order } from "../mappings";

/**
 * Tests to catch whether any reorderers have changed.
 * check if `./fixtures/fields` should be updated with new or changed fields before updating the snapshots.
 */

test("consularLetter is successfully remapped", () => {
  const reordered = reorderSectionsWithNewName(order)(fields.consularLetter.reorder);
  expect(reordered).toMatchSnapshot();
});
