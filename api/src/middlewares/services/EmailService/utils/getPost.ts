import * as additionalContexts from "./../additionalContexts.json";
export function getPost(country: string, post?: string) {
  return post ?? additionalContexts.countries?.[country]?.post;
}
