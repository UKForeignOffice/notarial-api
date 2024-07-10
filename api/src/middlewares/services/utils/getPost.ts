import * as additionalContexts from "./additionalContexts.json";

/**
 * Some countries have two posts, but we need to provide a default post for users to send their documents to.
 */
const defaultPostForPostal = {
  Italy: additionalContexts.posts["the British Embassy Rome"].post,
};

export function getPost(country: string, post?: string) {
  return post ?? additionalContexts.countries?.[country]?.post ?? defaultPostForPostal[country];
}
