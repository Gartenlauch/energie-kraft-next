import type {
    ConfiguratorLeadPayload,
    ConfiguratorPayload,
} from "./configurator-lead-validation";
import {
    LEAD_MAIL_RECIPIENT,
    sendMailgunMail,
} from "./mailgun";

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
      <body style="
        margin:0;
        padding:0;
        background:#f4f6f3;
        font-family:Arial,Helvetica,sans-serif;
        color:#17211b;
      ">
        <table
          role="presentation"
          width="100%"
          cellspacing="0"
          cellpadding="0"
          border="0"
          style="background:#f4f6f3;"
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
                "
              >
                <tr>
                  <td
                    style="
                      background:#12372a;
                      padding:30px 34px;
                      color:#ffffff;
                    "
                  >
                    <div
                      style="
                        font-size:13px;
                        font-weight:700;
                        letter-spacing:1.2px;
                      "
                    >
                      ENERGIE-KRAFT
                    </div>

                    <div
                      style="
                        margin-top:14px;
                        font-size:26px;
                        line-height:1.25;
                        font-weight:700;
                      "
                    >
                      Deine Projektübersicht ist da
                    </div>
                  </td>
                </tr>

                <tr>
                  <td
                    style="
                      padding:34px;
                      font-size:16px;
                      line-height:1.65;
                    "
                  >
                    <p style="margin-top:0;">
                      Hallo
                      ${escapeHtml(firstName)},
                    </p>

                    <p>
                      vielen Dank für deine
                      Konfiguration bei
                      Energie-Kraft.
                    </p>

                    <p>
                      Im Anhang findest du deine
                      persönliche Projektübersicht
                      mit den wichtigsten Angaben
                      und Ergebnissen deines
                      Energieprojekts.
                    </p>

                    <div
                      style="
                        margin:26px 0;
                        padding:20px;
                        border:1px solid #d9e0da;
                        border-radius:12px;
                        background:#f7f9f7;
                      "
                    >
                      <div
                        style="
                          font-size:13px;
                          color:#66736b;
                        "
                      >
                        Dein Energieprojekt
                      </div>

                      <div
                        style="
                          margin-top:6px;
                          font-weight:700;
                          color:#12372a;
                        "
                      >
                        ${escapeHtml(
        productText,
    )}
                      </div>
                    </div>

                    <p>
                      Wir prüfen deine Angaben und
                      melden uns bei dir, falls
                      weitere technische Details
                      erforderlich sind.
                    </p>

                    <div
                      style="
                        margin:28px 0;
                        padding:18px;
                        border:1px solid #e3b341;
                        border-radius:10px;
                        background:#fff8e6;
                        color:#654b00;
                        font-size:14px;
                      "
                    >
                      <strong>
                        Wichtiger Hinweis
                      </strong>

                      <br /><br />

                      Die Ergebnisse dienen
                      ausschließlich als
                      unverbindliche Orientierung.
                      Sie stellen kein Angebot und
                      keine technische Planung dar.
                      Verbindliche Aussagen zu
                      Auslegung, Kosten und
                      technischer Umsetzbarkeit sind
                      erst nach fachlicher Prüfung
                      möglich.
                    </div>

                    <p
                      style="
                        margin-bottom:4px;
                        color:#66736b;
                        font-size:13px;
                      "
                    >
                      Referenz
                    </p>

                    <p
                      style="
                        margin-top:0;
                        font-family:monospace;
                        font-size:13px;
                      "
                    >
                      ${escapeHtml(leadId)}
                    </p>

                    <p style="margin-top:30px;">
                      Viele Grüße<br />
                      <strong>
                        Dein Energie-Kraft Team
                      </strong>
                    </p>
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
        to:
            lead.contact.email,

        subject:
            "Deine persönliche Energie-Kraft Projektübersicht",

        text,

        html,

        /*
         * Antwort des Interessenten soll nicht
         * an die technische Versandadresse
         * website@notify... gehen.
         */
        replyTo:
            LEAD_MAIL_RECIPIENT,

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