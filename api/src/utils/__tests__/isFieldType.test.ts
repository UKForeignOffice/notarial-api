import { isFieldType } from "../isFieldType";
import { isNotFieldType } from "../isNotFieldType";

const field = { key: "favEgg", answer: "eggs", title: "what is your favourite egg", type: "file" };

test("isFieldType", () => {
  const fileField = field;
  const textField = { ...field, type: "text" };
  const isFileType = isFieldType("file");
  expect(isFileType(field)).toBe(true);
  expect(isFileType(textField)).toBe(false);
  expect(isFileType({ ...field, type: "not a file" })).toBe(false);
  expect([field, textField].filter(isFileType)).toStrictEqual([fileField]);
});

test("isNotFieldType", () => {
  const textField = { ...field, type: "text" };
  const isNotFileType = isNotFieldType("file");

  expect(isNotFileType(textField)).toBe(true);
  expect(isNotFileType(field)).toBe(false);

  expect(isNotFileType({ ...field, type: "not a file" })).toBe(true);
  expect([field, textField].filter(isNotFileType)).toStrictEqual([textField]);
});
