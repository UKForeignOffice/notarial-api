import config from "config";
const POST_EMAILS = config.get<Record<string, string>>("postEmails");
export function getPostEmailAddress(post: string) {
  return POST_EMAILS[post];
}
