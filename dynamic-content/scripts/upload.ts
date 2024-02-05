import * as fs from "fs";
import * as constants from "../constants";
import * as helpers from "../helpers";
import { ConstantsMap, Row } from "../types";
import _ from "lodash";

/**
 * The main function that runs the dynamic content upload.
 * Some basic validation happens here, as well as top level console logs to update on the progress of the upload.
 */
function main() {
  const bookingRows = helpers.prepareUpdateFile("booking-links.csv", constants.CONTENT_MAP["booking-links"]);
  uploadContent(constants.CONTENT_MAP["booking-links"], bookingRows, "booking-links");

  const contentRows = helpers.prepareUpdateFile("content.csv", constants.CONTENT_MAP["content"]);
  uploadContent(constants.CONTENT_MAP["content"], contentRows, "content");
  updateConditions(contentRows);
}

/**
 * Function to upload an array of csv rows to the additional contexts file.
 * @param fileConstants - The constants associated with the content type to be used for picking the correct fields to upload
 * @param rowObjects - The rows of the csv as JS objects
 * @param contentType - The file type being processed. This determines what fields to be uploaded, and to what part of the additional contexts file
 */
function uploadContent(fileConstants: ConstantsMap["content"] | ConstantsMap["booking-links"], rowObjects: Row[], contentType: "content" | "booking-links") {
  const currentDynamicContent = JSON.parse(fs.readFileSync(constants.CONTENT_TARGET).toString());
  const newContent = rowObjects.reduce(
    (acc, curr) => {
      const contentFamily = contentType === "content" ? "countries" : helpers.determineBookingContentFamily(rowObjects, curr);
      const relevantFields = helpers.getRelevantFields(curr, fileConstants.relevant);
      const contentSubject = contentFamily === "countries" ? curr.country : curr.post;
      const setPath = `${contentFamily}.${contentSubject}`;
      const currentields = _.get(acc, setPath) ?? {};
      _.set(acc, setPath, { ...currentields, ...relevantFields });
      return acc;
    },
    { ...currentDynamicContent }
  );
  fs.writeFileSync(constants.CONTENT_TARGET, JSON.stringify(newContent));
  console.log("\x1b[32m%s\x1b[0m", "Dynamic content updated successfully. Processing conditions...");
}

/**
 * Updates the conditions in the two forms that are dependent on values in the csv
 * @param rowObjects - The rows from the csv file as JS objects
 */
function updateConditions(rowObjects: Row[]) {
  const beforeYouStartForm = helpers.processConditionsForForm(
    helpers.getFileJson(constants.BEFORE_YOU_START_FORM),
    constants.BEFORE_YOU_START_CONDITIONS,
    rowObjects
  );
  const cniForm = helpers.processConditionsForForm(helpers.getFileJson(constants.CNI_FORM), constants.CNI_CONDITIONS, rowObjects);
  const affirmationForm = helpers.processConditionsForForm(helpers.getFileJson(constants.AFFIRMATION_FORM), constants.AFFIRMATION_CONDITIONS, rowObjects);
  fs.writeFileSync(constants.BEFORE_YOU_START_FORM, JSON.stringify(beforeYouStartForm));
  fs.writeFileSync(constants.CNI_FORM, JSON.stringify(cniForm));
  fs.writeFileSync(constants.AFFIRMATION_FORM, JSON.stringify(affirmationForm));
  console.log("\x1b[32m%s\x1b[0m", "Conditions updated successfully");
}

main();
