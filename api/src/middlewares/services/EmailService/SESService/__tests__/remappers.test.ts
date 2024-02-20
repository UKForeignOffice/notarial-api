import { remappers } from "../remappers";
import { fields } from "./fixtures/fields";

test("affirmation is successfully remapped", () => {
  const remapped = remappers.affirmation(fields);
  expect(remapped).toMatchSnapshot();
});
