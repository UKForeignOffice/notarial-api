type Reordered<T extends Record<string, string>, P extends object> = {
  [K in keyof T as T[K]]?: P[Extract<keyof P, K>];
};

export function reorderSectionsWithNewName<T extends Record<string, string>, P extends object>(order: T) {
  return function (data: Record<string, any>) {
    const newOrder: Reordered<T, P> = {};
    for (const key in order) {
      const newSectionName = order[key];
      newOrder[newSectionName] = data[key];
    }
    return newOrder;
  };
}
