import * as fs from "fs";
import { Row } from "./types";

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

function parseContent(acc: Record<string, any>, [key, value]) {
  if (key === "type") value = value.toLowerCase();
  if (value.includes("*")) value = bulletsToArray(value);
  if (value.includes("<br>")) value = breaksToHtml(value);
  acc[key] = value;
  return acc;
}

export function splitRow(row: string) {
  return row.split(/,\s*(?=([^"]*"[^"]*")*[^"]*$)/g).filter((field: string) => field !== undefined);
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
  return rows
    .map(splitRow)
    .map(convertToRowObject)
    .map(parseRowContent)
    .filter((row) => row.type === "affirmation" || row.type === "cni");
}

/**
 * Converts a plain text string into a html bullet list. Bullets are defined in the plain text string by asterisks.
 * @param bulletList - The plain text string to be converted
 */
export function bulletsToArray(bulletList: string) {
  return bulletList.split("*");
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
    .join("");
}

/**
 * Gets a JSON file, and returns it as a parsed JSON object
 * @param path - The path of the file to be parsed
 */
export function getFileJson(path: string) {
  return JSON.parse(fs.readFileSync(path).toString());
}
