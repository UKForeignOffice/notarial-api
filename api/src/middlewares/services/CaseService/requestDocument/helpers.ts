import { order, remap } from "./mappings";
import { createRemapper } from "../utils/createRemapper";
import { reorderSectionsWithNewName } from "../utils/reorderSectionsWithNewName";

export const requestDocumentRemapper = createRemapper(remap);
export const requestDocumentReorderer = reorderSectionsWithNewName(order);
