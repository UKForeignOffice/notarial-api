import * as affirmationMappings from "./mappings/affirmation";
import * as cniPostalMappings from "./mappings/cniPostal";
import * as exchangeMappings from "./mappings/exchange";
import * as mscMappings from "./mappings/msc";
import * as cniMSCCombinedMappings from "./mappings/CNIAndMSC";
import { reorderSectionsWithNewName } from "../utils/reorderSectionsWithNewName";

export const reorderers = {
  affirmation: reorderSectionsWithNewName(affirmationMappings.order),
  cni: reorderSectionsWithNewName(affirmationMappings.order),
  cniPostal: reorderSectionsWithNewName(cniPostalMappings.order),
  exchange: reorderSectionsWithNewName(exchangeMappings.order),
  mscPostal: reorderSectionsWithNewName(mscMappings.order),
  cniAndMscPostal: reorderSectionsWithNewName(cniMSCCombinedMappings.order),
};
