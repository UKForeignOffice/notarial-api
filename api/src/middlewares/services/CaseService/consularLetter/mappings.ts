export const order = {
  applicationDetails: "Application details",
  applicantDetails: "Applicant's details",
  nokDetails: "Details of deceased’s family",
  companyDetails: "Company address",
  deceasedDetails: "Details of the deceased",
  deliveryDetails: "Delivery details",
  contactDetails: "Contact details",
  feedback: "Feedback",
};

export const remap = {
  post: "information.post",
  nextOfKin: "applicationDetails.familyMember",
  isAppointedByNok: "applicationDetails.appointedByDeceasedFamily",
  hasDeceasedsPassport: "applicationDetails.hasDeceasedsPassport",

  phoneNumber: "contactDetails.phoneNumber",
  emailAddress: "contactDetails.emailAddress",

  "yourDetails.firstName": "applicantDetails.firstName",
  "yourDetails.middleName": "applicantDetails.middleName",
  "yourDetails.surname": "applicantDetails.surname",
  "yourDetails.relationshipToDeceased": "applicantDetails.applicantsRelationshipToDeceased",
  "yourDetails.RelationshipToDeceasedOther": "applicantDetails.applicantsRelationshipToDeceasedIfOther",
  "yourDetails.applicantPassportOrThaiID": "applicantDetails.applicantsPassportOrThaiIdNumber",

  "nextOfKinDetails.firstName": "nokDetails.firstName",
  "nextOfKinDetails.middleName": "nokDetails.middleName",
  "nextOfKinDetails.surname": "nokDetails.surname",
  "nextOfKinDetails.relationshipToDeceased": "nokDetails.applicantsRelationshipToDeceased",
  "nextOfKinDetails.relationshipToDeceasedOther": "nokDetails.applicantsRelationshipToDeceasedIfOther",
  "nextOfKinDetails.travelPassportNo": "nokDetails.applicantsPassportOrThaiIdNumber",
  "nextOfKinDetails.nokEmailAddress": "nokDetails.emailAddress",
  "nextOfKinDetails.nokPhoneNumber": "nokDetails.phoneNumber",

  funeralDirectorCompanyName: "companyDetails.companyName",
  funeralDirectorAddressLine1: "companyDetails.addressLine1",
  funeralDirectorAddressLine2: "companyDetails.addressLine2",
  funeralDirectorAddressLine3: "companyDetails.addressLine3",
  funeralDirectorTownOrCity: "companyDetails.townOrCity",
  funeralDirectorPostcode: "companyDetails.postcodeOrZipCode",

  deceasedFirstName: "deceasedDetails.firstName",
  deceasedMiddleName: "deceasedDetails.middleName",
  deceasedSurname: "deceasedDetails.surname",

  deceasedPassportNumber: "deceasedDetails.passportNumber",
  deceasedDateOfBirth: "deceasedDetails.dateOfBirth",
  deceasedPlaceOfDeath: "deceasedDetails.placeOfDeath",
  deceasedDateOfDeath: "deceasedDetails.dateOfDeath",

  letterChoice: "deliveryDetails.letterChoice",
  addressLine1: "deliveryDetails.addressLine1",
  addressLine2: "deliveryDetails.addressLine2",
  addressLine3: "deliveryDetails.addressLine3",
  townOrCity: "deliveryDetails.townOrCity",
  postcode: "deliveryDetails.postcodeOrZipCode",

  feedbackConsent: "feedback.feedbackConsent",
  feedbackContactPref: "feedback.contactPreference",
};
