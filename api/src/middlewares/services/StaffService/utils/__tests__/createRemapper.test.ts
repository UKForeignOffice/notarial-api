import { createRemapper } from "../createRemapper";

const fields = [
  { key: "favouriteEgg", type: "string", title: "What is your favourite egg", answer: "scrambled" },
  { key: "favouriteAnimal", type: "string", title: "What is your favourite animal", answer: "cat" },
];

test("createRemapper returns a remapper which successfully remaps an object", () => {
  const mappings = {
    favouriteEgg: "favourite.egg",
    favouriteAnimal: "favourite.animal",
  };

  const toFavourites = createRemapper(mappings);
  const remapped = toFavourites(fields);
  expect(remapped).toStrictEqual({
    favourite: {
      egg: { key: "favouriteEgg", type: "string", title: "What is your favourite egg", answer: "scrambled" },
      animal: { key: "favouriteAnimal", type: "string", title: "What is your favourite animal", answer: "cat" },
    },
  });
});

test("createRemapper returns a remapper which keeps values that have not been included in the mapping", () => {
  const mappings = {
    favouriteEgg: "favourite.egg",
  };

  const toFavourites = createRemapper(mappings);
  const remapped = toFavourites(fields);

  expect(remapped).toStrictEqual({
    favourite: {
      egg: { key: "favouriteEgg", type: "string", title: "What is your favourite egg", answer: "scrambled" },
    },
    favouriteAnimal: { key: "favouriteAnimal", type: "string", title: "What is your favourite animal", answer: "cat" },
  });
});

test("CreateRemapper returns a remapper which accepts two fields for the same mapping", () => {
  const mappings = {
    favouriteAnimal: "favourite.animal",
    favouriteCat: "favourite.animal",
  };

  const toFavourites = createRemapper(mappings);
  const remapped = toFavourites([...fields, { key: "favouriteCat", type: "string", title: "What is your favourite cat", answer: "Ragdoll" }]);
  expect(remapped).toStrictEqual({
    favouriteEgg: {
      answer: "scrambled",
      key: "favouriteEgg",
      title: "What is your favourite egg",
      type: "string",
    },
    favourite: {
      animal: { key: "favouriteCat", type: "string", title: "What is your favourite cat", answer: "Ragdoll" },
    },
  });
});

test("createRemapper returns a remapper which can ignore keys", () => {
  const mappings = {
    favouriteEgg: "favourite.egg",
    favouriteAnimal: "favourite.animal",
  };

  const toFavourites = createRemapper(mappings, ["favouriteAnimal"]);
  const remapped = toFavourites(fields);
  expect(remapped).toStrictEqual({
    favourite: {
      egg: { key: "favouriteEgg", type: "string", title: "What is your favourite egg", answer: "scrambled" },
    },
  });
});

test("createRemapper returns a remapper which can ignore types", () => {
  const mappings = {
    favouriteEgg: "favourite.egg",
    favouriteAnimal: "favourite.animal",
  };

  const toFavourites = createRemapper(mappings, [], ["file"]);
  const remapped = [
    ...fields,
    {
      key: "favouriteDog",
      type: "file",
      title: "Picture of favourite dog",
      answer: "corgi",
    },
  ];

  expect(toFavourites(remapped)).toStrictEqual({
    favourite: {
      egg: { key: "favouriteEgg", type: "string", title: "What is your favourite egg", answer: "scrambled" },
      animal: { key: "favouriteAnimal", type: "string", title: "What is your favourite animal", answer: "cat" },
    },
  });
});
