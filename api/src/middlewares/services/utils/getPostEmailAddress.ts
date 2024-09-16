import config from "config";
import { getPost } from "./getPost";
import { FormType } from "../../../types/FormDataBody";
const POST_EMAILS = config.get<Record<string, string>>("postEmails");
export function getPostEmailAddress(country: string, type: FormType, post?: string) {
  const postName = getPost(country, type, post);

  return POST_EMAILS[postName];
}
