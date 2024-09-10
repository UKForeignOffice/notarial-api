import { set } from "lodash";
import { FormField } from "../../../../types/FormField";

/**
 * Recreates an object with the keys remapped according to the mappings object.
 * The key is from the original object, the value is the new path in the new object.
 * If you need to ignore original keys or types, you can pass them in the ignoreKeys and ignoreTypes arrays.
 * This function is a curried function, pass in parameters to "set up" the remapper, then use the returned function to remap objects in a reducer function.
 *
 * @example
 * const remapper = createRemapper(affirmationMappings, ["ignoreThisKey"], ["ignoreThisType"]);
 * const remappedObject = remapper(formFields)
 */
export function createRemapper<T>(mappings: T, ignoreKeys: string[] = [], ignoreTypes: string[] = []) {
  const ignoreKeysSet = new Set(ignoreKeys);
  const ignoreTypesSet = new Set(ignoreTypes);
  return function (data: FormField[]) {
    return data.reduce((acc, curr) => {
      const key = curr.key;

      if (ignoreKeysSet.has(key) || ignoreTypesSet.has(curr.type)) {
        return acc;
      }

      const remappedPath = mappings[key];
      if (remappedPath) {
        set(acc, remappedPath, curr);
        return acc;
      }

      acc[key] = curr;

      return acc;
    }, {} as any);
  };
}
