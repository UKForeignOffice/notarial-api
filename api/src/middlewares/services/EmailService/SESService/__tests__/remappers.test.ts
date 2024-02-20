import { remappers } from "../remappers";
import { fields } from "./fixtures/fields";

test("affirmation is successfully remapped", () => {
  const toAffirmation = remappers.toAffirmation;
  const remapped = fields.reduce(toAffirmation, {});
  expect(remapped).toMatchSnapshot();
});
