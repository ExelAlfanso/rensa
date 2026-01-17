async function getResend() {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is not set");
  }

  const { Resend } = await import("resend");

  return new Resend(process.env.RESEND_API_KEY);
}

export default getResend;
