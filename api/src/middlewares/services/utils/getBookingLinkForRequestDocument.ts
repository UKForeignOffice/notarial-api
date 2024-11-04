import * as additionalContexts from "./additionalContexts.json";

export function getBookingLinkForRequestDocument(post: string, service: string) {
  const bookingLinkByService = additionalContexts.requestDoc["services"]?.[service]?.bookingLink;
  const bookingLinkByPost = additionalContexts.requestDoc["posts"][post]?.bookingLink;

  return bookingLinkByPost ?? bookingLinkByService ?? "";
}
