export const registerServiceWorker = () => {
  if (typeof window === "undefined") return;

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/pwaServiceWorker.js")
        .then((registration) => {
          console.info("Service Worker registered:", registration);
        })
        .catch((error) => {
          console.error("Service Worker registration failed:", error);
        });
    });
  }
};
