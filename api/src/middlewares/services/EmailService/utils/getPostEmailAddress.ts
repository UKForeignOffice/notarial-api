import * as additionalContexts from "./../additionalContexts.json";
import config from "config";
const POST_EMAILS = config.get<Record<string, string>>("postEmails");
export function getPostEmailAddress(country: string, post?: string) {
  const postName = post ?? additionalContexts.countries?.[country]?.post;

  if (!postName) {
    return;
  }

  return POST_EMAILS[postName];
}
