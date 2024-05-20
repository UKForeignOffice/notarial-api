import config from "config";
import { getPost } from "./getPost";
const POST_EMAILS = config.get<Record<string, string>>("postEmails");
export function getPostEmailAddress(country: string, post?: string) {
  const postName = getPost(country, post);

  return POST_EMAILS[postName];
}
