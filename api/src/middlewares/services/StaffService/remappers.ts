import * as affirmationMappings from "./mappings/affirmation";
import * as exchangeMappings from "./mappings/exchange";
import { createRemapper } from "./utils/createRemapper";

export const remappers = {
  affirmation: createRemapper(affirmationMappings.remap, [], ["file"]),
  cni: createRemapper(affirmationMappings.remap, [], ["file"]),
  exchange: createRemapper(exchangeMappings.remap, [], ["file"]),
};
