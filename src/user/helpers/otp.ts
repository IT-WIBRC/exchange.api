export const generateOtpCodeOf = (digitLength: number): number => {
  const digits = "0123456789";
  let OTP = "";
  const length = digits.length;
  for (let digit = 0; digit < digitLength; digit++) {
    OTP += digits[Math.floor(Math.random() * length)];
  }

  return Number(OTP);
};
