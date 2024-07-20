export function generateOtp(): string {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  return otp;
}

export function textOtpMessage(otp: string) {
  return `El código para ingresar a helloChat es ${otp}`;
}
