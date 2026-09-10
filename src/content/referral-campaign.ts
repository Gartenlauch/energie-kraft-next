/** BUSINESS_RECONFIRM_BEFORE_GO_LIVE */
export const REFERRAL_REWARD_EURO = 250 as const;
export const REFERRAL_TERMS_VERSION = "2025-03-01" as const;

/**
 * Vollständige Bedingungen der am 09.09.2026 öffentlich sichtbaren Legacy-Seite.
 * MUST_VERIFY_BEFORE_GO_LIVE: Prämie und Bedingungen fachlich/rechtlich erneut bestätigen.
 */
export const referralCampaignTerms = [
  "Die Empfehlung geht ab dem 1. März 2025 ein.",
  "Die Aktion gilt für Neukunden.",
  "Die empfohlene Person darf bei Energie-Kraft Süd noch nicht im System registriert sein.",
  "Die Empfehlung muss vor der Angebotserstellung eingehen.",
  "Die Auftragserteilung erfolgt innerhalb eines Jahres nach der Empfehlung.",
  "Pro Projekt kann nur eine Prämie ausgezahlt werden.",
  "Die Mindestauftragshöhe beträgt 10.000 Euro netto.",
  "Auch Personen, die noch nicht Kunde von Energie-Kraft Süd sind, können eine Empfehlung abgeben.",
  "Energie-Kraft Süd führt die Aktion freiwillig durch und kann sie jederzeit nach eigenem Ermessen beenden.",
] as const;
