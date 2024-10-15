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
    label                               | answers                                         | metadata                   | template
    ${"certifyCopy - adult - inPerson"} | ${{ over16: true }}                             | ${{ type: "certifyCopy" }} | ${"certify-copy-adult-template"}
    ${"certifyCopy - adult - postal"}   | ${{ over16: true, applicationType: "postal" }}  | ${{ type: "certifyCopy" }} | ${"certify-copy-adult-postal-template"}
    ${"certifyCopy - child - inPerson"} | ${{ over16: false }}                            | ${{ type: "certifyCopy" }} | ${"certify-copy-child-template"}
    ${"certifyCopy - adult - postal"}   | ${{ over16: false, applicationType: "postal" }} | ${{ type: "certifyCopy" }} | ${"certify-copy-child-postal-template"}
  `(`$template is returned for $label`, async ({ answers, metadata, template }) => {
    await userService.sendEmailToUser({ answers, metadata });

    expect(sendEmailSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        template,
      })
    );
  });
});
