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
}

/**
 * Function to upload an array of csv rows to the additional contexts file.
 * @param fileConstants - The constants associated with the content type to be used for picking the correct fields to upload
 * @param rowObjects - The rows of the csv as JS objects
 * @param contentType - The file type being processed. This determines what fields to be uploaded, and to what part of the additional contexts file
 */
function uploadContent(fileConstants: ConstantsMap["content"] | ConstantsMap["booking-links"], rowObjects: Row[], contentType: "content" | "booking-links") {
  const currentDynamicContent = helpers.getFileJson(constants.CONTENT_TARGET);
  const newContent = rowObjects.reduce(
    (acc, curr) => {
      const contentFamily = contentType === "content" ? "countries" : helpers.determineBookingContentFamily(rowObjects, curr);
      const relevantFields = helpers.getRelevantFields(curr, fileConstants.relevant);
      const contentSubject = contentFamily === "countries" ? curr.country : curr.post;
      const setPath = `${contentFamily}.${contentSubject}`;
      const currentFields = _.get(acc, setPath) ?? {};
      _.set(acc, setPath, { ...currentFields, ...relevantFields });
      return acc;
    },
    { ...currentDynamicContent }
  );
  fs.writeFileSync(constants.CONTENT_TARGET, JSON.stringify(newContent));
  console.log("\x1b[32m%s\x1b[0m", "Dynamic content updated successfully.");
}

main();
