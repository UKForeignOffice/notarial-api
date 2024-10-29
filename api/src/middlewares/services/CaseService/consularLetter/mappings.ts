export const order = {
  applicantDetails: "Applicant's details",
  nokDetails: "Next of kin's details",
  companyDetails: "Funeral director company address",
  deceasedDetails: "Details of the deceased",
  deliveryAddress: "Delivery address",
  contactDetails: "Contact details",
  feedbackConsent: "Feedback consent",
};

export const remap = {
  post: "information.post",
  nextOfKin: "information.applicantIsNextOfKin",

  phoneNumber: "contactDetails.phoneNumber",
  emailAddress: "contactDetails.emailAddress",

  "yourDetails.firstName": "applicantDetails.firstName",
  "yourDetails.middleName": "applicantDetails.middleName",
  "yourDetails.surname": "applicantDetails.surname",
  "yourDetails.relationshipToDeceased": "applicantDetails.applicantsRelationshipToDeceased",
  "yourDetails.relationshipToDeceasedOther": "applicantDetails.applicantsRelationshipToDeceasedIfOther",
  "yourDetails.applicantPassportOrThaiID": "applicantDetails.applicantsPassportOrThaiIdNumber",

  "nextOfKinDetails.firstName": "nokDetails.firstName",
  "nextOfKinDetails.middleName": "nokDetails.middleName",
  "nextOfKinDetails.surname": "nokDetails.surname",
  "nextOfKinDetails.relationshipToDeceased": "nokDetails.applicantsRelationshipToDeceased",
  "nextOfKinDetails.relationshipToDeceasedOther": "nokDetails.applicantsRelationshipToDeceasedIfOther",
  "nextOfKinDetails.applicantPassportOrThaiID": "nokDetails.applicantsPassportOrThaiIdNumber",

  funeralDirectorCompanyName: "companyDetails.companyName",
  funeralDirectorAddressLine1: "companyDetails.addressLine1",
  funeralDirectorAddressLine2: "companyDetails.addressLine2",
  funeralDirectorAddressLine3: "companyDetails.addressLine3",
  funeralDirectorTownOrCity: "companyDetails.townOrCity",
  funeralDirectorPostcode: "companyDetails.postcodeOrZipCode",

  deceasedFirstname: "deceasedDetails.firstName",
  deceasedMiddleName: "deceasedDetails.middleName",
  deceasedSurname: "deceasedDetails.surname",

  addressLine1: "deliveryAddress.addressLine1",
  addressLine2: "deliveryAddress.addressLine2",
  addressLine3: "deliveryAddress.addressLine3",
  townOrCity: "deliveryAddress.townOrCity",
  postcode: "deliveryAddress.postcodeOrZipCode",

  feedbackConsent: "feedbackConsent.feedbackConsent",
};
