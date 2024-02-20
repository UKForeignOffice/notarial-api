export function reorderSectionsWithNewName(order) {
  return function (data) {
    const newOrder = {};
    for (const key in order) {
      const newSectionName = order[key];
      newOrder[newSectionName] = data[key];
    }
    return newOrder;
  };
}
