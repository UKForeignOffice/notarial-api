import * as additionalContexts from "./additionalContexts.json";

export function getPostForMarriage(country: string, post?: string) {
  return post ?? additionalContexts.marriage.countries?.[country]?.post;
}

export function getPostForCertifyCopy(country: string, post?: string) {
  return post ?? additionalContexts.certifyCopy.countries?.[country]?.post;
}

export function getPostForRequestDocument(service: string, country?: string, post?: string) {
  if (post) {
    return post;
  }
  //TODO:- add ctx
  // @ts-ignore
  const context = additionalContexts.requestDoc;

  if (service === "adoption") {
    const adoptionContext = context["adoption"];
    if (!country) {
      return;
    }
    return adoptionContext?.[country]?.post;
  }

  return context[service]?.post;
}
