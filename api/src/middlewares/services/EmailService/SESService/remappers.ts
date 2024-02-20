import * as affirmationMappings from "./mappings/affirmation";
import { createRemapper } from "./utils/createRemapper";

export const remappers = {
  toAffirmation: createRemapper(affirmationMappings.remap, [], ["file"]),
};
