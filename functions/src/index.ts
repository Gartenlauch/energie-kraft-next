import { initializeApp } from "firebase-admin/app";
import { logger } from "firebase-functions";
import { setGlobalOptions } from "firebase-functions/v2";
import { onRequest } from "firebase-functions/v2/https";

initializeApp();

setGlobalOptions({
  region: "europe-west4",
});

export const health = onRequest((_request, response) => {
  logger.info("Energie-Kraft Functions health check");

  response.status(200).json({
    ok: true,
    service: "energie-kraft-functions",
  });
});