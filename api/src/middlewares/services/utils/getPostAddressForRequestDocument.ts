import * as additionalContexts from "./additionalContexts.json";

export function getPostAddressForRequestDocument(service: string) {
  return additionalContexts.requestDoc.services[service]?.postAddress ?? "";
}
