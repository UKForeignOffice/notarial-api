export const order = {
  applicantDetails: "Applicant's details",
  applicantPassport: "Applicant's passport details",
  contactDetails: "Contact details",
  reason: "Reason for document",
  certificate: "Certificate details",
  maritalStatus: "Marital status",
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

  docLanguage: "certificate.docLanguage",
  mscReason: "reason.reason",
  reasonForLetter: "reason.reason",
  reasonForLetterOther: "reason.other",

  previouslyMarried: "maritalStatus.previouslyMarried",

  partnerIsBN: "partnerDetails.partnerIsBN",
  partnerFirstName: "partnerDetails.partnerFirstName",
  partnerMiddleName: "partnerDetails.partnerMiddleName",
  partnerSurname: "partnerDetails.partnerSurname",
  partnerPassportNumber: "partnerDetails.partnerPassportNumber",
  partnerDateOfBirth: "partnerDetails.partnerDateOfBirth",
  partnerCountryOfBirth: "partnerDetails.partnerCountryOfBirth",
  partnerPassportDateOfIssue: "partnerDetails.partnerPassportDateOfIssue",

  addressLine1: "delivery.addressLine1",
  addressLine2: "delivery.addressLine2",
  city: "delivery.city",
  postcode: "delivery.postcode",
  "delivery.country": "delivery.country",

  deliveryAddressLine1: "delivery.addressLine1",
  deliveryAddressLine2: "delivery.addressLine2",
  deliveryCity: "delivery.city",
  deliveryPostcode: "delivery.postCode",

  emailAddress: "contactDetails.emailAddress",
  phoneNumber: "contactDetails.phoneNumber",
};
