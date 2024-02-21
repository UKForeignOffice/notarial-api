import * as affirmationMappings from "./mappings/affirmation";
import { createRemapper } from "./utils/createRemapper";

export const remappers = {
  affirmation: createRemapper(affirmationMappings.remap, [], ["file"]),
};
