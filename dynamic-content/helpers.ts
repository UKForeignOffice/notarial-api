import * as fs from "fs";
import { Conditions, FileConstants, Row } from "./types";
import * as constants from "./constants";

/**
 * Validates the csv file to ensure all the required fields are present
 * @param fields - The fields from the csv
 * @param required - The fields that are required as part of the upload
 *
 * @returns a list of missing required fields if any are present
 */
export function validate(fields: string[], required: Record<string, string>) {
  const missingFields = Object.keys(required).filter((field) => !fields.includes(field));
  return missingFields.length > 0 && missingFields;
}

/**
 * Gets the fields from the row object that actually need to be uploaded
 * @param row - The current csv row
 * @param fields - The list of relevant fields
 *
 * @returns the object with irrelevant fields removed
 */
export function getRelevantFields(row: Row, fields: string[]) {
  return Object.fromEntries(Object.entries(row).filter(([key]) => fields.includes(key)));
}

/**
 * Determines whether the current row from a booking links csv should be added to the countries list or the posts list.
 * If the current row belongs to a country with multiple embassies, the row will be added to the posts list. Otherwise,
 * it will be added to the countries list
 * @param rows - all available rows
 * @param currentRow - The current row being tested
 * @returns the content family for the row
 */
export function determineBookingContentFamily(rows: Record<string, string>[], currentRow: Record<string, string>) {
  const hasMultipleEmbassies = rows.filter((row) => row.country === currentRow.country).length > 1;
  return hasMultipleEmbassies ? "posts" : "countries";
}

export function convertToObjectWithKeys(fieldNames: string[], fieldNameMap: Record<string, string>) {
  return function (row: string[]) {
    return fieldNames.reduce((acc, key, i) => {
      if (fieldNameMap[key]) {
        acc[fieldNameMap[key]] = row[i];
      }
      return acc;
    }, {});
  };
}

function parseRowContent(row: Row) {
  return Object.entries(row).reduce(parseContent, {});
}

function parseContent(acc: Record<string, string>, [key, value]) {
  if (key === "type" && value) value = value.toLowerCase();
  if (value && value.includes("*")) value = bulletsToHtml(value);
  if (value && value.includes("<br>")) value = breaksToHtml(value);
  acc[key] = value;
  return acc;
}

export function splitRow(row: string) {
  return row.split(/,\s*(?=(?:[^"]*"[^"]*")*[^"]*$)/g).filter((field: string) => field !== undefined);
}

/**
 * Takes an array of strings representing the rows of a csv, and transforms them into JS objects with fields and values.
 * @param rows - the csv rows as strings
 * @param fieldNames - The names of the fields to be used in each row
 * @param fieldNameMap - the fields in the csv mapped to the names to be used in the resulting object
 * @returns Row[] - The rows transformed into objects
 */
export function getRowObjects(rows: string[], fieldNames: string[], fieldNameMap: Record<string, string>) {
  const convertToRowObject = convertToObjectWithKeys(fieldNames, fieldNameMap);
  return rows.map(splitRow).map(convertToRowObject).map(parseRowContent);
}

/**
 * Converts a plain text string into a html bullet list. Bullets are defined in the plain text string by asterisks.
 * @param bulletList - The plain text string to be converted
 */
export function bulletsToHtml(bulletList: string) {
  return bulletList
    .split("*")
    .map((bullet) => {
      if (bullet !== "") {
        return `<li>${bullet}</li>`;
      }
      return "";
    })
    .join("");
}

/**
 * Converts a plain text string with standard html break elements into html paragraph elements
 * @param text - The text to be converted
 */
export function breaksToHtml(text: string) {
  return text
    .split("<br>")
    .map((para) => {
      if (para !== "") {
        return `<p class="govuk-body">${para}</p>`;
      }
      return "";
    })
    .join("")
    .replace(/(<p class="govuk-body">)"/g, "$1")
    .replace(/"(<\/p>)/g, "$1");
}

/**
 * Gets a JSON file, and returns it as a parsed JSON object
 * @param path - The path of the file to be parsed
 */
export function getFileJson(path: string) {
  return JSON.parse(fs.readFileSync(path).toString()) as Record<string, any>;
}

function createConditionFromRow(name: string, row: Row, conditionConfig: Record<string, any>, index: number) {
  return {
    field: {
      name: name,
      type: conditionConfig.formField.type,
      display: conditionConfig.formField.displayName,
    },
    operator: "is",
    value: {
      type: "Value",
      value: row[conditionConfig.useField],
      display: row[conditionConfig.useField],
    },
    coordinator: index > 0 ? "or" : undefined,
  };
}

function getConditionsArray(rows: Row[]) {
  return function (conditionConfig: Record<string, any>) {
    return rows.map((row, index) => {
      const name = conditionConfig.section ? `${conditionConfig.section}.${conditionConfig.formField.name}` : conditionConfig.formField.name;
      return createConditionFromRow(name, row, conditionConfig, index);
    });
  };
}

/**
 * Given the rows of a csv, returns an array of condition values to be used for a condition in a form
 * based on the provided condition config
 * @param rows - the row objects of the csv
 * @param conditionConfig - the config used to determine whether a row should be added to the condition
 * @returns The supplied conditions object, with the new condition values
 */
export function populateConditionsArray(rows: Row[], conditionConfig: Record<string, any>) {
  const validRows = rows.filter((row) => conditionConfig.evaluateValue.includes(row[conditionConfig.evaluateField].toLowerCase()));
  return validRows.length > 0 && getConditionsArray(validRows)(conditionConfig);
}

export function getNewCondition(name: string, config: Record<string, any>, rowObjects: Row[]) {
  return {
    name: name,
    displayName: config.defaultDisplayName,
    value: {
      name: config.defaultDisplayName,
      conditions: populateConditionsArray(rowObjects, config),
    },
  };
}

/**
 * Takes the list of dynamically populated conditions for each form from the constants file, and updates them
 * with the dynamic content from the uploaded csv
 * @param form - The form config being edited
 * @param conditions - The conditions to be processed
 * @param rows - The rows of the csv to use for updating
 */
export function processConditionsForForm(form: Record<string, any>, conditions: Conditions, rows: Row[]) {
  const currentConditions = form.conditions;
  Object.entries(conditions).forEach(([conditionName, config]) => {
    const newCondition = getNewCondition(conditionName, config, rows);
    if (!newCondition.value.conditions) {
      return;
    }

    const conditionIndex = currentConditions.findIndex((condition) => condition.name === conditionName);

    if (conditionIndex > -1) {
      form.conditions.splice(conditionIndex, 1, newCondition);
    } else {
      form.conditions.push(newCondition);
    }
  });
  return form;
}

/**
 *
 * Used to get the csv file and constants ready to be uploaded
 *
 * @param file The path to the file to be uploaded
 * @param fileConstants The constants to be used for the specified file type
 *
 * @returns The rows of the csv as objects
 *
 * @throws Error when required fields are missing from the csv file
 */
export function prepareUpdateFile(file: string, fileConstants: FileConstants) {
  console.log(`Currently processing: ${file}...`);
  const csv = fs.readFileSync(`${constants.CONTENT_SOURCE}/${file}`).toString();

  const rows = csv.split("\n");
  const firstRow = rows.splice(0, 1)[0].toLowerCase().trim().split(",");

  const result = validate(firstRow, fileConstants.fieldMap);
  if (result) {
    throw new Error(`Could not upload dynamic content - The following field(s) were missing: \n${result.map((field) => `${field}\n`).join("")}`);
  }

  return getRowObjects(rows, firstRow, fileConstants.fieldMap);
}
