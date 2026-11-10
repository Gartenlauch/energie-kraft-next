"use client";

import { useEffect } from "react";
import * as CookieConsent from "vanilla-cookieconsent";
import { LEGAL_ROUTES } from "@/config/legal-routes";
import { GOOGLE_ADS_ENABLED } from "@/config/google-ads";
import { publishConsent, readConsent } from "@/lib/consent/client";
import { CONSENT_LIFETIME_DAYS, CONSENT_REVISION, CONSENT_STORAGE_KEY } from "@/lib/consent/policy";
import "vanilla-cookieconsent/dist/cookieconsent.css";
import "./consent.css";

export function ConsentManager() {
  useEffect(() => {
    let disposed = false;
    let timer: ReturnType<typeof setTimeout>;
    let running: Promise<void> = Promise.resolve();

    const changed = () => {
      publishConsent("update");
      clearTimeout(timer);
      const consent = readConsent();
      if (consent) {
        // Browsers limit timeout to a signed 32-bit integer.
        timer = setTimeout(
          () => void restart(),
          Math.min(consent.expirationTime - Date.now() + 1, 2_147_000_000),
        );
      }
    };
    const start = async () => {
      if (disposed) return;
      if (!readConsent()) {
        try {
          localStorage.removeItem(CONSENT_STORAGE_KEY);
        } catch {
          /* Fail closed. */
        }
      }
      await CookieConsent.run({
        revision: CONSENT_REVISION,
        mode: "opt-in",
        hideFromBots: false,
        manageScriptTags: false,
        autoClearCookies: false,
        disablePageInteraction: true,
        cookie: {
          name: CONSENT_STORAGE_KEY,
          useLocalStorage: true,
          expiresAfterDays: CONSENT_LIFETIME_DAYS,
        },
        guiOptions: {
          consentModal: { layout: "bar", position: "bottom", equalWeightButtons: true },
          preferencesModal: { layout: "box", equalWeightButtons: true },
        },
        categories: {
          necessary: { enabled: true, readOnly: true },
          analytics: { enabled: false },
          marketing: { enabled: false },
          personalization: { enabled: false },
          googleReviews: { enabled: false },
        },
        language: {
          default: "de",
          translations: {
            de: {
              consentModal: {
                title: "Cookie-Einstellungen",
                description:
                  GOOGLE_ADS_ENABLED
                    ? "Notwendige Dienste sichern diese Website. Google Analytics 4, Google Ads zur Messung erfolgreich gesendeter Anfragen und Google-Bewertungen mit externen Autorenbildern erlauben Sie freiwillig und getrennt voneinander. Personalisierte Werbung bleibt deaktiviert. Ihre Auswahl können Sie jederzeit über „Cookie-Einstellungen“ im Footer ändern oder widerrufen."
                    : "Notwendige Dienste sichern diese Website. Google Analytics 4 zur statistischen Auswertung und Google-Bewertungen mit externen Autorenbildern erlauben Sie freiwillig. Werbung bleibt deaktiviert. Ihre Auswahl können Sie jederzeit über „Cookie-Einstellungen“ im Footer ändern oder widerrufen.",
                acceptAllBtn: "Alle akzeptieren",
                acceptNecessaryBtn: "Nur notwendige",
                showPreferencesBtn: "Einstellungen",
                footer: `<a href="${LEGAL_ROUTES.datenschutz.href}">Datenschutz</a><a href="${LEGAL_ROUTES.impressum.href}">Impressum</a>`,
              },
              preferencesModal: {
                title: "Cookie-Einstellungen",
                acceptAllBtn: "Alle akzeptieren",
                acceptNecessaryBtn: "Alle ablehnen",
                savePreferencesBtn: "Auswahl speichern",
                closeIconLabel: "Einstellungen schließen",
                sections: [
                  {
                    title: "Sie entscheiden",
                    description:
                      GOOGLE_ADS_ENABLED
                        ? "Alle optionalen Kategorien sind zunächst ausgeschaltet. Zum Widerruf deaktivieren Sie die betreffende Kategorie und speichern Ihre Auswahl oder wählen „Alle ablehnen“. Nach Widerruf der Conversion-Messung wird eine bereits mit Google Ads verbundene Seite neu geladen. Personalisierte Werbung bleibt technisch deaktiviert."
                        : "Alle optionalen Kategorien sind zunächst ausgeschaltet. Zum Widerruf deaktivieren Sie die betreffende Kategorie und speichern Ihre Auswahl oder wählen „Alle ablehnen“. Marketing und personalisierte Werbung bleiben technisch deaktiviert.",
                  },
                  {
                    title: "Notwendige Dienste",
                    description:
                      "Ermöglichen grundlegende Website-Funktionen und speichern Ihre Cookie-Auswahl lokal in diesem Browser. Funktionsnotwendige Zwischenspeicherung Ihrer Konfigurator-Eingaben bleibt davon unabhängig.",
                    linkedCategory: "necessary",
                  },
                  {
                    title: "Statistik – Google Analytics 4",
                    description:
                      "Wertet nach Ihrer Zustimmung Seitenaufrufe auf www.energie-kraft.de aus. Google Ireland Limited erhält dabei Cookie-Kennungen sowie Nutzungs-, Browser- und Geräteinformationen; eine Verarbeitung in den USA ist möglich. Analytics-Cookies sind höchstens 180 Tage gültig. Ohne Ihre Statistik-Einwilligung wird Google Analytics 4 nicht aktiviert und unsere Einbindung sendet keine Analytics-Ereignisse. Eine gesonderte Marketing-Einwilligung kann Google Ads aktivieren. Die Statistik-Einwilligung erlaubt keine Werbung oder Werbepersonalisierung.",
                    linkedCategory: "analytics",
                  },
                  {
                    title: "Marketing / Conversion-Messung – Google Ads",
                    description:
                      GOOGLE_ADS_ENABLED
                        ? "Misst nach Ihrer ausdrücklichen Zustimmung, ob Google-Anzeigen zu erfolgreich übermittelten Kontakt- oder Konfigurator-Anfragen führen. Google Ireland Limited erhält Cookie- und Anzeigenkennungen, eine zufällige Vorgangskennung sowie Nutzungs-, Browser- und Verbindungsdaten; eine Verarbeitung in den USA ist möglich. Formularinhalte werden nicht übergeben. Ohne Zustimmung wird Google Ads nicht aktiviert; eine Statistik-Freigabe allein genügt nicht. Bis zu 200 bereits gemeldete Vorgangskennungen werden zur Vermeidung von Doppelmeldungen für diese Browser-Sitzung gespeichert. Keine erweiterten Conversions oder personalisierte Werbung."
                        : "Vorgesehen zur Messung, ob Anzeigen zu Aktionen auf der Website führen. Erlaubt hierfür Werbespeicherung und die Übermittlung werbebezogener Nutzungsdaten an Google. Personalisierte Werbung benötigt eine zusätzliche Freigabe. Derzeit technisch deaktiviert.",
                    linkedCategory: "marketing",
                  },
                  {
                    title: "Personalisierte Werbung",
                    description:
                      "Personalisierte Werbung bieten wir derzeit nicht an. Die Auswahl dieser Kategorie aktiviert keine personalisierte Werbung.",
                    linkedCategory: "personalization",
                  },
                  {
                    title: "Google-Bewertungen",
                    description:
                      "Zeigt Google-Rezensionen einschließlich Autorenbildern an. Erst nach Ihrer Freigabe lädt Ihr Browser die Bilder direkt von Google; dabei werden Ihre IP-Adresse und technische Verbindungsdaten übermittelt. Eine Verarbeitung außerhalb der EU ist möglich. Ohne Freigabe erscheint ein Platzhalter. Bei Widerruf werden die Bewertungen ausgeblendet und keine weiteren Bilder abgerufen. Diese Kategorie aktiviert weder Statistik noch Werbung.",
                    linkedCategory: "googleReviews",
                  },
                  {
                    title: "Speicherung Ihrer Auswahl",
                    description: `Ihre Auswahl wird ${CONSENT_LIFETIME_DAYS} Tage in diesem Browser gespeichert, einschließlich Version und Zeitstempeln, ohne Formularwerte. Weitere Informationen: <a href="${LEGAL_ROUTES.datenschutz.href}">Datenschutz</a>.`,
                  },
                ],
              },
            },
          },
        },
        onConsent: changed,
        onChange: changed,
      });
      if (disposed) CookieConsent.reset(false);
      else changed();
    };
    function restart() {
      // Notify consumers synchronously; they read the current persisted decision.
      publishConsent("update");
      running = running.then(async () => {
        if (disposed) return;
        CookieConsent.reset(false);
        await start();
      });
      return running;
    }
    const storageChanged = (event: StorageEvent) => {
      if (event.key === CONSENT_STORAGE_KEY || event.key === null) void restart();
    };
    const refresh = () => {
      if (!readConsent() && CookieConsent.validConsent()) void restart();
      else publishConsent("update");
    };
    publishConsent("default");
    running = Promise.resolve().then(start);
    window.addEventListener("storage", storageChanged);
    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      disposed = true;
      clearTimeout(timer);
      window.removeEventListener("storage", storageChanged);
      window.removeEventListener("focus", refresh);
      document.removeEventListener("visibilitychange", refresh);
      CookieConsent.reset(false);
    };
  }, []);
  return null;
}
