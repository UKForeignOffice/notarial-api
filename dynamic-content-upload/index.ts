import * as fs from "fs";
import * as constants from "./constants";
import * as helpers from "./helpers";
import { AFFIRMATION_CONDITIONS, AFFIRMATION_FORM } from "./constants";
import _ from "lodash";
import { getFileJson, processConditionsForForm } from "./helpers";
import { ConstantsMap, FileConstants, Row } from "./types";

/**
 * The main function that runs the dynamic content upload.
 * Some basic validation happens here, as well as top level console logs to update on the progress of the upload.
 */
function main() {
  const bookingRows = prepareUpdateFile(
    "booking-links.csv",
    constants.CONTENT_MAP["booking-links"]
  );
  uploadContent(
    constants.CONTENT_MAP["booking-links"],
    bookingRows,
    "booking-links"
  );

  const contentRows = prepareUpdateFile(
    "content.csv",
    constants.CONTENT_MAP["content"]
  );
  uploadContent(constants.CONTENT_MAP["content"], contentRows, "content");
  updateConditions(contentRows);
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
function prepareUpdateFile(file: string, fileConstants: FileConstants) {
  console.log(`Currently processing: ${file}...`);
  const csv = fs.readFileSync(`${constants.CONTENT_SOURCE}/${file}`).toString();

  const rows = csv.split("\n");
  const firstRow = rows.splice(0, 1)[0].toLowerCase().trim().split(",");

  const result = helpers.validate(firstRow, fileConstants.fieldMap);
  if (result) {
    throw new Error(
      `Could not upload dynamic content - The following field(s) were missing: \n${result
        .map((field) => `${field}\n`)
        .join("")}`
    );
  }

  return helpers.getRowObjects(rows, firstRow, fileConstants.fieldMap);
}

/**
 * Function to upload an array of csv rows to the additional contexts file.
 * @param fileConstants - The constants associated with the content type to be used for picking the correct fields to upload
 * @param rowObjects - The rows of the csv as JS objects
 * @param contentType - The file type being processed. This determines what fields to be uploaded, and to what part of the additional contexts file
 */
function uploadContent(
  fileConstants: ConstantsMap["content"] | ConstantsMap["booking-links"],
  rowObjects: Row[],
  contentType: "content" | "booking-links"
) {
  const currentDynamicContent = JSON.parse(
    fs.readFileSync(constants.CONTENT_TARGET).toString()
  );
  const newContent = rowObjects.reduce(
    (acc, curr) => {
      const contentFamily =
        contentType === "content"
          ? "countries"
          : helpers.determineBookingContentFamily(rowObjects, curr);
      const relevantFields = helpers.getRelevantFields(
        curr,
        fileConstants.relevant
      );
      const contentSubject =
        contentFamily === "countries" ? curr.country : curr.post;
      const setPath = `${curr.type}.${contentFamily}.${contentSubject}`;
      _.set(acc, setPath, relevantFields);
      return acc;
    },
    { ...currentDynamicContent }
  );
  fs.writeFileSync(constants.CONTENT_TARGET, JSON.stringify(newContent));
  console.log(
    "\x1b[32m%s\x1b[0m",
    "Dynamic content updated successfully. Processing conditions..."
  );
}

/**
 * Updates the conditions in the two forms that are dependent on values in the csv
 * @param rowObjects - The rows from the csv file as JS objects
 */
function updateConditions(rowObjects: Row[]) {
  const affirmationForm = processConditionsForForm(
    getFileJson(AFFIRMATION_FORM),
    AFFIRMATION_CONDITIONS,
    rowObjects
  );
  // TODO - Add support for cni form when cni prototype has been created
  // const cniForm = processConditionsForForm(getFileJson(CNI_FORM), CNI_CONDITIONS, rowObjects);
  fs.writeFileSync(AFFIRMATION_FORM, JSON.stringify(affirmationForm));
  // fs.writeFileSync(CNI_FORM, JSON.stringify(cniForm));
  console.log("\x1b[32m%s\x1b[0m", "Conditions updated successfully");
}

main();
