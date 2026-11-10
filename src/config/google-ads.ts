export type GoogleAdsConversion = "contact" | "heatPump";

export const GOOGLE_ADS_ID = "AW-10796681126";

// Emergency/release gate. Event snippets compared with the supplied originals on 2026-11-10.
export const GOOGLE_ADS_ENABLED = true;

export const GOOGLE_ADS_SEND_TO: Readonly<Record<GoogleAdsConversion, string | null>> = {
  contact: "AW-10796681126/pEGMCKf9zrUdEKaPoZwo",
  heatPump: "AW-10796681126/qTv_CKr9zrUdEKaPoZwo",
};
