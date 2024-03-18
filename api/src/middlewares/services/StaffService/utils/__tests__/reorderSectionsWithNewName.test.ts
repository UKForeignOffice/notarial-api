import { reorderSectionsWithNewName } from "../reorderSectionsWithNewName";

test("reorderSectionsWithName can reorder and rename sections", () => {
  const reorder = {
    a: "A - new name",
    b: "B",
    c: "C",
  };

  const currentOrder = {
    c: {
      dog: { key: "favouriteDog", type: "string", title: "What is your favourite dog", answer: "corgi" },
    },
    b: {
      animal: { key: "favouriteAnimal", type: "string", title: "What is your favourite animal", answer: "cat" },
    },
    a: {
      egg: { key: "favouriteEgg", type: "string", title: "What is your favourite egg", answer: "scrambled" },
    },
  };

  expect(reorderSectionsWithNewName(reorder)(currentOrder)).toEqual({
    "A - new name": {
      egg: { key: "favouriteEgg", type: "string", title: "What is your favourite egg", answer: "scrambled" },
    },
    B: {
      animal: { key: "favouriteAnimal", type: "string", title: "What is your favourite animal", answer: "cat" },
    },

    C: {
      dog: { key: "favouriteDog", type: "string", title: "What is your favourite dog", answer: "corgi" },
    },
  });
});
