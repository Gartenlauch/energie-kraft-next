import type {
  ConfiguratorLeadPayload,
  ConfiguratorPayload,
} from "./configurator-lead-validation";
import {
  LEAD_MAIL_RECIPIENT,
  sendMailgunMail,
} from "./mailgun";

import { readFileSync } from "node:fs";
import path from "node:path";

const CUSTOMER_MAIL_LOGO_FILENAME =
  "energie-kraft-logo.png";

const CUSTOMER_MAIL_LOGO =
  readFileSync(
    path.resolve(
      __dirname,
      "..",
      "assets",
      "branding",
      "energie-kraft-logo-transparent.png",
    ),
  );

interface SendConfiguratorCustomerMailInput {
  leadId: string;
  lead: ConfiguratorLeadPayload;
  pdf: Buffer;
  filename: string;
}

const PRODUCT_LABELS: Record<
  ConfiguratorPayload["type"],
  string
> = {
  photovoltaic:
    "Photovoltaik",

  battery_storage:
    "Stromspeicher",

  wallbox:
    "Wallbox",

  heat_pump:
    "Wärmepumpe",

  climate:
    "Klimaanlage",
};

function escapeHtml(
  value: string,
): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function buildProductBadgesHtml(
  products: readonly string[],
): string {
  return products
    .map(
      (product) => `
                <span
                    style="
                        display:inline-block;
                        margin:0 6px 8px 0;
                        padding:7px 12px;
                        border:1px solid #b9dbea;
                        border-radius:999px;
                        background:#edf7fb;
                        color:#005ca9;
                        font-size:13px;
                        font-weight:600;
                    "
                >
                    ${escapeHtml(product)}
                </span>
            `,
    )
    .join("");
}

