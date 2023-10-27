import { SESService } from "../ses";
import { ses } from "../../../__mocks__/SESClient";
jest.mock("../../../SESClient");

const OLD_ENV = process.env;

beforeEach(() => {
  jest.resetModules();
  process.env = { ...OLD_ENV };
});

describe("interpolateVars function", () => {
  test("interpolateVars should find all variables and replace with the corresponding values", () => {
    const sesService = new SESService();
    const testString = "This string has {{variable1}} and {{variable2}}";
    const testVars = {
      variable1: "bells",
      variable2: "whistles",
    };
    const stringResult = sesService.interpolateVars(testString, testVars);
    expect(stringResult).toEqual("This string has bells and whistles");
  });

  test("interpolateVars should throw an error if the templated string is empty", () => {
    const sesService = new SESService();
    const testString = undefined;
    const testVars = {};
    expect(() => {
      sesService.interpolateVars(testString, testVars);
    }).toThrow();
  });

  test("interpolateVars should throw and error if a key is missing from the templateVars", () => {
    const sesService = new SESService();
    const testString = "This is a string with a {{required}} variable";
    const testVars = {};
    expect(() => {
      sesService.interpolateVars(testString, testVars);
    }).toThrow();
  });
});

describe("getTemplate function", () => {
  test("Should return a template if a template is found", async () => {
    (ses.send as jest.Mock).mockResolvedValueOnce({
      Template: {
        TemplateName: "5678",
      },
    });

    const sesService = new SESService();
    const template = await sesService.getTemplate("cni");
    expect(template?.TemplateName).toBe("5678");
  });

  test("Should return undefined if the request succeeded but no template was returned", async () => {
    (ses.send as jest.Mock).mockResolvedValueOnce({});

    const sesService = new SESService();
    const template = await sesService.getTemplate("cni");
    expect(template).toBe(undefined);
  });

  // test("Should throw an error if the SES client responds with an error", async () => {
  //   (ses.send as jest.Mock).mockImplementationOnce(() => {
  //     Promise.reject(new Error());
  //   });
  //
  //   const sesService = new SESService();
  //   const template = await sesService.getTemplate("cni");
  //   console.log(template);
  // });
});
