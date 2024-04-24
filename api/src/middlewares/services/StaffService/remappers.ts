import * as affirmationMappings from "./mappings/affirmation";
import * as cniPostalMappings from "./mappings/cniPostal";
import * as exchangeMappings from "./mappings/exchange";
import { createRemapper } from "./utils/createRemapper";

export const remappers = {
  affirmation: createRemapper(affirmationMappings.remap, [], ["file"]),
  cni: createRemapper(affirmationMappings.remap, [], ["file"]),
  cniPostal: createRemapper(cniPostalMappings.remap, [], ["file"]),
  exchange: createRemapper(exchangeMappings.remap, [], ["file"]),
};
