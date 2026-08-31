import { mock } from "jest-mock-extended";
import { FormDataBody } from "../../../../types";
import { CertifyCopyCaseService, ConsularLetterCaseService, MarriageCaseService, RequestDocumentCaseService } from "../../CaseService";
import { UserService } from "../../UserService";
import { SubmitService } from "../SubmitService";

test.each([
  ["simplified", "simplified-marriage-v1", { isCivilPartnership: true }],
  ["legacy", undefined, {}],
])("%s submissions handle the civil partnership selection correctly", async (_label, source, expectedAnswers) => {
  const userService = mock<UserService>();
  const marriageCaseService = mock<MarriageCaseService>();
  marriageCaseService.buildProcessQueueData.mockReturnValue({
    fields: [],
    metadata: {
      reference: "reference",
      type: "affirmation",
    },
  });

  const submitService = new SubmitService({
    userService,
    marriageCaseService,
    certifyCopyCaseService: mock<CertifyCopyCaseService>(),
    requestDocumentCaseService: mock<RequestDocumentCaseService>(),
    consularLetterCaseService: mock<ConsularLetterCaseService>(),
  });
  const formData: FormDataBody = {
    name: "affirmation",
    questions: [],
    isCivilPartnership: true,
    metadata: {
      paymentSkipped: true,
      type: "affirmation",
      source,
    },
  };

  await submitService.submitForm(formData);

  expect(userService.sendToProcessQueue).toHaveBeenCalledWith(
    expectedAnswers,
    expect.objectContaining({ type: "affirmation" })
  );
});
