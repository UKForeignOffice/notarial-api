import * as fs from "fs";
import { FileConstants, Row } from "./types";
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
        acc[fieldNameMap[key]] = row[i].replaceAll("\r", "").replace(/[\\"]/g, "");
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
  if (key === "additionalDocs" && value) value = bulletsToArray(value);
  if (value && value.includes("<br>")) value = value.replaceAll("<br>", "\n");
  if (key === "civilPartnership") value = !!value;
  if (key === "postal") value = !!value && value?.toLowerCase() !== "false";
  acc[key] = value;
  return acc;
}

export function splitRow(row: string) {
  return row.split("\t").filter((field: string) => field !== undefined);
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
export function bulletsToArray(bulletList: string) {
  return bulletList.split("*").filter((bullet) => bullet !== "");
}

/**
 * Gets a JSON file, and returns it as a parsed JSON object
 * @param path - The path of the file to be parsed
 */
export function getFileJson(path: string) {
  return JSON.parse(fs.readFileSync(path).toString()) as Record<string, any>;
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
  const firstRow = rows.splice(0, 1)[0].toLowerCase().trim().split("\t");

  const result = validate(firstRow, fileConstants.fieldMap);
  if (result) {
    throw new Error(`Could not upload dynamic content - The following field(s) were missing: \n${result.map((field) => `${field}\n`).join("")}`);
  }

  return getRowObjects(rows, firstRow, fileConstants.fieldMap);
}
