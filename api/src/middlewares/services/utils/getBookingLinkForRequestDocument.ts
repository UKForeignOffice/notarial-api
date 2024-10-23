import * as additionalContexts from "./additionalContexts.json";

export function getBookingLinkForRequestDocument(post: string) {
  return additionalContexts.requestDoc.posts[post]?.bookingLink ?? "";
}
