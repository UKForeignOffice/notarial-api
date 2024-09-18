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
  const additionalContexts = helpers.getFileJson(constants.CONTENT_TARGET);
  const bookingRows = helpers.prepareUpdateFile("booking-links.tsv", constants.CONTENT_MAP["booking-links"]);
  let newContent = uploadContent(constants.CONTENT_MAP["booking-links"], bookingRows, "booking-links", { certifyCopy: { ...additionalContexts.certifyCopy } });

  const contentRows = helpers.prepareUpdateFile("content.tsv", constants.CONTENT_MAP["content"]);
  newContent = uploadContent(constants.CONTENT_MAP["content"], contentRows, "content", newContent);

  fs.writeFileSync(constants.CONTENT_TARGET, JSON.stringify(newContent));
}

/**
 * Function to upload an array of tsv rows to the additional contexts file.
 * @param fileConstants - The constants associated with the content type to be used for picking the correct fields to upload
 * @param rowObjects - The rows of the tsv as JS objects
 * @param contentType - The file type being processed. This determines what fields to be uploaded, and to what part of the additional contexts file
 * @param defaultContent - default content to be used for the uploaded content. Used to combine booking links and content tsvs
 */
function uploadContent(
  fileConstants: ConstantsMap["content"] | ConstantsMap["booking-links"],
  rowObjects: Row[],
  contentType: "content" | "booking-links",
  defaultContent: Record<string, any> = {}
) {
  return rowObjects.reduce(
    (acc, curr) => {
      const contentFamily = contentType === "content" ? "countries" : helpers.determineBookingContentFamily(rowObjects, curr);
      const relevantFields = helpers.getRelevantFields(curr, fileConstants.relevant);
      const contentSubject = contentFamily === "countries" ? curr.country : curr.post;
      const setPath = `marriage.${contentFamily}.${contentSubject}`;
      const currentFields = _.get(acc, setPath) ?? {};
      _.set(acc, setPath, { ...currentFields, ...relevantFields });
      return acc;
    },
    { ...defaultContent }
  );
}

main();
