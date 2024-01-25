import * as helpers from "../helpers";
import { populateConditionsArray } from "../helpers";
test("validate returns a list of missing fields if missing fields are present", () => {
  const requiredFields = {
    "field 1": "field1",
    "field 2": "field2",
    "field 4": "field4",
  };
  const availableFields = ["field 1", "field 2", "field 3"];
  expect(helpers.validate(availableFields, requiredFields)).toEqual(["field 4"]);
});
test("getRelevantFields returns only the requested fields from a row object", () => {
  const relevantFields = ["country", "type", "postal"];
  const row = {
    country: "Austria",
    type: "affirmation",
    capital: "Vienna",
    postal: "Yes",
  };
  expect(helpers.getRelevantFields(row, relevantFields)).toEqual({
    country: "Austria",
    type: "affirmation",
    postal: "Yes",
  });
});
test("determineBookingFamily returns posts if there are multiple booking links for the same country", () => {
  const rows = [
    {
      country: "Austria",
    },
    {
      country: "Austria",
    },
    {
      country: "Bolivia",
    },
  ];
  const currentRow = {
    country: "Austria",
  };
  expect(helpers.determineBookingContentFamily(rows, currentRow)).toBe("posts");
});
test("determineBookingFamily returns countries if there's only one booking link for the country", () => {
  const rows = [
    {
      country: "Austria",
    },
    {
      country: "Bolivia",
    },
    {
      country: "Chile",
    },
  ];
  const currentRow = {
    country: "Austria",
  };
  expect(helpers.determineBookingContentFamily(rows, currentRow)).toBe("countries");
});
test("bulletsToHtml returns valid html content if plain text with asterisks is passed in", () => {
  const bulletsString = `* item 1 * item 2 some other content`;
  expect(helpers.bulletsToHtml(bulletsString)).toEqual("<li> item 1 </li><li> item 2 some other content</li>");
});
test("splitRow correctly splits a csv row into its fields", () => {
  const row = "Austria,Vienna,Affirmation,Austrian residence permit,Yes";
  expect(helpers.splitRow(row)).toEqual(["Austria", "Vienna", "Affirmation", "Austrian residence permit", "Yes"]);
});
test("convertToObjectWithKeys correctly pulls out the required fields from a row and builds them into an object", () => {
  const fieldMap = {
    Country: "country",
    "Service type": "type",
    "Has postal service": "postal",
  };
  const firstRow = ["Country", "Capital", "Service type", "Additional docs", "Has postal service"];
  const row = ["Austria", "Vienna", "Affirmation", "Austrian residence permit", "Yes"];
  const convertToRowObject = helpers.convertToObjectWithKeys(firstRow, fieldMap);
  expect(convertToRowObject(row)).toEqual({
    country: "Austria",
    type: "Affirmation",
    postal: "Yes",
  });
});
test("breaksToHtml returns valid html content if plain text with <br> tags is passed in", () => {
  const breaksString = `<br>Some text<br>and some other text<br>even more content`;
  expect(helpers.breaksToHtml(breaksString)).toEqual(
    `<p class="govuk-body">Some text</p><p class="govuk-body">and some other text</p><p class="govuk-body">even more content</p>`
  );
});
test("populateConditionsArray returns undefined if there are no valid rows", () => {
  const conditionConfig = {
    evaluateField: "nice",
    evaluateValue: ["Yes"],
    useField: "type",
    defaultDisplayName: "Egg type is nice",
    formField: {
      name: "type",
      displayName: "Is the egg nice",
      type: "YesNoField",
    },
    section: "eggVerdict",
    operation: "is",
  };
  const rows = [
    {
      type: "boiled",
      nice: "No",
    },
    {
      type: "poached",
      nice: "No",
    },
    {
      type: "omelette",
      nice: "No",
    },
  ];
  expect(populateConditionsArray(rows, conditionConfig)).toBe(false);
});
test("populateConditionsArray returns only valid conditions from an array of rows", () => {
  const conditionConfig = {
    evaluateField: "nice",
    evaluateValue: ["Yes"],
    useField: "type",
    defaultDisplayName: "Egg type is nice",
    formField: {
      name: "type",
      displayName: "Is the egg nice",
      type: "YesNoField",
    },
    section: "eggVerdict",
    operation: "is",
  };
  const rows = [
    {
      type: "boiled",
      nice: "No",
    },
    {
      type: "poached",
      nice: "No",
    },
    {
      type: "omelette",
      nice: "No",
    },
    {
      type: "fried",
      nice: "Yes",
    },
  ];
  expect(populateConditionsArray(rows, conditionConfig).length).toBe(1);
});
