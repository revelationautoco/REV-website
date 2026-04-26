import { Resend } from "resend";

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("Missing RESEND_API_KEY.");
  return new Resend(key);
}

export async function sendLeadEmails(opts: {
  toCustomer: string;
  customerName: string;
  ownerEmail: string;
  fromEmail: string;
  subject: string;
  textCustomer: string;
  textOwner: string;
}) {
  const resend = getResend();
  const [{ error: ownerErr }, { error: customerErr }] = await Promise.all([
    resend.emails.send({
      from: opts.fromEmail,
      to: [opts.ownerEmail],
      subject: `New lead: ${opts.subject}`,
      text: opts.textOwner,
    }),
    resend.emails.send({
      from: opts.fromEmail,
      to: [opts.toCustomer],
      subject: `We got your request — ${opts.subject}`,
      text: opts.textCustomer,
    }),
  ]);

  if (ownerErr) throw new Error(`Owner email failed: ${ownerErr.message}`);
  if (customerErr) throw new Error(`Customer email failed: ${customerErr.message}`);
}

