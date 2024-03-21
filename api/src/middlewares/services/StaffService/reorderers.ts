import * as affirmationMappings from "./mappings/affirmation";
import * as exchangeMappings from "./mappings/exchange";
import { reorderSectionsWithNewName } from "./utils/reorderSectionsWithNewName";
export const reorderers = {
  affirmation: reorderSectionsWithNewName(affirmationMappings.order),
  cni: reorderSectionsWithNewName(affirmationMappings.order),
  exchange: reorderSectionsWithNewName(exchangeMappings.order),
};
