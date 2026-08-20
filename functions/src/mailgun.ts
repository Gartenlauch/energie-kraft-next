import FormData from "form-data";
import Mailgun from "mailgun.js";

import { defineSecret } from "firebase-functions/params";

export const mailgunSendingKey = defineSecret(
  "MAILGUN_SENDING_KEY",
);

const MAILGUN_DOMAIN =
  "notify.energie-kraft.de";

const MAILGUN_API_URL =
  "https://api.eu.mailgun.net";

export const LEAD_MAIL_RECIPIENT =
  "anfrage@energie-kraft.de";

export const LEAD_MAIL_FROM =
  "Energie-Kraft Website <website@notify.energie-kraft.de>";

export interface SendMailInput {
  to: string;
  subject: string;
  text: string;
  html: string;
  replyTo?: string;
}

export interface SendMailResult {
  id: string;
  message: string;
}

export async function sendMailgunMail(
  input: SendMailInput,
): Promise<SendMailResult> {
  const mailgun = new Mailgun(FormData);

  const client = mailgun.client({
    username: "api",
    key: mailgunSendingKey.value(),
    url: MAILGUN_API_URL,
  });

  const result = await client.messages.create(
    MAILGUN_DOMAIN,
    {
      from: LEAD_MAIL_FROM,
      to: [input.to],
      subject: input.subject,
      text: input.text,
      html: input.html,

      ...(input.replyTo
        ? {
            "h:Reply-To": input.replyTo,
          }
        : {}),
    },
  );

  return {
    id: result.id ?? "",
    message: result.message ?? "",
  };
}