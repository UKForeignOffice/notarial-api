import * as affirmationMappings from "./mappings/affirmation";
import { reorderSectionsWithNewName } from "./utils/reorderSectionsWithNewName";
export const reorderers = {
  affirmation: reorderSectionsWithNewName(affirmationMappings.order),
};
