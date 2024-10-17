import { UserService } from "../UserService";
import { getPersonalisationBuilder } from "../getPersonalisationBuilder";

jest.mock("config", () => ({
  get(setting) {
    const templates = {
      "Notify.Template.affirmationUserConfirmation": "affirmation-template",
      "Notify.Template.cniUserConfirmation": "cni-template",
      "Notify.Template.cniUserPostalConfirmation": "cni-postal-template",
      "Notify.Template.mscUserConfirmation": "msc-template",
      "Notify.Template.cniMSCUserConfirmation": "cni-msc-template",
      "Notify.Template.exchangeUserConfirmation": "exchange-template",
      "Notify.Template.exchangeUserPostalConfirmation": "exchange-postal-template",
      "Notify.Template.certifyCopyAdultUserConfirmation": "certify-copy-adult-template",
      "Notify.Template.certifyCopyAdultUserPostalConfirmation": "certify-copy-adult-postal-template",
      "Notify.Template.certifyCopyChildUserConfirmation": "certify-copy-child-template",
      "Notify.Template.certifyCopyChildUserPostalConfirmation": "certify-copy-child-postal-template",
      "Notify.Template.requestDocument.J1": "request-document-j1",
      "Notify.Template.requestDocument.appointment": "request-document-appointment",
      "Notify.Template.requestDocument.courier": "request-document-courier",
      "Notify.Template.requestDocument.posted": "request-document-posted",
      "Notify.Template.requestDocument.indiaOrganTransplant": "request-document-india-organ",
      "Notify.Template.requestDocument.indaUniversity": "request-document-india-university",
      "Notify.Template.requestDocument.indiaArchives": "request-document-india-archives",
      "Notify.Template.requestDocument.panamaDrivingLicence": "request-document-panama",
      "Notify.Template.requestDocument.vietnamResidency": "request-document-vietnam-residency",
      "Notify.Template.requestDocument.thailandCitizenship": "request-document-thailand-citizenship",
      "Notify.Template.requestDocument.andorraMSC": "request-document-andorra-msc",
      "Notify.Template.requestDocument.certificateOfCustomLaw": "request-document-custom-law",
      "Notify.Template.requestDocument.mexicoCriminalRecord": "request-document-mexico",
    };
    return templates[setting];
  },
}));

jest.mock("../../UserService");
jest.mock("./../getPersonalisationBuilder");
const queueService = { sendToQueue: jest.fn() };
const userService = new UserService({ queueService });

(getPersonalisationBuilder as jest.Mock).mockReturnValue({
  inPerson: jest.fn().mockReturnValue({ key: "value" }),
  postal: jest.fn().mockReturnValue({ key: "value" }),
});

const sendEmailSpy = jest.spyOn(userService, "sendEmail");
beforeEach(() => {
  jest.clearAllMocks();
});

describe("sendEmailToUser - Marriage templates", () => {
  test.each`
    label                                         | answers                     | metadata                               | template
    ${"affirmation"}                              | ${{}}                       | ${{ type: "affirmation" }}             | ${"affirmation-template"}
    ${"exchange - inPerson"}                      | ${{}}                       | ${{ type: "exchange" }}                | ${"exchange-template"}
    ${"exchange - postal"}                        | ${{}}                       | ${{ type: "exchange", postal: true }}  | ${"exchange-postal-template"}
    ${"exchange - croatia"}                       | ${{ country: "Croatia" }}   | ${{ type: "exchange" }}                | ${"exchange-template"}
    ${"exchange - postal"}                        | ${{}}                       | ${{ type: "exchange", postal: false }} | ${"exchange-template"}
    ${"cni - defaults to cni"}                    | ${{}}                       | ${{ type: "cni" }}                     | ${"cni-template"}
    ${"cni - country supports postal / delivery"} | ${{ country: "Bulgaria" }}  | ${{ type: "cni", postal: true }}       | ${"cni-postal-template"}
    ${"cni - msc"}                                | ${{ service: "msc" }}       | ${{ type: "cni" }}                     | ${"msc-template"}
    ${"cni - defaults to cni"}                    | ${{ service: "cniAndMsc" }} | ${{ type: "cni" }}                     | ${"cni-msc-template"}
  `(`$template is returned for $label`, async ({ answers, metadata, template }) => {
    await userService.sendEmailToUser({ answers, metadata });

    expect(sendEmailSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        template,
      })
    );
  });
});

describe("sendEmailToUser - certifyCopy", () => {
  test.each`
    label                 | answers                                         | template
    ${"adult - inPerson"} | ${{ over16: true }}                             | ${"certify-copy-adult-template"}
    ${"adult - postal"}   | ${{ over16: true, applicationType: "postal" }}  | ${"certify-copy-adult-postal-template"}
    ${"child - inPerson"} | ${{ over16: false }}                            | ${"certify-copy-child-template"}
    ${"adult - postal"}   | ${{ over16: false, applicationType: "postal" }} | ${"certify-copy-child-postal-template"}
  `(`$template is returned for $label`, async ({ answers, template }) => {
    const metadata = { reference: "ref", type: "certifyCopy" };
    await userService.sendEmailToUser({ answers, metadata });

    expect(sendEmailSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        template,
      })
    );
  });
});

describe("sendEmailToUser - requestDocument", () => {
  test.each`
    document                                                                  | template
    ${"USA - J1 visa no objection statement"}                                 | ${"request-document-j1"}
    ${"Democratic Republic of the Congo - consular certificate"}              | ${"request-document-appointment"}
    ${"Vietnam - letter to support a permanent residency application"}        | ${"request-document-vietnam-residency"}
    ${"Panama - certificate of entitlement for a Panamanian driving licence"} | ${"request-document-panama"}
    ${"India - letter to access Indian state or national archives"}           | ${"request-document-india-archives"}
    ${"India - India - organ transplant letter"}                              | ${"request-document-india-organ"}
    ${"India - letter of introduction for admission to an Indian university"} | ${"request-document-india-university"}
    ${"Thailand - letter supporting Thai citizenship"}                        | ${"request-document-thailand-citizenship"}
    ${"Luxembourg - certificate of custom law"}                               | ${"request-document-custom-law"}
    ${"Belgium - certificate of custom law"}                                  | ${"request-document-custom-law"}
    ${"Andorra - MSC"}                                                        | ${"request-document-andorra-msc"}
    ${"Mexico - criminal record certificate letter"}                          | ${"request-document-mexico"}
  `(`$template is returned for $document`, async ({ document, template }) => {
    const metadata = { reference: "ref", type: "requestDocument" };
    const answers = { serviceType: document };
    await userService.sendEmailToUser({ answers, metadata });

    expect(sendEmailSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        template,
      })
    );
  });

  test.each`
    country                   | template
    ${"India"}                | ${"request-document-courier"}
    ${"Vietnam"}              | ${"request-document-appointment"}
    ${"Spain"}                | ${"request-document-posted"}
    ${"United Arab Emirates"} | ${"request-document-appointment"}
    ${"Thailand"}             | ${"request-document-posted"}
  `(`$template is returned for adoption - $country`, async ({ country, template }) => {
    const answers = {
      serviceType: "No objection certificate to adopt a child",
      applicationCountry: country,
    };
    const metadata = { reference: "ref", type: "requestDocument" };

    await userService.sendEmailToUser({ answers, metadata });

    expect(sendEmailSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        template,
      })
    );
  });
});
