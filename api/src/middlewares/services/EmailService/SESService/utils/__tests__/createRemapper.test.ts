import { createRemapper } from "../createRemapper";

const fields = [
  { key: "favouriteEgg", type: "string", title: "What is your favourite egg", answer: "scrambled" },
  { key: "favouriteAnimal", type: "string", title: "What is your favourite animal", answer: "cat" },
];

test("createRemapper returns a reducer which successfully remaps an object", () => {
  const mappings = {
    favouriteEgg: "favourite.egg",
    favouriteAnimal: "favourite.animal",
  };

  const toFavourites = createRemapper(mappings);
  const remapped = fields.reduce(toFavourites, {});
  expect(remapped).toStrictEqual({
    favourite: {
      egg: { key: "favouriteEgg", type: "string", title: "What is your favourite egg", answer: "scrambled" },
      animal: { key: "favouriteAnimal", type: "string", title: "What is your favourite animal", answer: "cat" },
    },
  });
});

test("createRemapper returns a reducer which keeps values that have not been included in the mapping", () => {
  const mappings = {
    favouriteEgg: "favourite.egg",
  };

  const toFavourites = createRemapper(mappings);
  const remapped = fields.reduce(toFavourites, {});

  expect(remapped).toStrictEqual({
    favourite: {
      egg: { key: "favouriteEgg", type: "string", title: "What is your favourite egg", answer: "scrambled" },
    },
    favouriteAnimal: { key: "favouriteAnimal", type: "string", title: "What is your favourite animal", answer: "cat" },
  });
});

test("createRemapper returns a reducer which can ignore keys", () => {
  const mappings = {
    favouriteEgg: "favourite.egg",
    favouriteAnimal: "favourite.animal",
  };

  const toFavourites = createRemapper(mappings, ["favouriteAnimal"]);
  const remapped = fields.reduce(toFavourites, {});
  expect(remapped).toStrictEqual({
    favourite: {
      egg: { key: "favouriteEgg", type: "string", title: "What is your favourite egg", answer: "scrambled" },
    },
  });
});

test("createRemapper returns a reducer which can ignore types", () => {
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
  ].reduce(toFavourites, {});
  expect(remapped).toStrictEqual({
    favourite: {
      egg: { key: "favouriteEgg", type: "string", title: "What is your favourite egg", answer: "scrambled" },
      animal: { key: "favouriteAnimal", type: "string", title: "What is your favourite animal", answer: "cat" },
    },
  });
});
