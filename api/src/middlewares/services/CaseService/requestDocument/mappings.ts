export const order = {
  applicantDetails: "Applicant's details",
  applicantPassport: "Applicant's passport details",
  permanentAddress: "Applicant's permanent address",
  contactDetails: "Contact details",
  parent2ContactDetails: "Parent 2 contact details",
  reason: "Reason for document",
  certificate: "Certificate details",
  maritalStatus: "Marital status",
  marriageDetails: "Marriage details",
  partnerDetails: "Partner's details",
  delivery: "Delivery address",
  feedbackConsent: "Feedback consent",
};

export const remap = {
  applicationCountry: "country",
  post: "post",
  feedbackConsent: "feedbackConsent.feedbackConsent",

  firstName: "applicantDetails.firstName",
  middleName: "applicantDetails.middleName",
  surname: "applicantDetails.surname",

  passportDateOfIssue: "applicantPassport.dateOfIssue",
  passportNumber: "applicantPassport.number",
  dateOfBirth: "applicantPassport.dateOfBirth",
  countryOfBirth: "applicantPassport.countryOfBirth",
  placeOfBirth: "applicantPassport.placeOfBirth",

  "permanentAddress.addressLine1": "permanentAddress.addressLine1",
  "permanentAddress.addressLine2": "permanentAddress.addressLine2",
  "permanentAddress.city": "permanentAddress.city",
  "permanentAddress.postcode": "permanentAddress.postcode",
  "permanentAddress.country": "permanentAddress.country",

  docLanguage: "certificate.docLanguage",
  customLawCertType: "certificate.typeOfCertificate",

  mscReason: "reason.reason",
  reasonForLetter: "reason.reason",
  reasonForLetterOther: "reason.other",

  previouslyMarried: "maritalStatus.previouslyMarried",

  placeOfMarriage: "marriageDetails.placeOfMarriage",

  partnerIsBN: "partnerDetails.partnerIsBN",
  partnerFirstName: "partnerDetails.partnerFirstName",
  partnerMiddleName: "partnerDetails.partnerMiddleName",
  partnerSurname: "partnerDetails.partnerSurname",
  partnerPassportNumber: "partnerDetails.partnerPassportNumber",
  partnerDateOfBirth: "partnerDetails.partnerDateOfBirth",
  partnerCountryOfBirth: "partnerDetails.partnerCountryOfBirth",
  partnerPassportDateOfIssue: "partnerDetails.partnerPassportDateOfIssue",

  "delivery.country": "delivery.country",

  deliveryAddressLine1: "delivery.addressLine1",
  deliveryAddressLine2: "delivery.addressLine2",
  deliveryCity: "delivery.city",
  deliveryPostcode: "delivery.postCode",

  globalDeliveryAddressLine1: "delivery.addressLine1",
  globalDeliveryAddressLine2: "delivery.addressLine2",
  globalDeliveryCity: "delivery.city",
  globalDeliveryPostcode: "delivery.postCode",
  globalDeliveryCountry: "delivery.country",

  emailAddress: "contactDetails.emailAddress",
  phoneNumber: "contactDetails.phoneNumber",

  "parent2Contact.emailAddress": "parent2ContactDetails.emailAddress",
  "parent2Contact.phoneNumber": "parent2ContactDetails.phoneNumber",
};
