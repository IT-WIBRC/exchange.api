import { generateOtpCodeOf } from "./otp";

describe("Helpers", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("generateOtpCodeOf", () => {
    it("should return 4 digits when we provide 4 as a parameter", () => {
      jest.spyOn(Math, "random").mockReturnValue(0.1);
      expect(generateOtpCodeOf(4)).toBe(1111);
    });

    it("should return 8 digits when we provide 8 as a parameter", () => {
      jest.spyOn(Math, "random").mockReturnValue(0.1);
      expect(generateOtpCodeOf(8)).toBe(11111111);
    });
  });
});
