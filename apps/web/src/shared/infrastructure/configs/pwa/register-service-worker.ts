import { logger } from "../../logging";

export const registerServiceWorker = () => {
  if (typeof window === "undefined") return;

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/pwaServiceWorker.js")
        .then((registration) => {
          logger.info("Service Worker registered successfully", {
            scope: registration.scope,
          });
        })
        .catch((error) => {
          logger.error("Service Worker registration failed", {
            error: error instanceof Error ? error.message : String(error),
          });
        });
    });
  }
};
