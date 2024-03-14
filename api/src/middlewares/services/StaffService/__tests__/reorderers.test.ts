import { remapped } from "./fixtures/fields";
import { reorderers } from "../reorderers";

test("affirmation is successfully remapped", () => {
  const reordered = reorderers.affirmation(remapped);
  expect(reordered).toMatchSnapshot();
});
