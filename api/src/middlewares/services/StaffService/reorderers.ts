import * as affirmationMappings from "./mappings/affirmation";
import * as cniPostalMappings from "./mappings/cniPostal";
import * as exchangeMappings from "./mappings/exchange";
import { reorderSectionsWithNewName } from "./utils/reorderSectionsWithNewName";
export const reorderers = {
  affirmation: reorderSectionsWithNewName(affirmationMappings.order),
  cni: reorderSectionsWithNewName(affirmationMappings.order),
  cniPostal: reorderSectionsWithNewName(cniPostalMappings.order),
  exchange: reorderSectionsWithNewName(exchangeMappings.order),
};
