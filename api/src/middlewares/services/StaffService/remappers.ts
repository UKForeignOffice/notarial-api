import * as affirmationMappings from "./mappings/affirmation";
import * as cniPostalMappings from "./mappings/cniPostal";
import * as exchangeMappings from "./mappings/exchange";
import * as mscMappings from "./mappings/msc";
import * as cniMSCCombinedMappings from "./mappings/CNIAndMSC";
import { createRemapper } from "./utils/createRemapper";

export const remappers = {
  affirmation: createRemapper(affirmationMappings.remap, [], ["file"]),
  cni: createRemapper(affirmationMappings.remap, [], ["file"]),
  cniPostal: createRemapper(cniPostalMappings.remap, [], ["file"]),
  exchange: createRemapper(exchangeMappings.remap, [], ["file"]),
  msc: createRemapper(mscMappings.remap, [], ["file"]),
  "cni and msc": createRemapper(cniMSCCombinedMappings.remap, [], ["file"]);
};