export async function sendConfiguratorCustomerMail(
  input:
    SendConfiguratorCustomerMailInput,
) {
  const {
    lead,
    leadId,
    pdf,
    filename,
  } = input;

  const firstName =
    lead.contact.firstName.trim();

  const products =
    lead.products.map(
      (product) =>
        PRODUCT_LABELS[
        product
        ],
    );

  const productText =
    products.join(", ");

  const productBadgesHtml =
    buildProductBadgesHtml(
      products,
    );

  const text = [
    `Hallo ${firstName},`,
    "",
    "vielen Dank für deine Konfiguration bei Energie-Kraft.",
    "",
    "Im Anhang findest du deine persönliche Projektübersicht als PDF.",
    "",
    `Berücksichtigte Energielösungen: ${productText}`,
    "",
    `Referenz: ${leadId}`,
    "",
    "Wichtiger Hinweis:",
    "Die Ergebnisse dienen ausschließlich als unverbindliche Orientierung.",
    "Sie stellen kein Angebot und keine technische Planung dar.",
    "Verbindliche Aussagen zu Auslegung, Kosten und technischer Umsetzbarkeit sind erst nach fachlicher Prüfung möglich.",
    "",
    "Wir prüfen deine Angaben und melden uns bei dir.",
    "",
    "Viele Grüße",
    "Dein Energie-Kraft Team",
  ].join("\n");

  const html = `
<!doctype html>
<html lang="de">
  <body
    style="
      margin:0;
      padding:0;
      background:#f3f8fb;
      font-family:Montserrat,Arial,Helvetica,sans-serif;
      color:#19364a;
    "
  >
    <table
      role="presentation"
      width="100%"
      cellspacing="0"
      cellpadding="0"
      border="0"
      style="background:#f3f8fb;"
    >
      <tr>
        <td
          align="center"
          style="padding:32px 16px;"
        >
          <table
            role="presentation"
            width="100%"
            cellspacing="0"
            cellpadding="0"
            border="0"
            style="
              max-width:640px;
              background:#ffffff;
              border-radius:16px;
              overflow:hidden;
              border:1px solid #d1e4ef;
            "
          >
            <!-- Logo -->
            <tr>
              <td
                style="
                  padding:25px 34px 22px;
                  background:#ffffff;
                "
              >
                <img
                  src="cid:${CUSTOMER_MAIL_LOGO_FILENAME}"
                  alt="Energie-Kraft Süd"
                  width="220"
                  style="
                    display:block;
                    width:220px;
                    max-width:100%;
                    height:auto;
                    border:0;
                  "
                />
              </td>
            </tr>

            <!-- Hero -->
            <tr>
              <td
                style="
                  background:#005ca9;
                  border-left:6px solid #0da1d1;
                  padding:28px 34px;
                  color:#ffffff;
                "
              >
                <div
                  style="
                    font-size:12px;
                    font-weight:600;
                    letter-spacing:1.2px;
                    text-transform:uppercase;
                    color:#cceefa;
                  "
                >
                  Dein Energieprojekt
                </div>

                <div
                  style="
                    margin-top:10px;
                    font-size:26px;
                    line-height:1.25;
                    font-weight:700;
                  "
                >
                  Deine Projektübersicht ist da
                </div>
              </td>
            </tr>

            <!-- Inhalt -->
            <tr>
              <td
                style="
                  padding:34px;
                  font-size:16px;
                  line-height:1.65;
                "
              >
                <p style="margin-top:0;">
                  Hallo ${escapeHtml(firstName)},
                </p>

                <p>
                  vielen Dank für deine Konfiguration
                  bei Energie-Kraft.
                </p>

                <p>
                  Im Anhang findest du deine persönliche
                  Projektübersicht mit den wichtigsten
                  Angaben und Ergebnissen deines
                  Energieprojekts.
                </p>

                <!-- Projekt -->
                <div
                  style="
                    margin:28px 0;
                    padding:20px;
                    border:1px solid #d1e4ef;
                    border-radius:12px;
                    background:#f3f8fb;
                  "
                >
                  <div
                    style="
                      margin-bottom:12px;
                      font-size:13px;
                      font-weight:600;
                      color:#667d8c;
                    "
                  >
                    Dein Energieprojekt
                  </div>

                  <div>
                    ${productBadgesHtml}
                  </div>
                </div>

                <!-- PDF -->
                <div
                  style="
                    margin:28px 0;
                    padding:18px 20px;
                    border-left:4px solid #0da1d1;
                    background:#edf7fb;
                  "
                >
                  <strong
                    style="color:#005ca9;"
                  >
                    Deine Projektübersicht findest du
                    als PDF im Anhang dieser E-Mail.
                  </strong>
                </div>

                <p>
                  Wir prüfen deine Angaben und melden
                  uns bei dir, falls weitere technische
                  Details erforderlich sind.
                </p>

                <!-- Hinweis -->
                <div
                  style="
                    margin:28px 0;
                    padding:18px;
                    border:1px solid #b9dbea;
                    border-radius:10px;
                    background:#f3f8fb;
                    color:#35566d;
                    font-size:13px;
                    line-height:1.6;
                  "
                >
                  <strong style="color:#005ca9;">
                    Wichtiger Hinweis
                  </strong>

                  <br /><br />

                  Die Ergebnisse dienen ausschließlich
                  als unverbindliche Orientierung.
                  Sie stellen kein Angebot und keine
                  technische Planung dar. Verbindliche
                  Aussagen zu Auslegung, Kosten und
                  technischer Umsetzbarkeit sind erst
                  nach fachlicher Prüfung möglich.
                </div>

                <p
                  style="
                    margin-bottom:4px;
                    color:#667d8c;
                    font-size:12px;
                    text-transform:uppercase;
                    letter-spacing:.6px;
                  "
                >
                  Referenz
                </p>

                <p
                  style="
                    margin-top:0;
                    font-family:Arial,Helvetica,sans-serif;
                    font-size:13px;
                    font-weight:600;
                    color:#19364a;
                  "
                >
                  ${escapeHtml(leadId)}
                </p>

                <p style="margin-top:30px;">
                  Viele Grüße<br />
                  <strong style="color:#005ca9;">
                    Dein Energie-Kraft Team
                  </strong>
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td
                style="
                  padding:20px 34px;
                  background:#005ca9;
                  color:#ffffff;
                  font-size:12px;
                "
              >
                Energie-Kraft Süd
                &nbsp;&middot;&nbsp;
                energie-kraft.de
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;

  return sendMailgunMail({
    to: lead.contact.email,
    subject: "Deine persönliche Energie-Kraft Projektübersicht",
    text,
    html,
    /*
     * Antwort des Interessenten soll nicht
     * an die technische Versandadresse
     * website@notify... gehen.
     */
    replyTo: LEAD_MAIL_RECIPIENT,
    inlineAttachments: [
      {
        filename: CUSTOMER_MAIL_LOGO_FILENAME,
        data: CUSTOMER_MAIL_LOGO,
        contentType: "image/png",
      },
    ],
    attachments: [
      {
        filename,

        data:
          pdf,

        contentType:
          "application/pdf",
      },
    ],
  });
}